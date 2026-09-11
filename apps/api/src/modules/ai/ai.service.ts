import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import {
  AISecurityContext,
  AIQueryIntent,
  AIQueryResult,
  AIQueryRequest,
  AIForecastSuite,
  AIInsight,
  AIAuditLogEntry,
  AIChartType,
} from '@hive/types';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  // In-memory audit log repository
  private auditLogs: AIAuditLogEntry[] = [
    {
      id: 'audit-ai-101',
      userId: 'usr-admin-1',
      userName: 'Deepak Sharma',
      userRole: 'SUPER_ADMIN',
      branchId: undefined,
      branchName: 'All Branches (Enterprise Scope)',
      question: 'Which branch had the highest revenue this month?',
      intent: 'BRANCH_PERFORMANCE',
      generatedSql: 'SELECT b.name AS branch_name, SUM(i.grand_total) AS total_revenue FROM branches b JOIN invoices i ON b.id = i.branch_id WHERE i.organization_id = :orgId AND i.created_at >= DATE_TRUNC(\'month\', NOW()) GROUP BY b.name ORDER BY total_revenue DESC;',
      executionTimeMs: 42,
      rowCount: 4,
      status: 'SUCCESS',
      securityContext: {
        organizationId: 'org-hive-001',
        branchId: undefined,
        role: 'SUPER_ADMIN',
        permissions: ['ai:read', 'analytics:revenue', 'audit:read'],
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: 'audit-ai-102',
      userId: 'usr-mgr-jubilee',
      userName: 'Kavita Reddy',
      userRole: 'BRANCH_MANAGER',
      branchId: 'b1',
      branchName: 'Jubilee Hills Flagship',
      question: 'Which stylist generated the highest revenue?',
      intent: 'STAFF_PRODUCTIVITY',
      generatedSql: 'SELECT s.full_name, SUM(i.grand_total) AS total_revenue, COUNT(i.id) AS bills_count FROM staff_profiles s JOIN invoices i ON s.id = i.primary_stylist_id WHERE i.organization_id = :orgId AND i.branch_id = \'b1\' AND i.created_at >= DATE_TRUNC(\'month\', NOW()) GROUP BY s.full_name ORDER BY total_revenue DESC;',
      executionTimeMs: 38,
      rowCount: 4,
      status: 'SUCCESS',
      securityContext: {
        organizationId: 'org-hive-001',
        branchId: 'b1',
        role: 'BRANCH_MANAGER',
        permissions: ['ai:read', 'analytics:staff'],
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  ];

  // ---------------------------------------------------------------------------
  // 1. SQL SECURITY & AST VALIDATOR
  // ---------------------------------------------------------------------------
  private validateSqlSecurity(sql: string): { isSafe: boolean; violationReason?: string } {
    const upper = sql.toUpperCase();

    // 1. Strictly forbid DDL & DML mutations
    const forbiddenKeywords = [
      'INSERT',
      'UPDATE',
      'DELETE',
      'DROP',
      'ALTER',
      'TRUNCATE',
      'CREATE',
      'GRANT',
      'REVOKE',
      'EXEC',
      'EXECUTE',
      'SHUTDOWN',
      'REINDEX',
      'VACUUM',
    ];

    for (const kw of forbiddenKeywords) {
      // Regex check ensuring full keyword match
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(upper)) {
        return {
          isSafe: false,
          violationReason: `Mutation operation detected: "${kw}" is strictly forbidden. Hive Salon AI operates in read-only mode.`,
        };
      }
    }

    // 2. Reject multi-statements, semicolons, and SQL comments
    if (sql.includes(';') && sql.indexOf(';') !== sql.length - 1) {
      return {
        isSafe: false,
        violationReason: 'Multi-statement execution (semicolon delimiter) is prohibited.',
      };
    }

    if (sql.includes('--') || sql.includes('/*') || sql.includes('*/')) {
      return {
        isSafe: false,
        violationReason: 'SQL comment markers are prohibited to prevent injection vectors.',
      };
    }

    // 3. Must begin with SELECT or WITH
    const trimmed = upper.trim();
    if (!trimmed.startsWith('SELECT') && !trimmed.startsWith('WITH')) {
      return {
        isSafe: false,
        violationReason: 'Only read-only SELECT or CTE queries are authorized.',
      };
    }

    return { isSafe: true };
  }

  // ---------------------------------------------------------------------------
  // 2. TEXT-TO-SQL INTENT DETECTION & RBAC QUERY BUILDER
  // ---------------------------------------------------------------------------
  public async executeQuery(
    request: AIQueryRequest,
    callerContext?: Partial<AISecurityContext>
  ): Promise<AIQueryResult> {
    const startTime = Date.now();
    const question = request.question.trim();

    // Resolve security context
    const secContext: AISecurityContext = {
      organizationId: callerContext?.organizationId || request.securityContext?.organizationId || 'org-hive-001',
      stateId: callerContext?.stateId || request.securityContext?.stateId,
      districtId: callerContext?.districtId || request.securityContext?.districtId,
      cityId: callerContext?.cityId || request.securityContext?.cityId,
      branchId: callerContext?.branchId || request.securityContext?.branchId,
      role: callerContext?.role || request.securityContext?.role || 'SUPER_ADMIN',
      permissions: callerContext?.permissions || request.securityContext?.permissions || ['ai:read', 'analytics:all'],
      userId: callerContext?.userId || request.securityContext?.userId || 'usr-admin-1',
      userEmail: callerContext?.userEmail || request.securityContext?.userEmail || 'admin@hivesalon.com',
    };

    const isBranchScoped = !!secContext.branchId && secContext.role !== 'SUPER_ADMIN';
    const branchScopeDesc = isBranchScoped ? `Branch Restricted: ${secContext.branchId}` : 'Enterprise Multi-Branch Scope';

    const normalized = question.toLowerCase();

    let intent: AIQueryIntent = 'CUSTOM_ANALYTICS';
    let generatedSql = '';
    let executiveSummary = '';
    let kpis: any[] = [];
    let chart: any = undefined;
    let table: any = undefined;
    let suggestedFollowUps: string[] = [];

    // =========================================================================
    // INTENT 1: TODAY'S SALES / HOW MUCH DID WE SELL TODAY
    // =========================================================================
    if (
      normalized.includes('sell today') ||
      normalized.includes('sold today') ||
      normalized.includes('today\'s sales') ||
      normalized.includes('revenue today') ||
      normalized.includes('today revenue')
    ) {
      intent = 'REVENUE_ANALYSIS';
      generatedSql = isBranchScoped
        ? `SELECT DATE_TRUNC('hour', i.created_at) AS time_slot, SUM(i.grand_total) AS revenue, COUNT(i.id) AS bills, SUM(i.service_total) AS service_rev, SUM(i.product_total) AS retail_rev FROM invoices i WHERE i.organization_id = '${secContext.organizationId}' AND i.branch_id = '${secContext.branchId}' AND i.created_at >= CURRENT_DATE GROUP BY time_slot ORDER BY time_slot ASC;`
        : `SELECT DATE_TRUNC('hour', i.created_at) AS time_slot, SUM(i.grand_total) AS revenue, COUNT(i.id) AS bills, SUM(i.service_total) AS service_rev, SUM(i.product_total) AS retail_rev FROM invoices i WHERE i.organization_id = '${secContext.organizationId}' AND i.created_at >= CURRENT_DATE GROUP BY time_slot ORDER BY time_slot ASC;`;

      const todayTotal = isBranchScoped ? 94250 : 284600;
      const target = isBranchScoped ? 100000 : 300000;
      const pctOfTarget = Math.round((todayTotal / target) * 100);

      executiveSummary = isBranchScoped
        ? `Today’s revenue for your branch stands at ₹${(todayTotal / 1000).toFixed(1)}k across 38 completed guest visits, achieving ${pctOfTarget}% of the daily target. Services contributed 76% (₹71.6k) and Retail Sales contributed 24% (₹22.6k).`
        : `Across all salon branches, total revenue today is ₹${(todayTotal / 100000).toFixed(2)} Lakhs across 114 completed client visits (${pctOfTarget}% of the ₹3.0L daily target). In-salon services contributed ₹2.18L and retail sales contributed ₹66.6k.`;

      kpis = [
        { label: 'Today Total Sales', value: `₹${(todayTotal / 1000).toLocaleString('en-IN')}k`, change: '+18.4% vs yesterday', changeType: 'positive' },
        { label: 'Completed Invoices', value: isBranchScoped ? '38 bills' : '114 bills', subtitle: 'Avg ₹2,496/bill' },
        { label: 'Daily Target Pacing', value: `${pctOfTarget}%`, change: 'Target: ₹3.0L', changeType: 'positive' },
        { label: 'Retail Attach Rate', value: '23.4%', change: '+4.2% uplift', changeType: 'positive' },
      ];

      chart = {
        type: request.preferredChartType || 'AREA',
        title: 'Today Hourly Revenue Trend (INR)',
        subtitle: 'Intraday sales pacing from 09:00 AM to 08:00 PM',
        xAxisLabels: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '8 PM'],
        datasets: [
          { label: 'Today Revenue (₹)', data: isBranchScoped ? [8200, 16400, 24500, 18900, 21400, 32100, 18200] : [24000, 48000, 72000, 56000, 68000, 96000, 52000], color: '#f59e0b' },
          { label: 'Yesterday Baseline', data: isBranchScoped ? [6500, 14200, 20100, 16500, 19000, 27000, 15000] : [19500, 41000, 61000, 49000, 58000, 82000, 44000], color: '#64748b' },
        ],
        unitPrefix: '₹',
      };

      table = {
        columns: [
          { key: 'timeSlot', header: 'Hour Slot' },
          { key: 'bills', header: 'Visits' },
          { key: 'services', header: 'Services (₹)', isCurrency: true },
          { key: 'retail', header: 'Retail (₹)', isCurrency: true },
          { key: 'total', header: 'Total Revenue (₹)', isCurrency: true },
        ],
        rows: [
          { timeSlot: '09:00 AM - 11:00 AM', bills: isBranchScoped ? 5 : 16, services: isBranchScoped ? 6400 : 19200, retail: isBranchScoped ? 1800 : 4800, total: isBranchScoped ? 8200 : 24000 },
          { timeSlot: '11:00 AM - 01:00 PM', bills: isBranchScoped ? 8 : 24, services: isBranchScoped ? 12800 : 38400, retail: isBranchScoped ? 3600 : 9600, total: isBranchScoped ? 16400 : 48000 },
          { timeSlot: '01:00 PM - 03:00 PM', bills: isBranchScoped ? 11 : 32, services: isBranchScoped ? 19100 : 57300, retail: isBranchScoped ? 5400 : 14700, total: isBranchScoped ? 24500 : 72000 },
          { timeSlot: '03:00 PM - 05:00 PM', bills: isBranchScoped ? 7 : 21, services: isBranchScoped ? 14700 : 44100, retail: isBranchScoped ? 4200 : 11900, total: isBranchScoped ? 18900 : 56000 },
          { timeSlot: '05:00 PM - 07:00 PM', bills: isBranchScoped ? 12 : 36, services: isBranchScoped ? 25000 : 75000, retail: isBranchScoped ? 7100 : 21000, total: isBranchScoped ? 32100 : 96000 },
        ],
        totalRowCount: 5,
      };

      suggestedFollowUps = [
        'Which stylist generated the highest revenue today?',
        'Which services are most popular today?',
        'Show me retail products sold today',
      ];
    }

    // =========================================================================
    // INTENT 2: BRANCH PERFORMANCE / WHICH BRANCH PERFORMED BEST THIS MONTH
    // =========================================================================
    else if (
      normalized.includes('branch performed') ||
      normalized.includes('best branch') ||
      normalized.includes('highest revenue this month') ||
      normalized.includes('branch revenue') ||
      normalized.includes('which branch')
    ) {
      intent = 'BRANCH_PERFORMANCE';
      generatedSql = `SELECT b.id, b.name AS branch_name, b.code, SUM(i.grand_total) AS total_revenue, COUNT(i.id) AS total_visits, AVG(i.grand_total) AS avg_ticket_size, (SUM(i.grand_total) - SUM(e.amount)) AS net_profit FROM branches b LEFT JOIN invoices i ON b.id = i.branch_id AND i.organization_id = '${secContext.organizationId}' AND i.created_at >= DATE_TRUNC('month', NOW()) LEFT JOIN expenses e ON b.id = e.branch_id AND e.created_at >= DATE_TRUNC('month', NOW()) WHERE b.organization_id = '${secContext.organizationId}' GROUP BY b.id, b.name, b.code ORDER BY total_revenue DESC;`;

      executiveSummary =
        'Jubilee Hills Flagship generated the highest revenue this month at ₹8.42 Lakh across 412 guest visits with an average ticket value of ₹2,043. Indiranagar Sanctuary followed closely in second place with ₹7.30 Lakh, driven by strong luxury aesthetic memberships.';

      kpis = [
        { label: 'Top Performing Branch', value: 'Jubilee Hills', subtitle: '₹8.42 Lakh Revenue' },
        { label: 'Network Total Revenue', value: '₹26.77 Lakh', change: '+14.2% MoM', changeType: 'positive' },
        { label: 'Top Average Ticket', value: '₹2,380', subtitle: 'Indiranagar Sanctuary' },
        { label: 'Total Network Visits', value: '1,280 Visits', change: '84.6% Chair Occupancy' },
      ];

      chart = {
        type: request.preferredChartType || 'BAR',
        title: 'Monthly Branch Revenue Comparison (M-T-D)',
        subtitle: 'Net collections in Lakhs (INR)',
        xAxisLabels: ['Jubilee Hills', 'Indiranagar', 'Banjara Hills', 'Hitech City'],
        datasets: [
          { label: 'Revenue (₹ Lakhs)', data: [8.42, 7.3, 6.15, 4.9], color: '#f59e0b' },
          { label: 'Operating Costs (₹ Lakhs)', data: [4.8, 4.1, 3.6, 2.9], color: '#3b82f6' },
        ],
        unitPrefix: '₹',
        unitSuffix: 'L',
      };

      table = {
        columns: [
          { key: 'branch', header: 'Branch Name' },
          { key: 'visits', header: 'Total Visits' },
          { key: 'ticket', header: 'Avg Ticket', isCurrency: true },
          { key: 'occupancy', header: 'Occupancy Rate' },
          { key: 'revenue', header: 'Total Revenue (₹)', isCurrency: true },
          { key: 'growth', header: 'MoM Growth' },
        ],
        rows: [
          { branch: 'Jubilee Hills Flagship', visits: 412, ticket: 2043, occupancy: '89.4%', revenue: 842000, growth: '+16.2%' },
          { branch: 'Indiranagar Sanctuary', visits: 306, ticket: 2385, occupancy: '84.1%', revenue: 730000, growth: '+18.5%' },
          { branch: 'Banjara Hills Spa', visits: 318, ticket: 1933, occupancy: '78.6%', revenue: 615000, growth: '+9.4%' },
          { branch: 'Hitech City Express', visits: 244, ticket: 2008, occupancy: '72.0%', revenue: 490000, growth: '+11.1%' },
        ],
        totalRowCount: 4,
      };

      suggestedFollowUps = [
        'Which services contributed most to Jubilee Hills revenue?',
        'Show me expense breakdown across all branches',
        'Forecast next month branch performance',
      ];
    }

    // =========================================================================
    // INTENT 3: STYLIST PRODUCTIVITY / HIGHEST REVENUE STYLIST
    // =========================================================================
    else if (
      normalized.includes('stylist') ||
      normalized.includes('highest revenue') && normalized.includes('who') ||
      normalized.includes('staff performance') ||
      normalized.includes('top stylist')
    ) {
      intent = 'STAFF_PRODUCTIVITY';
      generatedSql = isBranchScoped
        ? `SELECT s.id, s.full_name AS stylist_name, s.designation, SUM(ii.total_price) AS service_revenue, COUNT(DISTINCT i.id) AS clients_served, AVG(r.rating) AS avg_rating, SUM(c.commission_amount) AS earned_commission FROM staff_profiles s JOIN invoice_items ii ON s.id = ii.staff_id JOIN invoices i ON ii.invoice_id = i.id LEFT JOIN customer_reviews r ON s.id = r.staff_id LEFT JOIN commission_ledger c ON s.id = c.staff_id WHERE s.organization_id = '${secContext.organizationId}' AND s.branch_id = '${secContext.branchId}' AND i.created_at >= DATE_TRUNC('month', NOW()) GROUP BY s.id, s.full_name, s.designation ORDER BY service_revenue DESC;`
        : `SELECT s.id, s.full_name AS stylist_name, b.name AS branch_name, s.designation, SUM(ii.total_price) AS service_revenue, COUNT(DISTINCT i.id) AS clients_served, AVG(r.rating) AS avg_rating FROM staff_profiles s JOIN branches b ON s.branch_id = b.id JOIN invoice_items ii ON s.id = ii.staff_id JOIN invoices i ON ii.invoice_id = i.id LEFT JOIN customer_reviews r ON s.id = r.staff_id WHERE s.organization_id = '${secContext.organizationId}' AND i.created_at >= DATE_TRUNC('month', NOW()) GROUP BY s.id, s.full_name, b.name, s.designation ORDER BY service_revenue DESC;`;

      executiveSummary =
        'Master Stylist Priya Sharma generated the highest revenue this month at ₹3.24 Lakh across 94 clients with a 4.95★ rating and 91% rebooking rate. Rajesh Kumar ranked 2nd with ₹2.80 Lakh specializing in Keratin and Hair Color transformations.';

      kpis = [
        { label: 'Top Generating Stylist', value: 'Priya Sharma', subtitle: '₹3.24 Lakh (94 Clients)' },
        { label: 'Average Stylist Revenue', value: '₹2.12 Lakh', change: '+12.8% vs last month', changeType: 'positive' },
        { label: 'Top Guest Satisfaction', value: '4.95 ★', subtitle: 'Priya Sharma (68 reviews)' },
        { label: 'Total Commissions Accrued', value: '₹2.48 Lakh', subtitle: '18% Avg Payout' },
      ];

      chart = {
        type: request.preferredChartType || 'BAR',
        title: 'Stylist Monthly Revenue Leaderboard',
        subtitle: 'Individual revenue generation (INR Thousands)',
        xAxisLabels: ['Priya Sharma', 'Rajesh Kumar', 'Ananya Roy', 'Vikram Malhotra', 'Siddharth Sen', 'Sneha Kapoor'],
        datasets: [
          { label: 'Service Revenue (₹k)', data: [275, 238, 205, 168, 142, 134], color: '#f59e0b' },
          { label: 'Retail Up-sells (₹k)', data: [49, 42, 40, 27, 22, 18], color: '#10b981' },
        ],
        unitPrefix: '₹',
        unitSuffix: 'k',
      };

      table = {
        columns: [
          { key: 'name', header: 'Stylist Name' },
          { key: 'role', header: 'Designation' },
          { key: 'branch', header: 'Branch' },
          { key: 'clients', header: 'Clients' },
          { key: 'rating', header: 'Guest Rating' },
          { key: 'revenue', header: 'Total Revenue (₹)', isCurrency: true },
          { key: 'commission', header: 'Commission (₹)', isCurrency: true },
        ],
        rows: [
          { name: 'Priya Sharma', role: 'Master Stylist', branch: 'Jubilee Hills', clients: 94, rating: '4.95 ★', revenue: 324000, commission: 48600 },
          { name: 'Rajesh Kumar', role: 'Senior Colorist', branch: 'Jubilee Hills', clients: 82, rating: '4.90 ★', revenue: 280000, commission: 42000 },
          { name: 'Ananya Roy', role: 'Principal Aesthetician', branch: 'Indiranagar', clients: 76, rating: '4.92 ★', revenue: 245000, commission: 36750 },
          { name: 'Vikram Malhotra', role: 'Senior Stylist', branch: 'Banjara Hills', clients: 68, rating: '4.85 ★', revenue: 195000, commission: 29250 },
          { name: 'Siddharth Sen', role: 'Master Barber', branch: 'Hitech City', clients: 88, rating: '4.88 ★', revenue: 164000, commission: 24600 },
        ],
        totalRowCount: 5,
      };

      suggestedFollowUps = [
        'Which services did Priya Sharma perform most?',
        'Show commission breakdown for Rajesh Kumar',
        'Which stylist has the highest retail cross-sell conversion?',
      ];
    }

    // =========================================================================
    // INTENT 4: SERVICE POPULARITY / POPULAR SERVICES
    // =========================================================================
    else if (
      normalized.includes('service') &&
      (normalized.includes('popular') || normalized.includes('most') || normalized.includes('top') || normalized.includes('demand'))
    ) {
      intent = 'SERVICE_POPULARITY';
      generatedSql = `SELECT s.id, s.name AS service_name, sc.name AS category_name, COUNT(ii.id) AS total_bookings, SUM(ii.total_price) AS total_revenue, AVG(s.duration_minutes) AS avg_duration FROM services s JOIN service_categories sc ON s.category_id = sc.id JOIN invoice_items ii ON s.id = ii.service_id JOIN invoices i ON ii.invoice_id = i.id WHERE s.organization_id = '${secContext.organizationId}' AND i.created_at >= DATE_TRUNC('month', NOW()) GROUP BY s.id, s.name, sc.name ORDER BY total_revenue DESC;`;

      executiveSummary =
        'Balayage Color Melting & Hair Botox was the highest revenue service category generating ₹5.84 Lakh across 146 appointments, followed by Brazilian Keratin Smoothing (₹4.25 Lakh) and Hydra-Facial Glow treatments (₹3.90 Lakh).';

      kpis = [
        { label: 'Top Revenue Service', value: 'Balayage Color', subtitle: '₹5.84 Lakh Generated' },
        { label: 'Most Booked Treatment', value: 'Executive Fade & Beard', subtitle: '312 Appointments' },
        { label: 'Highest Margin Service', value: 'Hydra-Facial Luxe', subtitle: '82% Gross Margin' },
        { label: 'Average Service Ticket', value: '₹2,450', change: '+8.4% vs Q1', changeType: 'positive' },
      ];

      chart = {
        type: request.preferredChartType || 'DONUT',
        title: 'Service Revenue Contribution by Category',
        subtitle: 'Share of salon service revenue (M-T-D)',
        xAxisLabels: ['Hair Color & Highlights', 'Hair Treatments & Botox', 'Aesthetics & Facials', 'Cuts & Styling', 'Spa & Rituals', 'Nail & Pedicure'],
        datasets: [
          { label: 'Revenue Share (₹ Lakhs)', data: [8.2, 6.4, 5.1, 3.8, 2.9, 1.8], color: '#f59e0b' },
        ],
        unitPrefix: '₹',
        unitSuffix: 'L',
      };

      table = {
        columns: [
          { key: 'service', header: 'Service Name' },
          { key: 'category', header: 'Category' },
          { key: 'bookings', header: 'Bookings' },
          { key: 'avgPrice', header: 'Price', isCurrency: true },
          { key: 'revenue', header: 'Total Revenue (₹)', isCurrency: true },
          { key: 'share', header: 'Share of Sales' },
        ],
        rows: [
          { service: 'Artisan Balayage & Olaplex Glaze', category: 'Hair Color', bookings: 146, avgPrice: 4000, revenue: 584000, share: '24.2%' },
          { service: 'Keratin Smoothing Complex', category: 'Treatments', bookings: 85, avgPrice: 5000, revenue: 425000, share: '17.6%' },
          { service: 'Hydra-Facial Oxygen Glow', category: 'Skin Aesthetics', bookings: 112, avgPrice: 3500, revenue: 392000, share: '16.2%' },
          { service: 'Signature Hair Spa & Scalp Scrub', category: 'Hair Treatments', bookings: 138, avgPrice: 1800, revenue: 248400, share: '10.3%' },
          { service: 'Executive Haircut & Royal Shave', category: 'Cuts & Grooming', bookings: 215, avgPrice: 1000, revenue: 215000, share: '8.9%' },
        ],
        totalRowCount: 5,
      };

      suggestedFollowUps = [
        'Which services have declining demand?',
        'Which retail products pair best with Balayage?',
        'What is the chair occupancy for Hair Color?',
      ];
    }

    // =========================================================================
    // INTENT 5: INVENTORY RUNNING LOW / LOW STOCK PRODUCTS
    // =========================================================================
    else if (
      normalized.includes('running low') ||
      normalized.includes('low stock') ||
      normalized.includes('product') && (normalized.includes('inventory') || normalized.includes('stock')) ||
      normalized.includes('stockout')
    ) {
      intent = 'INVENTORY_LEVELS';
      generatedSql = isBranchScoped
        ? `SELECT p.id, p.name, p.sku, b.name AS branch_name, i.current_stock, i.min_stock_level, i.reorder_quantity, (i.current_stock / NULLIF(i.daily_burn_rate, 0)) AS days_until_stockout FROM products p JOIN branch_inventory i ON p.id = i.product_id JOIN branches b ON i.branch_id = b.id WHERE p.organization_id = '${secContext.organizationId}' AND i.branch_id = '${secContext.branchId}' AND i.current_stock <= i.min_stock_level ORDER BY days_until_stockout ASC;`
        : `SELECT p.id, p.name, p.sku, b.name AS branch_name, i.current_stock, i.min_stock_level, i.reorder_quantity, (i.current_stock / NULLIF(i.daily_burn_rate, 0)) AS days_until_stockout FROM products p JOIN branch_inventory i ON p.id = i.product_id JOIN branches b ON i.branch_id = b.id WHERE p.organization_id = '${secContext.organizationId}' AND i.current_stock <= i.min_stock_level ORDER BY days_until_stockout ASC;`;

      executiveSummary =
        'There are 4 high-demand products currently running below safety buffer thresholds. Olaplex No. 3 Hair Perfector at Jubilee Hills has only 5 units remaining (estimated 2 days until complete stockout). Urgent purchase order reorders are recommended.';

      kpis = [
        { label: 'Critical Stockout Alerts', value: '4 Items', change: 'Action Required', changeType: 'negative' },
        { label: 'Earliest Stockout', value: '2 Days', subtitle: 'Olaplex No. 3 (Jubilee Hills)' },
        { label: 'Estimated Restock Cost', value: '₹1.18 Lakh', subtitle: 'Recommended PO Value' },
        { label: 'Total Active Retail SKUs', value: '84 SKUs', subtitle: '94.2% In-Stock Health' },
      ];

      chart = {
        type: request.preferredChartType || 'BAR',
        title: 'Critical Inventory Levels vs Safety Thresholds',
        subtitle: 'Units on hand vs minimum safety reorder point',
        xAxisLabels: ['Olaplex No. 3 (Jubilee)', 'Moroccanoil (Hitech)', 'Kérastase Scrub (Banjara)', 'Dyson Dryer (Indiranagar)'],
        datasets: [
          { label: 'Current Stock', data: [5, 4, 1, 1], color: '#ef4444' },
          { label: 'Safety Threshold', data: [15, 12, 8, 4], color: '#64748b' },
          { label: 'Suggested Reorder', data: [30, 24, 16, 5], color: '#10b981' },
        ],
        unitSuffix: ' units',
      };

      table = {
        columns: [
          { key: 'product', header: 'Product & SKU' },
          { key: 'branch', header: 'Branch' },
          { key: 'stock', header: 'Current' },
          { key: 'threshold', header: 'Min Level' },
          { key: 'days', header: 'Days to Stockout' },
          { key: 'reorder', header: 'Suggested PO' },
          { key: 'cost', header: 'Est. Cost (₹)', isCurrency: true },
        ],
        rows: [
          { product: 'Olaplex No. 3 Hair Perfector (OLP-003)', branch: 'Jubilee Hills Flagship', stock: 5, threshold: 15, days: '2 Days', reorder: '30 units', cost: 64500 },
          { product: 'Moroccanoil Original 100ml (MRC-100)', branch: 'Hitech City Express', stock: 4, threshold: 12, days: '3 Days', reorder: '24 units', cost: 42000 },
          { product: 'Kérastase Chronologiste Scrub (KRS-200)', branch: 'Banjara Hills Spa', stock: 1, threshold: 8, days: '1 Day', reorder: '16 units', cost: 38400 },
          { product: 'Dyson Supersonic Pro Hair Dryer', branch: 'Indiranagar Sanctuary', stock: 1, threshold: 4, days: '4 Days', reorder: '5 units', cost: 135000 },
        ],
        totalRowCount: 4,
      };

      suggestedFollowUps = [
        'Generate automatic Purchase Order for Olaplex No. 3',
        'Check warehouse stock for cross-branch transfer',
        'Show top-selling retail products this month',
      ];
    }

    // =========================================================================
    // INTENT 6: DORMANT CUSTOMERS / NOT VISITED IN 60 DAYS / CHURN
    // =========================================================================
    else if (
      normalized.includes('60 days') ||
      normalized.includes('dormant') ||
      normalized.includes('haven\'t visited') ||
      normalized.includes('churn') ||
      normalized.includes('inactive customer')
    ) {
      intent = 'CUSTOMER_CHURN_RETENTION';
      generatedSql = isBranchScoped
        ? `SELECT c.id, c.full_name, c.phone, c.tier, MAX(i.created_at) AS last_visit_date, (CURRENT_DATE - MAX(i.created_at)::date) AS days_since_last_visit, SUM(i.grand_total) AS lifetime_spend, COUNT(i.id) AS total_visits FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.organization_id = '${secContext.organizationId}' AND i.branch_id = '${secContext.branchId}' GROUP BY c.id, c.full_name, c.phone, c.tier HAVING (CURRENT_DATE - MAX(i.created_at)::date) >= 60 ORDER BY lifetime_spend DESC LIMIT 50;`
        : `SELECT c.id, c.full_name, c.phone, c.tier, MAX(i.created_at) AS last_visit_date, (CURRENT_DATE - MAX(i.created_at)::date) AS days_since_last_visit, SUM(i.grand_total) AS lifetime_spend, COUNT(i.id) AS total_visits FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.organization_id = '${secContext.organizationId}' GROUP BY c.id, c.full_name, c.phone, c.tier HAVING (CURRENT_DATE - MAX(i.created_at)::date) >= 60 ORDER BY lifetime_spend DESC LIMIT 50;`;

      const dormantCount = isBranchScoped ? 46 : 142;
      const atRiskRevenue = isBranchScoped ? 284000 : 892000;

      executiveSummary = `Found ${dormantCount} high-value clients who have not visited in over 60 days, representing ₹${(atRiskRevenue / 100000).toFixed(2)} Lakhs in annualized revenue at risk. 38% of these clients are Gold/Platinum VIP tier members eligible for automated WhatsApp retention voucher offers.`;

      kpis = [
        { label: 'Dormant Clients (>60 Days)', value: `${dormantCount} Guests`, change: 'Risk of churn', changeType: 'negative' },
        { label: 'At-Risk Annual Revenue', value: `₹${(atRiskRevenue / 100000).toFixed(2)}L`, subtitle: 'Past 12M Avg Spend' },
        { label: 'VIP Tier Dormant Cohort', value: '38% VIP Members', subtitle: '54 Platinum/Gold' },
        { label: 'Predicted Win-back Rate', value: '42.8%', change: '+15% with WhatsApp VIP perk', changeType: 'positive' },
      ];

      chart = {
        type: request.preferredChartType || 'DONUT',
        title: 'Dormant Client Distribution by Membership Tier',
        subtitle: 'Cohort segmentation of clients inactive for 60+ days',
        xAxisLabels: ['Platinum VIP', 'Gold Elite', 'Silver Classic', 'Standard / Walk-in'],
        datasets: [
          { label: 'Dormant Guests', data: isBranchScoped ? [12, 16, 11, 7] : [38, 48, 34, 22], color: '#f59e0b' },
        ],
      };

      table = {
        columns: [
          { key: 'name', header: 'Client Name' },
          { key: 'tier', header: 'Tier' },
          { key: 'lastVisit', header: 'Last Visit' },
          { key: 'daysAgo', header: 'Days Inactive' },
          { key: 'favService', header: 'Favorite Service' },
          { key: 'ltv', header: 'Lifetime Spend (₹)', isCurrency: true },
          { key: 'action', header: 'Recommended Action' },
        ],
        rows: [
          { name: 'Dr. Sunita Rao', tier: 'Platinum VIP', lastVisit: '74 days ago', daysAgo: '74 days', favService: 'Artisan Balayage', ltv: 68400, action: 'Send 20% Color Refresh WhatsApp' },
          { name: 'Vikramaditya Varma', tier: 'Platinum VIP', lastVisit: '68 days ago', daysAgo: '68 days', favService: 'Executive Grooming', ltv: 54200, action: 'Trigger VIP Concierge Call' },
          { name: 'Meera Nambiar', tier: 'Gold Elite', lastVisit: '82 days ago', daysAgo: '82 days', favService: 'Hydra-Facial Glow', ltv: 42800, action: 'Send Complimentary Spa Pass' },
          { name: 'Rohit Khandelwal', tier: 'Gold Elite', lastVisit: '63 days ago', daysAgo: '63 days', favService: 'Keratin Smoothing', ltv: 38900, action: 'Send 500 Loyalty Bonus Points' },
          { name: 'Ananya Deshmukh', tier: 'Silver Classic', lastVisit: '91 days ago', daysAgo: '91 days', favService: 'Gel Mani-Pedi', ltv: 26500, action: 'Automated SMS Reactivation' },
        ],
        totalRowCount: 5,
      };

      suggestedFollowUps = [
        'Launch WhatsApp win-back broadcast to this cohort',
        'Show dormant clients at Jubilee Hills specifically',
        'Which services have the highest churn rate?',
      ];
    }

    // =========================================================================
    // INTENT 7: FORECAST / PREDICTIVE QUESTIONS
    // =========================================================================
    else if (
      normalized.includes('forecast') ||
      normalized.includes('predict') ||
      normalized.includes('next month') ||
      normalized.includes('future')
    ) {
      intent = 'FORECASTING';
      generatedSql = `SELECT DATE_TRUNC('month', i.created_at) AS month, SUM(i.grand_total) AS revenue, COUNT(i.id) AS bookings FROM invoices i WHERE i.organization_id = '${secContext.organizationId}' GROUP BY month ORDER BY month ASC;`;

      executiveSummary =
        'Predictive machine learning models project total revenue next month to reach ₹31.8 Lakhs (+18.8% growth), driven by seasonal festival bridal bookings and higher retail attach rates.';

      kpis = [
        { label: 'Projected Next Month Revenue', value: '₹31.8 Lakh', change: '+18.8% Forecasted', changeType: 'positive' },
        { label: 'Projected Bookings', value: '1,520 Visits', change: '+14% Chair Load', changeType: 'positive' },
        { label: 'Confidence Interval', value: '92.4%', subtitle: 'p < 0.05 statistical model' },
        { label: 'Estimated Gross Margin', value: '68.4%', subtitle: '₹21.75L Gross Profit' },
      ];

      chart = {
        type: request.preferredChartType || 'LINE',
        title: 'Revenue Projection with Confidence Interval (Next 90 Days)',
        subtitle: 'Optimistic, baseline, and conservative forecast curves (₹ Lakhs)',
        xAxisLabels: ['May (Act)', 'Jun (Act)', 'Jul (Act)', 'Aug (Act)', 'Sep (M-T-D)', 'Oct (Proj)', 'Nov (Proj)', 'Dec (Proj)'],
        datasets: [
          { label: 'Historical Actuals', data: [22.4, 23.8, 24.5, 25.9, 26.8, 0, 0, 0], color: '#64748b' },
          { label: 'Baseline Forecast', data: [0, 0, 0, 0, 26.8, 31.8, 36.2, 44.5], color: '#f59e0b' },
          { label: 'Optimistic Upper Bound', data: [0, 0, 0, 0, 26.8, 34.5, 39.8, 48.2], color: '#10b981' },
          { label: 'Conservative Lower Bound', data: [0, 0, 0, 0, 26.8, 29.2, 33.1, 40.8], color: '#ef4444' },
        ],
        unitPrefix: '₹',
        unitSuffix: 'L',
      };

      table = {
        columns: [
          { key: 'period', header: 'Forecast Window' },
          { key: 'conservative', header: 'Conservative (₹)', isCurrency: true },
          { key: 'baseline', header: 'Baseline Projection (₹)', isCurrency: true },
          { key: 'optimistic', header: 'Optimistic (₹)', isCurrency: true },
          { key: 'projectedVisits', header: 'Est. Visits' },
        ],
        rows: [
          { period: 'October 2026', conservative: 2920000, baseline: 3180000, optimistic: 3450000, projectedVisits: 1520 },
          { period: 'November 2026 (Diwali Peak)', conservative: 3310000, baseline: 3620000, optimistic: 3980000, projectedVisits: 1780 },
          { period: 'December 2026 (Bridal Peak)', conservative: 4080000, baseline: 4450000, optimistic: 4820000, projectedVisits: 2150 },
        ],
        totalRowCount: 3,
      };

      suggestedFollowUps = [
        'Show booking demand spike forecast by day of week',
        'Which branches will require additional stylist rostering?',
        'Forecast inventory requirements for Diwali peak',
      ];
    }

    // =========================================================================
    // FALLBACK / GENERAL QUERY
    // =========================================================================
    else {
      intent = 'CUSTOM_ANALYTICS';
      generatedSql = isBranchScoped
        ? `SELECT DATE_TRUNC('day', i.created_at) AS date, COUNT(i.id) AS bills_count, SUM(i.grand_total) AS total_revenue FROM invoices i WHERE i.organization_id = '${secContext.organizationId}' AND i.branch_id = '${secContext.branchId}' AND i.created_at >= NOW() - INTERVAL '30 days' GROUP BY date ORDER BY date DESC;`
        : `SELECT DATE_TRUNC('day', i.created_at) AS date, COUNT(i.id) AS bills_count, SUM(i.grand_total) AS total_revenue FROM invoices i WHERE i.organization_id = '${secContext.organizationId}' AND i.created_at >= NOW() - INTERVAL '30 days' GROUP BY date ORDER BY date DESC;`;

      executiveSummary = `Analyzed 30-day operational metrics for ${secContext.role === 'SUPER_ADMIN' ? 'all salon branches' : `your branch (${secContext.branchId})`}. Total revenue over this window is ₹26.77 Lakh with 1,280 appointments and a 94.2% customer satisfaction score.`;

      kpis = [
        { label: '30-Day Revenue', value: '₹26.77 Lakh', change: '+14.2% growth', changeType: 'positive' },
        { label: 'Total Appointments', value: '1,280', subtitle: '84% Chair Occupancy' },
        { label: 'Average Bill Value', value: '₹2,091', subtitle: 'Per client visit' },
        { label: 'Guest NPS Rating', value: '4.91 ★', subtitle: 'Based on 420 reviews' },
      ];

      chart = {
        type: request.preferredChartType || 'LINE',
        title: '30-Day Daily Revenue Trajectory',
        subtitle: 'Revenue generated per day (INR Thousands)',
        xAxisLabels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
        datasets: [
          { label: 'Daily Revenue (₹k)', data: [82, 94, 78, 112, 105, 128, 142], color: '#f59e0b' },
        ],
        unitPrefix: '₹',
        unitSuffix: 'k',
      };

      table = {
        columns: [
          { key: 'metric', header: 'Key Operational Dimension' },
          { key: 'current', header: 'Current Value' },
          { key: 'target', header: 'Monthly Target' },
          { key: 'status', header: 'Health Indicator' },
        ],
        rows: [
          { metric: 'Gross Service Revenue', current: '₹21.84 Lakh', target: '₹24.00 Lakh', status: 'On Track (91%)' },
          { metric: 'Retail Product Sales', current: '₹4.93 Lakh', target: '₹5.00 Lakh', status: 'Ahead of Pace (98%)' },
          { metric: 'Client Rebooking Rate', current: '76.4%', target: '70.0%', status: 'Exceeding Target' },
          { metric: 'Retail Attach Rate', current: '23.8%', target: '20.0%', status: 'Exceeding Target' },
        ],
        totalRowCount: 4,
      };

      suggestedFollowUps = [
        'Which branch performed best this month?',
        'Which stylist generated the highest revenue?',
        'Which products are running low on stock?',
      ];
    }

    // -------------------------------------------------------------------------
    // 3. VALIDATE SQL SECURITY
    // -------------------------------------------------------------------------
    const validation = this.validateSqlSecurity(generatedSql);
    if (!validation.isSafe) {
      const auditEntry: AIAuditLogEntry = {
        id: `audit-${Date.now()}`,
        userId: secContext.userId,
        userName: secContext.userEmail.split('@')[0],
        userRole: secContext.role,
        branchId: secContext.branchId,
        question,
        intent,
        generatedSql,
        executionTimeMs: Date.now() - startTime,
        rowCount: 0,
        status: 'REJECTED_SECURITY',
        errorMessage: validation.violationReason,
        securityContext: {
          organizationId: secContext.organizationId,
          branchId: secContext.branchId,
          role: secContext.role,
          permissions: secContext.permissions,
        },
        createdAt: new Date().toISOString(),
      };
      this.auditLogs.unshift(auditEntry);
      throw new ForbiddenException(validation.violationReason);
    }

    const executionTimeMs = Date.now() - startTime;

    // -------------------------------------------------------------------------
    // 4. RECORD AUDIT LOG ENTRY
    // -------------------------------------------------------------------------
    const auditEntry: AIAuditLogEntry = {
      id: `audit-${Date.now()}`,
      userId: secContext.userId,
      userName: secContext.userEmail.split('@')[0],
      userRole: secContext.role,
      branchId: secContext.branchId,
      branchName: isBranchScoped ? `Branch ${secContext.branchId}` : 'Enterprise All Branches',
      question,
      intent,
      generatedSql,
      executionTimeMs,
      rowCount: table ? table.totalRowCount : 1,
      status: 'SUCCESS',
      securityContext: {
        organizationId: secContext.organizationId,
        branchId: secContext.branchId,
        role: secContext.role,
        permissions: secContext.permissions,
      },
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(auditEntry);

    // Keep memory audit log under 100 entries
    if (this.auditLogs.length > 100) {
      this.auditLogs.pop();
    }

    // Obfuscate raw schema details for non-admin display
    const sanitizedSqlForDisplay =
      secContext.role === 'SUPER_ADMIN' || secContext.role === 'AUDITOR'
        ? generatedSql
        : generatedSql.replace(new RegExp(`organization_id = '[^']+'`, 'g'), 'organization_id = :org_id');

    return {
      queryId: auditEntry.id,
      question,
      intent,
      executiveSummary,
      kpis,
      chart,
      table,
      generatedSql,
      sanitizedSqlForDisplay,
      executionTimeMs,
      securityScopeApplied: {
        organizationId: secContext.organizationId,
        branchScope: branchScopeDesc,
        role: secContext.role,
        isRestricted: isBranchScoped,
      },
      suggestedFollowUps,
      timestamp: new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // 3. PREDICTIVE FORECASTING MODELS
  // ---------------------------------------------------------------------------
  public getForecastSuite(): AIForecastSuite {
    return {
      revenueForecast: {
        summary:
          'Next 30-day revenue is projected to reach ₹31.8 Lakhs (+18.8% growth over current month), driven by weekend wedding packages and salon aesthetic treatment growth.',
        projectedNext30Days: 3180000,
        projectedGrowthPercentage: 18.8,
        timeSeries: [
          { date: 'Oct 01', baseline: 98000, optimistic: 104000, conservative: 92000, isHistorical: false },
          { date: 'Oct 05', baseline: 102000, optimistic: 110000, conservative: 95000, isHistorical: false },
          { date: 'Oct 10', baseline: 115000, optimistic: 124000, conservative: 106000, isHistorical: false },
          { date: 'Oct 15', baseline: 118000, optimistic: 128000, conservative: 108000, isHistorical: false },
          { date: 'Oct 20', baseline: 135000, optimistic: 148000, conservative: 122000, isHistorical: false },
          { date: 'Oct 25', baseline: 142000, optimistic: 156000, conservative: 130000, isHistorical: false },
          { date: 'Oct 31', baseline: 160000, optimistic: 178000, conservative: 144000, isHistorical: false },
        ],
      },
      bookingForecast: {
        summary:
          'Chair occupancy is projected at 88.4% across the chain for the upcoming month, with peak utilization (94%) at Jubilee Hills on Friday through Sunday afternoons.',
        projectedTotalBookings: 1520,
        averageOccupancyRate: 88.4,
        branchBreakdown: [
          { branchName: 'Jubilee Hills Flagship', predictedAppointments: 520, predictedOccupancyRate: 93.6, peakTimeSlot: 'Fri–Sun 03:00 PM - 07:00 PM', recommendedStaffCount: 14 },
          { branchName: 'Indiranagar Sanctuary', predictedAppointments: 410, predictedOccupancyRate: 89.2, peakTimeSlot: 'Sat–Sun 11:00 AM - 05:00 PM', recommendedStaffCount: 11 },
          { branchName: 'Banjara Hills Spa', predictedAppointments: 340, predictedOccupancyRate: 84.5, peakTimeSlot: 'Wed & Sat 02:00 PM - 06:00 PM', recommendedStaffCount: 9 },
          { branchName: 'Hitech City Express', predictedAppointments: 250, predictedOccupancyRate: 78.0, peakTimeSlot: 'Mon–Fri 06:00 PM - 09:00 PM', recommendedStaffCount: 7 },
        ],
      },
      inventoryForecast: {
        summary:
          '4 critical retail SKUs require immediate PO generation within 48 hours to prevent stockouts on client favorite hair and skin rituals.',
        criticalStockoutCount: 4,
        totalCapitalAtRisk: 280000,
        items: [
          { productId: 'p1', productName: 'Olaplex No. 3 Hair Perfector (100ml)', sku: 'OLP-003', currentStock: 5, dailyBurnRate: 2.5, daysUntilStockout: 2, urgency: 'CRITICAL', suggestedReorderQuantity: 30, estimatedCost: 64500 },
          { productId: 'p2', productName: 'Moroccanoil Original Treatment (100ml)', sku: 'MRC-100', currentStock: 4, dailyBurnRate: 1.3, daysUntilStockout: 3, urgency: 'CRITICAL', suggestedReorderQuantity: 24, estimatedCost: 42000 },
          { productId: 'p3', productName: 'Kérastase Chronologiste Regenerating Scrub', sku: 'KRS-200', currentStock: 1, dailyBurnRate: 1.0, daysUntilStockout: 1, urgency: 'CRITICAL', suggestedReorderQuantity: 16, estimatedCost: 38400 },
          { productId: 'p4', productName: 'Dyson Supersonic Professional Hair Dryer', sku: 'DYS-PRO', currentStock: 1, dailyBurnRate: 0.25, daysUntilStockout: 4, urgency: 'WARNING', suggestedReorderQuantity: 5, estimatedCost: 135000 },
        ],
      },
      churnForecast: {
        summary:
          '142 clients have entered the >60 days dormant window. Predictive models calculate that initiating a targeted WhatsApp VIP refresh campaign will recover 42.8% of these clients.',
        totalAtRiskCustomers: 142,
        potentialRevenueLoss: 892000,
        cohorts: [
          { segment: 'Platinum VIP (High Value)', totalCustomers: 38, dormantOver60Days: 14, churnRiskPercentage: 68.4, atRiskRevenueValue: 420000, suggestedWinbackCampaign: 'Complimentary Kérastase Caviar Hair Ritual WhatsApp' },
          { segment: 'Gold Elite', totalCustomers: 94, dormantOver60Days: 32, churnRiskPercentage: 54.2, atRiskRevenueValue: 284000, suggestedWinbackCampaign: '₹500 Loyalty Bonus Points valid for 14 days' },
          { segment: 'Silver Classic', totalCustomers: 180, dormantOver60Days: 52, churnRiskPercentage: 42.0, atRiskRevenueValue: 124000, suggestedWinbackCampaign: '20% Off weekday color & facial refresh' },
          { segment: 'Occasional / Walk-in', totalCustomers: 310, dormantOver60Days: 44, churnRiskPercentage: 35.0, atRiskRevenueValue: 64000, suggestedWinbackCampaign: 'Automated SMS re-engagement voucher' },
        ],
      },
      demandForecast: {
        summary:
          'Friday afternoon through Sunday evening exhibits a 1.85x service surge for Hair Color and Hydra-Facials. Increasing weekend station staffing by +2 per branch is recommended.',
        peakSurgeDays: ['Friday (Evening)', 'Saturday (Full Day)', 'Sunday (Full Day)'],
        spikes: [
          { serviceCategory: 'Artisan Balayage & Highlights', dayOfWeek: 'Saturday & Sunday', timeWindow: '11:00 AM - 04:00 PM', spikeFactor: 2.1, recommendedAction: 'Reserve Chair 1-4 for color processing only' },
          { serviceCategory: 'Hydra-Facial Oxygen Glow', dayOfWeek: 'Friday & Saturday', timeWindow: '03:00 PM - 07:00 PM', spikeFactor: 1.8, recommendedAction: 'Pre-warm dermal aesthetic suites 30m prior' },
          { serviceCategory: 'Executive Haircut & Beard Trim', dayOfWeek: 'Mon & Wed Evening', timeWindow: '06:00 PM - 09:00 PM', spikeFactor: 1.6, recommendedAction: 'Assign 2 dedicated express barbers' },
        ],
      },
    };
  }

  // ---------------------------------------------------------------------------
  // 4. AUTOMATED STRATEGIC INSIGHTS
  // ---------------------------------------------------------------------------
  public getStrategicInsights(): AIInsight[] {
    return [
      {
        id: 'ins-001',
        title: 'High Rebooking Rate on Balayage — Retail Bundle Opportunity',
        description:
          'Clients receiving Artisan Balayage have an 88% 60-day return rate, but only 22% currently purchase Olaplex No. 3 take-home care. Bundling a post-color homecare ritual at checkout can increase average ticket by +₹2,150.',
        category: 'GROWTH',
        severity: 'HIGH',
        metricImpact: '+₹1.85 Lakhs Monthly Revenue',
        estimatedFinancialGain: 185000,
        recommendedAction: 'Enable POS automatic prompt: "Add Olaplex No. 3 at 15% discount with Balayage"',
        isActionable: true,
        actionEndpoint: '/pos/bundle-config',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        id: 'ins-002',
        title: 'Declining Occupancy in Traditional Hot Oil Scalp Massage',
        description:
          'Booking volume for Traditional Hot Oil Massage dropped 34% over the last 60 days, yielding a negative chair-hour margin compared to contemporary Trichology Scalp Detox.',
        category: 'LOW_PERFORMING_SERVICE',
        severity: 'MEDIUM',
        metricImpact: 'Reclaim 18 Chair Hours Weekly',
        estimatedFinancialGain: 72000,
        recommendedAction: 'Replace with Japanese Head Spa Scalp Scrub and reposition pricing at ₹2,200',
        isActionable: true,
        actionEndpoint: '/services',
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      },
      {
        id: 'ins-003',
        title: 'Imminent Stockout on Kérastase Scrub at Banjara Hills',
        description:
          'Only 1 unit remaining with 3 pre-booked appointments requiring backbar scrub application this weekend. Immediate emergency transfer from Indiranagar (9 in stock) recommended.',
        category: 'INVENTORY_CONCERN',
        severity: 'HIGH',
        metricImpact: 'Avoid 3 Appointment Disruptions',
        estimatedFinancialGain: 18000,
        recommendedAction: 'Trigger automatic Inter-Branch Stock Transfer Request (Indiranagar ➔ Banjara Hills)',
        isActionable: true,
        actionEndpoint: '/inventory',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: 'ins-004',
        title: '14 Platinum VIP Clients Exceeding 60-Day Dormancy',
        description:
          '14 top-tier VIP guests with average lifetime spend exceeding ₹65,000 have not visited in 60+ days. Personalized concierge reach-out yields historically high recovery.',
        category: 'CUSTOMER_RETENTION',
        severity: 'HIGH',
        metricImpact: 'Protect ₹4.20 Lakhs in Annualized Spend',
        estimatedFinancialGain: 420000,
        recommendedAction: 'Send VIP Personalized Concierge WhatsApp with Complimentary Kérastase Treatment Pass',
        isActionable: true,
        actionEndpoint: '/marketing',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'ins-005',
        title: 'Service Turnaround Variance on Hair Color at Hitech City',
        description:
          'Hair Color service duration at Hitech City averaged 148 minutes vs chain benchmark of 115 minutes, causing a 22% reduction in afternoon chair turnover.',
        category: 'STAFF_ANOMALY',
        severity: 'LOW',
        metricImpact: '+3 Appointment Slots Per Stylist Weekly',
        estimatedFinancialGain: 95000,
        recommendedAction: 'Schedule Colorist Efficiency & Sectioning Workshop with Master Stylist Priya Sharma',
        isActionable: true,
        actionEndpoint: '/staff',
        createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // 5. AUDIT LOG RETRIEVAL
  // ---------------------------------------------------------------------------
  public getAuditLogs(userRole: string): AIAuditLogEntry[] {
    // Only allow SUPER_ADMIN, REGIONAL_MANAGER, and AUDITOR to access full audit trail
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'REGIONAL_MANAGER' && userRole !== 'AUDITOR') {
      throw new ForbiddenException('You do not have administrative permissions to view AI query audit logs.');
    }
    return this.auditLogs;
  }
}
