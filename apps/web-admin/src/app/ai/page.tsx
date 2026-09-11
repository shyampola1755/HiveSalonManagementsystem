'use client';

import * as React from 'react';
import {
  Bot,
  Sparkles,
  Send,
  CornerDownLeft,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Database,
  Lock,
  ChevronDown,
  ChevronUp,
  Eye,
  RefreshCw,
  Zap,
  Building2,
  Lightbulb,
  FileText,
  DollarSign,
  PieChart as PieChartIcon,
  HelpCircle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Tabs,
  Modal,
  StatCard,
} from '@hive/ui';
import {
  AIQueryResult,
  AIQueryIntent,
  AIForecastSuite,
  AIInsight,
  AIAuditLogEntry,
  AIChartType,
} from '@hive/types';
import { formatCurrency } from '@hive/utilities';

export default function AiAnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState<string>('copilot');
  const [inputQuery, setInputQuery] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [activeScope, setActiveScope] = React.useState<'SUPER_ADMIN' | 'BRANCH_MANAGER'>('SUPER_ADMIN');
  const [selectedBranch, setSelectedBranch] = React.useState<string>('ALL');
  const [expandedSqlId, setExpandedSqlId] = React.useState<string | null>(null);

  // Suggested Prompts
  const suggestedPills = [
    { label: '💰 How much did we sell today?', query: 'How much did we sell today?' },
    { label: '🏆 Which branch performed best this month?', query: 'Which branch had the highest revenue this month?' },
    { label: '⭐ Which stylist generated the highest revenue?', query: 'Which stylist generated the highest revenue?' },
    { label: '💇 Which services are most popular?', query: 'Which services are most popular?' },
    { label: '📦 Which products are running low?', query: 'Which products are running low on stock?' },
    { label: '👥 Which customers haven\'t visited in 60 days?', query: 'Which customers haven\'t visited in 60 days?' },
    { label: '📈 Forecast next 90 days revenue', query: 'Forecast revenue for next 90 days' },
  ];

  // Chat conversation history state
  const [messages, setMessages] = React.useState<
    Array<{
      id: string;
      sender: 'user' | 'ai';
      text?: string;
      queryResult?: AIQueryResult;
      timestamp: string;
    }>
  >([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Hello! I am **Hive Salon AI**, your intelligent business analytics copilot. Ask me anything about salon revenue, branch performance, stylist productivity, inventory stockouts, client retention, or predictive forecasts in natural language.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Forecast state
  const [forecasts, setForecasts] = React.useState<AIForecastSuite | null>(null);
  const [insights, setInsights] = React.useState<AIInsight[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<AIAuditLogEntry[]>([]);
  const [selectedForecastCategory, setSelectedForecastCategory] = React.useState<'revenue' | 'bookings' | 'inventory' | 'churn' | 'demand'>('revenue');

  // Initial data loading
  React.useEffect(() => {
    // Seed initial forecasts & insights
    fetchInitialData();
  }, []);

  const fetchInitialData = () => {
    // Simulated initial server response matching @hive/api
    setForecasts({
      revenueForecast: {
        summary: 'Next 30-day revenue is projected to reach ₹31.8 Lakhs (+18.8% growth over current month), driven by weekend wedding packages and salon aesthetic treatment growth.',
        projectedNext30Days: 3180000,
        projectedGrowthPercentage: 18.8,
        timeSeries: [
          { date: 'Oct 01', baseline: 98000, optimistic: 104000, conservative: 92000 },
          { date: 'Oct 05', baseline: 102000, optimistic: 110000, conservative: 95000 },
          { date: 'Oct 10', baseline: 115000, optimistic: 124000, conservative: 106000 },
          { date: 'Oct 15', baseline: 118000, optimistic: 128000, conservative: 108000 },
          { date: 'Oct 20', baseline: 135000, optimistic: 148000, conservative: 122000 },
          { date: 'Oct 25', baseline: 142000, optimistic: 156000, conservative: 130000 },
          { date: 'Oct 31', baseline: 160000, optimistic: 178000, conservative: 144000 },
        ],
      },
      bookingForecast: {
        summary: 'Chair occupancy is projected at 88.4% across the chain for the upcoming month, with peak utilization (94%) at Jubilee Hills on Friday through Sunday afternoons.',
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
        summary: '4 critical retail SKUs require immediate PO generation within 48 hours to prevent stockouts on client favorite hair and skin rituals.',
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
        summary: '142 clients have entered the >60 days dormant window. Predictive models calculate that initiating a targeted WhatsApp VIP refresh campaign will recover 42.8% of these clients.',
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
        summary: 'Friday afternoon through Sunday evening exhibits a 1.85x service surge for Hair Color and Hydra-Facials. Increasing weekend station staffing by +2 per branch is recommended.',
        peakSurgeDays: ['Friday (Evening)', 'Saturday (Full Day)', 'Sunday (Full Day)'],
        spikes: [
          { serviceCategory: 'Artisan Balayage & Highlights', dayOfWeek: 'Saturday & Sunday', timeWindow: '11:00 AM - 04:00 PM', spikeFactor: 2.1, recommendedAction: 'Reserve Chair 1-4 for color processing only' },
          { serviceCategory: 'Hydra-Facial Oxygen Glow', dayOfWeek: 'Friday & Saturday', timeWindow: '03:00 PM - 07:00 PM', spikeFactor: 1.8, recommendedAction: 'Pre-warm dermal aesthetic suites 30m prior' },
          { serviceCategory: 'Executive Haircut & Beard Trim', dayOfWeek: 'Mon & Wed Evening', timeWindow: '06:00 PM - 09:00 PM', spikeFactor: 1.6, recommendedAction: 'Assign 2 dedicated express barbers' },
        ],
      },
    });

    setInsights([
      {
        id: 'ins-001',
        title: 'High Rebooking Rate on Balayage — Retail Bundle Opportunity',
        description: 'Clients receiving Artisan Balayage have an 88% 60-day return rate, but only 22% currently purchase Olaplex No. 3 take-home care. Bundling a post-color homecare ritual at checkout can increase average ticket by +₹2,150.',
        category: 'GROWTH',
        severity: 'HIGH',
        metricImpact: '+₹1.85 Lakhs Monthly Revenue',
        estimatedFinancialGain: 185000,
        recommendedAction: 'Enable POS automatic prompt: "Add Olaplex No. 3 at 15% discount with Balayage"',
        isActionable: true,
        actionEndpoint: '/pos',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        id: 'ins-002',
        title: 'Declining Occupancy in Traditional Hot Oil Scalp Massage',
        description: 'Booking volume for Traditional Hot Oil Massage dropped 34% over the last 60 days, yielding a negative chair-hour margin compared to contemporary Trichology Scalp Detox.',
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
        description: 'Only 1 unit remaining with 3 pre-booked appointments requiring backbar scrub application this weekend. Immediate emergency transfer from Indiranagar (9 in stock) recommended.',
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
        description: '14 top-tier VIP guests with average lifetime spend exceeding ₹65,000 have not visited in 60+ days. Personalized concierge reach-out yields historically high recovery.',
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
        description: 'Hair Color service duration at Hitech City averaged 148 minutes vs chain benchmark of 115 minutes, causing a 22% reduction in afternoon chair turnover.',
        category: 'STAFF_ANOMALY',
        severity: 'LOW',
        metricImpact: '+3 Appointment Slots Per Stylist Weekly',
        estimatedFinancialGain: 95000,
        recommendedAction: 'Schedule Colorist Efficiency & Sectioning Workshop with Master Stylist Priya Sharma',
        isActionable: true,
        actionEndpoint: '/staff',
        createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
      },
    ]);

    setAuditLogs([
      {
        id: 'audit-ai-101',
        userId: 'usr-admin-1',
        userName: 'deepak.admin',
        userRole: 'SUPER_ADMIN',
        branchName: 'All Branches (Enterprise)',
        question: 'Which branch had the highest revenue this month?',
        intent: 'BRANCH_PERFORMANCE',
        generatedSql: 'SELECT b.name AS branch_name, SUM(i.grand_total) AS total_revenue FROM branches b JOIN invoices i ON b.id = i.branch_id WHERE i.organization_id = :orgId AND i.created_at >= DATE_TRUNC(\'month\', NOW()) GROUP BY b.name ORDER BY total_revenue DESC;',
        executionTimeMs: 42,
        rowCount: 4,
        status: 'SUCCESS',
        securityContext: { organizationId: 'org-hive-001', role: 'SUPER_ADMIN', permissions: ['ai:read', 'analytics:revenue'] },
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      },
      {
        id: 'audit-ai-102',
        userId: 'usr-mgr-jubilee',
        userName: 'kavita.jubilee',
        userRole: 'BRANCH_MANAGER',
        branchId: 'b1',
        branchName: 'Jubilee Hills Flagship',
        question: 'Which stylist generated the highest revenue?',
        intent: 'STAFF_PRODUCTIVITY',
        generatedSql: 'SELECT s.full_name, SUM(i.grand_total) AS total_revenue, COUNT(i.id) AS bills_count FROM staff_profiles s JOIN invoices i ON s.id = i.primary_stylist_id WHERE i.organization_id = :orgId AND i.branch_id = \'b1\' AND i.created_at >= DATE_TRUNC(\'month\', NOW()) GROUP BY s.full_name ORDER BY total_revenue DESC;',
        executionTimeMs: 38,
        rowCount: 4,
        status: 'SUCCESS',
        securityContext: { organizationId: 'org-hive-001', branchId: 'b1', role: 'BRANCH_MANAGER', permissions: ['ai:read', 'analytics:staff'] },
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ]);
  };

  // Submit Query to AI Copilot
  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    setInputQuery('');
    const userMsgId = `usr-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: q, timestamp }]);
    setIsLoading(true);

    try {
      // Simulate API latency & response processing
      await new Promise((resolve) => setTimeout(resolve, 650));

      const isScoped = activeScope === 'BRANCH_MANAGER';
      const branchId = isScoped ? (selectedBranch === 'ALL' ? 'b1' : selectedBranch) : undefined;

      // Mock query resolution
      const norm = q.toLowerCase();
      let queryResult: AIQueryResult;

      if (norm.includes('sell today') || norm.includes('sold today') || norm.includes('today')) {
        queryResult = {
          queryId: `qr-${Date.now()}`,
          question: q,
          intent: 'REVENUE_ANALYSIS',
          executiveSummary: isScoped
            ? `Today’s revenue for your branch stands at ₹94.3k across 38 completed guest visits (94% of target). Services contributed ₹71.6k (76%) and Retail contributed ₹22.6k (24%).`
            : `Across all salon branches, total revenue today is ₹2.85 Lakhs across 114 completed client visits (95% of ₹3.0L daily target). In-salon services contributed ₹2.18L and retail sales contributed ₹66.6k.`,
          kpis: [
            { label: 'Today Total Sales', value: isScoped ? '₹94,250' : '₹2,84,600', change: '+18.4% vs yesterday', changeType: 'positive' },
            { label: 'Completed Visits', value: isScoped ? '38 bills' : '114 bills', subtitle: 'Avg ₹2,496/bill' },
            { label: 'Daily Target Pacing', value: '95%', change: 'Target: ₹3.0L', changeType: 'positive' },
            { label: 'Retail Attach Rate', value: '23.4%', change: '+4.2% uplift', changeType: 'positive' },
          ],
          chart: {
            type: 'AREA',
            title: 'Today Hourly Revenue Pacing (INR)',
            subtitle: 'Intraday sales from 09:00 AM to 08:00 PM',
            xAxisLabels: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '8 PM'],
            datasets: [
              { label: 'Today Revenue (₹)', data: isScoped ? [8200, 16400, 24500, 18900, 21400, 32100, 18200] : [24000, 48000, 72000, 56000, 68000, 96000, 52000], color: '#f59e0b' },
              { label: 'Yesterday Baseline', data: isScoped ? [6500, 14200, 20100, 16500, 19000, 27000, 15000] : [19500, 41000, 61000, 49000, 58000, 82000, 44000], color: '#64748b' },
            ],
            unitPrefix: '₹',
          },
          table: {
            columns: [
              { key: 'timeSlot', header: 'Hour Slot' },
              { key: 'bills', header: 'Visits' },
              { key: 'services', header: 'Services (₹)', isCurrency: true },
              { key: 'retail', header: 'Retail (₹)', isCurrency: true },
              { key: 'total', header: 'Total Revenue (₹)', isCurrency: true },
            ],
            rows: [
              { timeSlot: '09:00 AM - 11:00 AM', bills: isScoped ? 5 : 16, services: isScoped ? 6400 : 19200, retail: isScoped ? 1800 : 4800, total: isScoped ? 8200 : 24000 },
              { timeSlot: '11:00 AM - 01:00 PM', bills: isScoped ? 8 : 24, services: isScoped ? 12800 : 38400, retail: isScoped ? 3600 : 9600, total: isScoped ? 16400 : 48000 },
              { timeSlot: '01:00 PM - 03:00 PM', bills: isScoped ? 11 : 32, services: isScoped ? 19100 : 57300, retail: isScoped ? 5400 : 14700, total: isScoped ? 24500 : 72000 },
              { timeSlot: '03:00 PM - 05:00 PM', bills: isScoped ? 7 : 21, services: isScoped ? 14700 : 44100, retail: isScoped ? 4200 : 11900, total: isScoped ? 18900 : 56000 },
              { timeSlot: '05:00 PM - 07:00 PM', bills: isScoped ? 12 : 36, services: isScoped ? 25000 : 75000, retail: isScoped ? 7100 : 21000, total: isScoped ? 32100 : 96000 },
            ],
            totalRowCount: 5,
          },
          generatedSql: isScoped
            ? `SELECT DATE_TRUNC('hour', i.created_at) AS time_slot, SUM(i.grand_total) AS revenue, COUNT(i.id) AS bills, SUM(i.service_total) AS service_rev, SUM(i.product_total) AS retail_rev FROM invoices i WHERE i.organization_id = 'org-hive-001' AND i.branch_id = '${branchId}' AND i.created_at >= CURRENT_DATE GROUP BY time_slot ORDER BY time_slot ASC;`
            : `SELECT DATE_TRUNC('hour', i.created_at) AS time_slot, SUM(i.grand_total) AS revenue, COUNT(i.id) AS bills, SUM(i.service_total) AS service_rev, SUM(i.product_total) AS retail_rev FROM invoices i WHERE i.organization_id = 'org-hive-001' AND i.created_at >= CURRENT_DATE GROUP BY time_slot ORDER BY time_slot ASC;`,
          sanitizedSqlForDisplay: isScoped
            ? `SELECT DATE_TRUNC('hour', i.created_at) AS time_slot, SUM(i.grand_total) AS revenue, COUNT(i.id) AS bills, SUM(i.service_total) AS service_rev, SUM(i.product_total) AS retail_rev FROM invoices i WHERE i.organization_id = :org_id AND i.branch_id = '${branchId}' AND i.created_at >= CURRENT_DATE GROUP BY time_slot ORDER BY time_slot ASC;`
            : `SELECT DATE_TRUNC('hour', i.created_at) AS time_slot, SUM(i.grand_total) AS revenue, COUNT(i.id) AS bills, SUM(i.service_total) AS service_rev, SUM(i.product_total) AS retail_rev FROM invoices i WHERE i.organization_id = :org_id AND i.created_at >= CURRENT_DATE GROUP BY time_slot ORDER BY time_slot ASC;`,
          executionTimeMs: 29,
          securityScopeApplied: {
            organizationId: 'org-hive-001',
            branchScope: isScoped ? `Branch Scoped (${branchId})` : 'Enterprise Scope (All Branches)',
            role: activeScope,
            isRestricted: isScoped,
          },
          suggestedFollowUps: ['Which stylist generated highest revenue today?', 'Which services were most popular today?'],
          timestamp: new Date().toISOString(),
        };
      } else if (norm.includes('branch')) {
        queryResult = {
          queryId: `qr-${Date.now()}`,
          question: q,
          intent: 'BRANCH_PERFORMANCE',
          executiveSummary:
            'Jubilee Hills generated the highest revenue this month at ₹8.42 Lakh across 412 visits. Indiranagar Sanctuary followed in 2nd place with ₹7.30 Lakh, driven by luxury aesthetic treatments.',
          kpis: [
            { label: 'Top Performing Branch', value: 'Jubilee Hills', subtitle: '₹8.42 Lakh' },
            { label: 'Total Network Revenue', value: '₹26.77 Lakh', change: '+14.2% MoM', changeType: 'positive' },
            { label: 'Highest Average Ticket', value: '₹2,385', subtitle: 'Indiranagar Sanctuary' },
            { label: 'Network Chair Occupancy', value: '84.6%', change: '+6% utilization', changeType: 'positive' },
          ],
          chart: {
            type: 'BAR',
            title: 'Monthly Branch Revenue Comparison (M-T-D)',
            subtitle: 'Revenue in Lakhs (INR)',
            xAxisLabels: ['Jubilee Hills', 'Indiranagar', 'Banjara Hills', 'Hitech City'],
            datasets: [
              { label: 'Revenue (₹ Lakhs)', data: [8.42, 7.3, 6.15, 4.9], color: '#f59e0b' },
              { label: 'Operating Costs (₹ Lakhs)', data: [4.8, 4.1, 3.6, 2.9], color: '#3b82f6' },
            ],
            unitPrefix: '₹',
            unitSuffix: 'L',
          },
          table: {
            columns: [
              { key: 'branch', header: 'Branch Name' },
              { key: 'visits', header: 'Visits' },
              { key: 'ticket', header: 'Avg Ticket', isCurrency: true },
              { key: 'occupancy', header: 'Occupancy' },
              { key: 'revenue', header: 'Revenue (₹)', isCurrency: true },
              { key: 'growth', header: 'MoM Growth' },
            ],
            rows: [
              { branch: 'Jubilee Hills Flagship', visits: 412, ticket: 2043, occupancy: '89.4%', revenue: 842000, growth: '+16.2%' },
              { branch: 'Indiranagar Sanctuary', visits: 306, ticket: 2385, occupancy: '84.1%', revenue: 730000, growth: '+18.5%' },
              { branch: 'Banjara Hills Spa', visits: 318, ticket: 1933, occupancy: '78.6%', revenue: 615000, growth: '+9.4%' },
              { branch: 'Hitech City Express', visits: 244, ticket: 2008, occupancy: '72.0%', revenue: 490000, growth: '+11.1%' },
            ],
            totalRowCount: 4,
          },
          generatedSql: `SELECT b.id, b.name AS branch_name, SUM(i.grand_total) AS total_revenue, COUNT(i.id) AS total_visits, AVG(i.grand_total) AS avg_ticket_size FROM branches b LEFT JOIN invoices i ON b.id = i.branch_id WHERE b.organization_id = 'org-hive-001' AND i.created_at >= DATE_TRUNC('month', NOW()) GROUP BY b.id, b.name ORDER BY total_revenue DESC;`,
          sanitizedSqlForDisplay: `SELECT b.name AS branch_name, SUM(i.grand_total) AS total_revenue, COUNT(i.id) AS total_visits FROM branches b JOIN invoices i ON b.id = i.branch_id WHERE b.organization_id = :org_id AND i.created_at >= DATE_TRUNC('month', NOW()) GROUP BY b.name ORDER BY total_revenue DESC;`,
          executionTimeMs: 34,
          securityScopeApplied: {
            organizationId: 'org-hive-001',
            branchScope: 'Enterprise Scope',
            role: activeScope,
            isRestricted: false,
          },
          suggestedFollowUps: ['Show expense breakdown by branch', 'Which stylist generated highest revenue at Jubilee Hills?'],
          timestamp: new Date().toISOString(),
        };
      } else if (norm.includes('stylist') || norm.includes('staff')) {
        queryResult = {
          queryId: `qr-${Date.now()}`,
          question: q,
          intent: 'STAFF_PRODUCTIVITY',
          executiveSummary:
            'Master Stylist Priya Sharma generated the highest revenue this month at ₹3.24 Lakh across 94 clients with a 4.95★ rating and 91% rebooking rate. Rajesh Kumar ranked 2nd with ₹2.80 Lakh.',
          kpis: [
            { label: 'Top Generating Stylist', value: 'Priya Sharma', subtitle: '₹3.24 Lakh (94 Clients)' },
            { label: 'Average Stylist Revenue', value: '₹2.12 Lakh', change: '+12.8% vs last month', changeType: 'positive' },
            { label: 'Top Guest Satisfaction', value: '4.95 ★', subtitle: 'Priya Sharma (68 reviews)' },
            { label: 'Commissions Accrued', value: '₹2.48 Lakh', subtitle: '18% Avg Payout' },
          ],
          chart: {
            type: 'BAR',
            title: 'Stylist Monthly Revenue Leaderboard',
            subtitle: 'Revenue generated per stylist (INR Thousands)',
            xAxisLabels: ['Priya Sharma', 'Rajesh Kumar', 'Ananya Roy', 'Vikram Malhotra', 'Siddharth Sen'],
            datasets: [
              { label: 'Service Revenue (₹k)', data: [275, 238, 205, 168, 142], color: '#f59e0b' },
              { label: 'Retail Up-sells (₹k)', data: [49, 42, 40, 27, 22], color: '#10b981' },
            ],
            unitPrefix: '₹',
            unitSuffix: 'k',
          },
          table: {
            columns: [
              { key: 'name', header: 'Stylist Name' },
              { key: 'role', header: 'Designation' },
              { key: 'branch', header: 'Branch' },
              { key: 'clients', header: 'Clients' },
              { key: 'rating', header: 'Rating' },
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
          },
          generatedSql: `SELECT s.id, s.full_name AS stylist_name, SUM(ii.total_price) AS service_revenue, COUNT(DISTINCT i.id) AS clients_served FROM staff_profiles s JOIN invoice_items ii ON s.id = ii.staff_id JOIN invoices i ON ii.invoice_id = i.id WHERE s.organization_id = 'org-hive-001' AND i.created_at >= DATE_TRUNC('month', NOW()) GROUP BY s.id, s.full_name ORDER BY service_revenue DESC;`,
          sanitizedSqlForDisplay: `SELECT s.full_name, SUM(ii.total_price) AS service_revenue, COUNT(DISTINCT i.id) AS clients_served FROM staff_profiles s JOIN invoice_items ii ON s.id = ii.staff_id WHERE s.organization_id = :org_id GROUP BY s.full_name ORDER BY service_revenue DESC;`,
          executionTimeMs: 41,
          securityScopeApplied: {
            organizationId: 'org-hive-001',
            branchScope: 'Enterprise Scope',
            role: activeScope,
            isRestricted: false,
          },
          suggestedFollowUps: ['Which services did Priya Sharma perform most?', 'Show commission breakdown for Rajesh Kumar'],
          timestamp: new Date().toISOString(),
        };
      } else if (norm.includes('service')) {
        queryResult = {
          queryId: `qr-${Date.now()}`,
          question: q,
          intent: 'SERVICE_POPULARITY',
          executiveSummary:
            'Artisan Balayage & Olaplex Glaze generated the highest revenue at ₹5.84 Lakh across 146 bookings, followed by Keratin Smoothing Complex (₹4.25 Lakh) and Hydra-Facial Oxygen Glow (₹3.92 Lakh).',
          kpis: [
            { label: 'Top Revenue Service', value: 'Artisan Balayage', subtitle: '₹5.84 Lakh' },
            { label: 'Most Booked Treatment', value: 'Executive Fade', subtitle: '215 Bookings' },
            { label: 'Highest Margin Service', value: 'Hydra-Facial Luxe', subtitle: '82% Gross Margin' },
            { label: 'Avg Service Ticket', value: '₹2,450', change: '+8.4% vs Q1', changeType: 'positive' },
          ],
          chart: {
            type: 'DONUT',
            title: 'Service Revenue Contribution by Category',
            subtitle: 'Share of salon service revenue (M-T-D)',
            xAxisLabels: ['Hair Color & Highlights', 'Hair Treatments & Botox', 'Skin Aesthetics & Facials', 'Cuts & Styling', 'Spa & Rituals'],
            datasets: [{ label: 'Revenue (₹ Lakhs)', data: [8.2, 6.4, 5.1, 3.8, 2.9], color: '#f59e0b' }],
            unitPrefix: '₹',
            unitSuffix: 'L',
          },
          table: {
            columns: [
              { key: 'service', header: 'Service Name' },
              { key: 'category', header: 'Category' },
              { key: 'bookings', header: 'Bookings' },
              { key: 'price', header: 'Price', isCurrency: true },
              { key: 'revenue', header: 'Revenue (₹)', isCurrency: true },
              { key: 'share', header: 'Share' },
            ],
            rows: [
              { service: 'Artisan Balayage & Olaplex Glaze', category: 'Hair Color', bookings: 146, price: 4000, revenue: 584000, share: '24.2%' },
              { service: 'Keratin Smoothing Complex', category: 'Treatments', bookings: 85, price: 5000, revenue: 425000, share: '17.6%' },
              { service: 'Hydra-Facial Oxygen Glow', category: 'Skin Aesthetics', bookings: 112, price: 3500, revenue: 392000, share: '16.2%' },
              { service: 'Signature Hair Spa & Scalp Scrub', category: 'Hair Treatments', bookings: 138, price: 1800, revenue: 248400, share: '10.3%' },
              { service: 'Executive Haircut & Royal Shave', category: 'Cuts & Grooming', bookings: 215, price: 1000, revenue: 215000, share: '8.9%' },
            ],
            totalRowCount: 5,
          },
          generatedSql: `SELECT s.name AS service_name, sc.name AS category_name, COUNT(ii.id) AS total_bookings, SUM(ii.total_price) AS total_revenue FROM services s JOIN service_categories sc ON s.category_id = sc.id JOIN invoice_items ii ON s.id = ii.service_id WHERE s.organization_id = 'org-hive-001' GROUP BY s.name, sc.name ORDER BY total_revenue DESC;`,
          sanitizedSqlForDisplay: `SELECT s.name, sc.name, COUNT(ii.id) AS bookings, SUM(ii.total_price) AS revenue FROM services s JOIN invoice_items ii ON s.id = ii.service_id WHERE s.organization_id = :org_id GROUP BY s.name ORDER BY revenue DESC;`,
          executionTimeMs: 31,
          securityScopeApplied: { organizationId: 'org-hive-001', branchScope: 'Enterprise Scope', role: activeScope, isRestricted: false },
          suggestedFollowUps: ['Which services have declining demand?', 'Show retail products that pair with Balayage'],
          timestamp: new Date().toISOString(),
        };
      } else if (norm.includes('product') || norm.includes('inventory') || norm.includes('stock')) {
        queryResult = {
          queryId: `qr-${Date.now()}`,
          question: q,
          intent: 'INVENTORY_LEVELS',
          executiveSummary:
            '4 critical retail products are below minimum buffer levels. Olaplex No. 3 Hair Perfector at Jubilee Hills has only 5 units remaining (estimated 2 days until complete stockout). Urgent purchase orders recommended.',
          kpis: [
            { label: 'Critical Stockout Alerts', value: '4 Items', change: 'Action Required', changeType: 'negative' },
            { label: 'Earliest Stockout', value: '2 Days', subtitle: 'Olaplex No. 3 (Jubilee)' },
            { label: 'Recommended PO Value', value: '₹1.18 Lakh', subtitle: '75 total units' },
            { label: 'Active Retail SKUs', value: '84 SKUs', subtitle: '94.2% In-Stock' },
          ],
          chart: {
            type: 'BAR',
            title: 'Critical Inventory Levels vs Safety Thresholds',
            subtitle: 'Units on hand vs minimum safety reorder point',
            xAxisLabels: ['Olaplex No. 3', 'Moroccanoil 100ml', 'Kérastase Scrub', 'Dyson Dryer'],
            datasets: [
              { label: 'Current Stock', data: [5, 4, 1, 1], color: '#ef4444' },
              { label: 'Safety Threshold', data: [15, 12, 8, 4], color: '#64748b' },
              { label: 'Suggested Reorder', data: [30, 24, 16, 5], color: '#10b981' },
            ],
            unitSuffix: ' units',
          },
          table: {
            columns: [
              { key: 'product', header: 'Product & SKU' },
              { key: 'branch', header: 'Branch' },
              { key: 'stock', header: 'Current' },
              { key: 'threshold', header: 'Min' },
              { key: 'days', header: 'Stockout In' },
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
          },
          generatedSql: `SELECT p.name, p.sku, b.name AS branch_name, i.current_stock, i.min_stock_level, (i.current_stock / NULLIF(i.daily_burn_rate, 0)) AS days_until_stockout FROM products p JOIN branch_inventory i ON p.id = i.product_id JOIN branches b ON i.branch_id = b.id WHERE p.organization_id = 'org-hive-001' AND i.current_stock <= i.min_stock_level ORDER BY days_until_stockout ASC;`,
          sanitizedSqlForDisplay: `SELECT p.name, p.sku, i.current_stock, i.min_stock_level FROM products p JOIN branch_inventory i ON p.id = i.product_id WHERE p.organization_id = :org_id AND i.current_stock <= i.min_stock_level;`,
          executionTimeMs: 25,
          securityScopeApplied: { organizationId: 'org-hive-001', branchScope: 'Enterprise Scope', role: activeScope, isRestricted: false },
          suggestedFollowUps: ['Generate automatic Purchase Order for Olaplex No. 3', 'Show warehouse stock for cross-branch transfer'],
          timestamp: new Date().toISOString(),
        };
      } else if (norm.includes('60 days') || norm.includes('dormant') || norm.includes('churn') || norm.includes('customer')) {
        queryResult = {
          queryId: `qr-${Date.now()}`,
          question: q,
          intent: 'CUSTOMER_CHURN_RETENTION',
          executiveSummary:
            'Found 142 high-value clients who have not visited in over 60 days, representing ₹8.92 Lakhs in annualized revenue at risk. 38% are Gold/Platinum VIP members eligible for automated VIP recovery perks.',
          kpis: [
            { label: 'Dormant Clients (>60 Days)', value: '142 Guests', change: 'At-risk cohort', changeType: 'negative' },
            { label: 'At-Risk Annual Revenue', value: '₹8.92 Lakh', subtitle: 'Past 12M Avg Spend' },
            { label: 'VIP Tier Dormant Cohort', value: '38% VIP Members', subtitle: '54 Platinum/Gold' },
            { label: 'Predicted Win-back Rate', value: '42.8%', change: '+15% with WhatsApp perk', changeType: 'positive' },
          ],
          chart: {
            type: 'DONUT',
            title: 'Dormant Client Distribution by Membership Tier',
            subtitle: 'Cohort segmentation of clients inactive for 60+ days',
            xAxisLabels: ['Platinum VIP', 'Gold Elite', 'Silver Classic', 'Standard / Walk-in'],
            datasets: [{ label: 'Dormant Guests', data: [38, 48, 34, 22], color: '#f59e0b' }],
          },
          table: {
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
          },
          generatedSql: `SELECT c.id, c.full_name, c.tier, MAX(i.created_at) AS last_visit_date, (CURRENT_DATE - MAX(i.created_at)::date) AS days_since_last_visit, SUM(i.grand_total) AS lifetime_spend FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.organization_id = 'org-hive-001' GROUP BY c.id, c.full_name, c.tier HAVING (CURRENT_DATE - MAX(i.created_at)::date) >= 60 ORDER BY lifetime_spend DESC LIMIT 50;`,
          sanitizedSqlForDisplay: `SELECT c.full_name, c.tier, MAX(i.created_at) AS last_visit, (CURRENT_DATE - MAX(i.created_at)::date) AS days_inactive FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.organization_id = :org_id GROUP BY c.full_name HAVING days_inactive >= 60;`,
          executionTimeMs: 48,
          securityScopeApplied: { organizationId: 'org-hive-001', branchScope: 'Enterprise Scope', role: activeScope, isRestricted: false },
          suggestedFollowUps: ['Launch WhatsApp win-back broadcast to this cohort', 'Which services have highest churn?'],
          timestamp: new Date().toISOString(),
        };
      } else {
        queryResult = {
          queryId: `qr-${Date.now()}`,
          question: q,
          intent: 'CUSTOM_ANALYTICS',
          executiveSummary: `Analyzed operational metrics across the salon network. Total revenue over the past 30 days is ₹26.77 Lakh with 1,280 appointments and a 94.2% guest satisfaction rating.`,
          kpis: [
            { label: '30-Day Revenue', value: '₹26.77 Lakh', change: '+14.2% growth', changeType: 'positive' },
            { label: 'Appointments', value: '1,280', subtitle: '84% Chair Occupancy' },
            { label: 'Average Ticket', value: '₹2,091', subtitle: 'Per client visit' },
            { label: 'Guest Rating', value: '4.91 ★', subtitle: '420 verified reviews' },
          ],
          chart: {
            type: 'LINE',
            title: '30-Day Revenue Trajectory',
            subtitle: 'Daily gross collections (INR Thousands)',
            xAxisLabels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
            datasets: [{ label: 'Daily Revenue (₹k)', data: [82, 94, 78, 112, 105, 128, 142], color: '#f59e0b' }],
            unitPrefix: '₹',
            unitSuffix: 'k',
          },
          table: {
            columns: [
              { key: 'metric', header: 'Key Operational Dimension' },
              { key: 'current', header: 'Current Value' },
              { key: 'target', header: 'Monthly Target' },
              { key: 'status', header: 'Status' },
            ],
            rows: [
              { metric: 'Gross Service Revenue', current: '₹21.84 Lakh', target: '₹24.00 Lakh', status: 'On Track (91%)' },
              { metric: 'Retail Product Sales', current: '₹4.93 Lakh', target: '₹5.00 Lakh', status: 'Ahead of Pace (98%)' },
              { metric: 'Client Rebooking Rate', current: '76.4%', target: '70.0%', status: 'Exceeding Target' },
              { metric: 'Retail Attach Rate', current: '23.8%', target: '20.0%', status: 'Exceeding Target' },
            ],
            totalRowCount: 4,
          },
          generatedSql: `SELECT DATE_TRUNC('day', i.created_at) AS date, COUNT(i.id) AS bills_count, SUM(i.grand_total) AS total_revenue FROM invoices i WHERE i.organization_id = 'org-hive-001' AND i.created_at >= NOW() - INTERVAL '30 days' GROUP BY date ORDER BY date DESC;`,
          sanitizedSqlForDisplay: `SELECT DATE_TRUNC('day', i.created_at) AS date, SUM(i.grand_total) AS total_revenue FROM invoices i WHERE i.organization_id = :org_id GROUP BY date;`,
          executionTimeMs: 22,
          securityScopeApplied: { organizationId: 'org-hive-001', branchScope: 'Enterprise Scope', role: activeScope, isRestricted: false },
          suggestedFollowUps: ['Which branch performed best this month?', 'Which stylist generated the highest revenue?'],
          timestamp: new Date().toISOString(),
        };
      }

      // Record in audit log
      const newAudit: AIAuditLogEntry = {
        id: queryResult.queryId,
        userId: 'usr-admin-1',
        userName: 'deepak.admin',
        userRole: activeScope,
        branchId: isScoped ? selectedBranch : undefined,
        branchName: isScoped ? `Branch ${selectedBranch}` : 'Enterprise All Branches',
        question: q,
        intent: queryResult.intent,
        generatedSql: queryResult.generatedSql,
        executionTimeMs: queryResult.executionTimeMs,
        rowCount: queryResult.table?.totalRowCount || 1,
        status: 'SUCCESS',
        securityContext: {
          organizationId: 'org-hive-001',
          branchId: isScoped ? selectedBranch : undefined,
          role: activeScope,
          permissions: ['ai:read', 'analytics:all'],
        },
        createdAt: new Date().toISOString(),
      };
      setAuditLogs((prev) => [newAudit, ...prev]);

      // Append AI response
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          queryResult,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **Security & Query Guard Violation**: ${err?.message || 'Unauthorized query or mutation syntax rejected.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP HEADER & RBAC SECURITY CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white">Hive Salon AI</h1>
            <Badge variant="warning">Business Intelligence & ML</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Natural language Text-to-SQL analytics, predictive forecasting, automated strategic insights, and multi-tenant RBAC security.
          </p>
        </div>

        {/* Geographic RBAC Scope Simulator */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 px-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">RBAC Simulator:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveScope('SUPER_ADMIN')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                activeScope === 'SUPER_ADMIN' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Enterprise Admin (All Branches)
            </button>
            <button
              onClick={() => setActiveScope('BRANCH_MANAGER')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                activeScope === 'BRANCH_MANAGER' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Branch Manager (Scoped)
            </button>
          </div>

          {activeScope === 'BRANCH_MANAGER' && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-amber-300 focus:outline-none"
            >
              <option value="b1">Jubilee Hills Flagship (b1)</option>
              <option value="b2">Banjara Hills Spa (b2)</option>
              <option value="b3">Hitech City Express (b3)</option>
              <option value="b4">Indiranagar Sanctuary (b4)</option>
            </select>
          )}
        </div>
      </div>

      {/* 2. MAIN NAVIGATION TABS */}
      <Tabs
        tabs={[
          { id: 'copilot', label: 'AI Chat Copilot & Text-to-SQL', icon: <Bot className="w-4 h-4" /> },
          { id: 'forecasting', label: 'Predictive Forecasting (5 Models)', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'insights', label: 'Automated Strategic Insights', icon: <Lightbulb className="w-4 h-4" /> },
          { id: 'audit', label: 'AI Query Audit & SQL Security Inspector', icon: <Lock className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* =======================================================================
          TAB 1: AI CHAT COPILOT & TEXT-TO-SQL
      ======================================================================== */}
      {activeTab === 'copilot' && (
        <div className="space-y-4">
          {/* Chat Container Card */}
          <Card className="border-slate-800 bg-slate-950/60 backdrop-blur">
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Message Thread */}
              <div className="space-y-6 min-h-[420px] max-h-[640px] overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-3xl rounded-2xl p-4 text-xs space-y-3 ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium ml-12 rounded-tr-sm shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-lg'
                      }`}
                    >
                      {/* Simple Text */}
                      {msg.text && (
                        <div className="leading-relaxed text-[13px] whitespace-pre-wrap">{msg.text}</div>
                      )}

                      {/* Structured AI Query Result Card */}
                      {msg.queryResult && (
                        <div className="space-y-4 pt-1">
                          {/* Executive Summary Callout */}
                          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-100 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="leading-relaxed text-xs">
                              <span className="font-bold text-amber-300 block mb-0.5">Executive Summary</span>
                              {msg.queryResult.executiveSummary}
                            </div>
                          </div>

                          {/* KPI Badges Grid */}
                          {msg.queryResult.kpis && msg.queryResult.kpis.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {msg.queryResult.kpis.map((kpi, kIdx) => (
                                <div key={kIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                  <span className="text-[10px] text-slate-400 block font-medium">{kpi.label}</span>
                                  <span className="text-base font-black text-white block tabular-nums">{kpi.value}</span>
                                  {kpi.change && (
                                    <span
                                      className={`text-[10px] font-semibold block ${
                                        kpi.changeType === 'positive' ? 'text-emerald-400' : kpi.changeType === 'negative' ? 'text-rose-400' : 'text-slate-400'
                                      }`}
                                    >
                                      {kpi.change}
                                    </span>
                                  )}
                                  {kpi.subtitle && !kpi.change && (
                                    <span className="text-[10px] text-slate-500 block">{kpi.subtitle}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Dynamic Visualization Chart */}
                          {msg.queryResult.chart && (
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-200">{msg.queryResult.chart.title}</h4>
                                  {msg.queryResult.chart.subtitle && (
                                    <p className="text-[10px] text-slate-500">{msg.queryResult.chart.subtitle}</p>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-[10px]">
                                  {msg.queryResult.chart.type} CHART
                                </Badge>
                              </div>

                              {/* Interactive CSS Bar / Line Visualizer */}
                              <div className="space-y-2 pt-2">
                                {msg.queryResult.chart.datasets.map((dataset: any, dIdx: number) => (
                                  <div key={dIdx} className="space-y-1.5">
                                    <span className="text-[10px] font-semibold text-slate-400 block">{dataset.label}</span>
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 items-end h-28 pt-4 pb-2 px-2 bg-slate-900/60 rounded-lg border border-slate-850">
                                      {dataset.data.map((val: number, vIdx: number) => {
                                        const maxVal = Math.max(...dataset.data, 1);
                                        const heightPct = Math.max(8, Math.round((val / maxVal) * 100));
                                        const label = msg.queryResult?.chart?.xAxisLabels[vIdx] || `Col ${vIdx + 1}`;
                                        return (
                                          <div key={vIdx} className="flex flex-col items-center justify-end h-full group relative">
                                            {/* Hover tooltip */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10 font-mono">
                                              {msg.queryResult?.chart?.unitPrefix || ''}{val}{msg.queryResult?.chart?.unitSuffix || ''}
                                            </div>
                                            <div
                                              style={{ height: `${heightPct}%`, backgroundColor: dataset.color || '#f59e0b' }}
                                              className="w-full max-w-[28px] rounded-t-md transition-all group-hover:brightness-125"
                                            />
                                            <span className="text-[9px] text-slate-500 mt-1 truncate w-full text-center">
                                              {label}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Data Table Breakdown */}
                          {msg.queryResult.table && (
                            <div className="rounded-xl border border-slate-800 overflow-hidden">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-800">
                                  <tr>
                                    {msg.queryResult.table.columns.map((col: any) => (
                                      <th key={col.key} className="p-2.5 font-semibold">
                                        {col.header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-[11px]">
                                  {msg.queryResult.table.rows.map((row: any, rIdx: number) => (
                                    <tr key={rIdx} className="hover:bg-slate-850/50 transition-colors">
                                      {msg.queryResult?.table?.columns.map((col: any) => (
                                        <td key={col.key} className="p-2.5 text-slate-300">
                                          {col.isCurrency ? formatCurrency(row[col.key]) : row[col.key]}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Collapsible SQL & Security Audit Inspector */}
                          <div className="pt-1">
                            <button
                              onClick={() =>
                                setExpandedSqlId(expandedSqlId === msg.queryResult?.queryId ? null : msg.queryResult?.queryId || null)
                              }
                              className="text-[11px] font-semibold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                            >
                              <Database className="w-3.5 h-3.5" />
                              <span>
                                {expandedSqlId === msg.queryResult.queryId ? 'Hide SQL & Security Audit' : 'Inspect Generated SQL & Applied RBAC Predicates'}
                              </span>
                              {expandedSqlId === msg.queryResult.queryId ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            {expandedSqlId === msg.queryResult.queryId && (
                              <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2 text-left">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                                  <span className="flex items-center gap-1 text-emerald-400">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Read-Only Validated (0 mutations)
                                  </span>
                                  <span>Latency: <strong className="text-amber-300">{msg.queryResult.executionTimeMs}ms</strong></span>
                                </div>
                                <div className="text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-850 overflow-x-auto">
                                  <code>{msg.queryResult.sanitizedSqlForDisplay}</code>
                                </div>
                                <div className="text-[10px] text-slate-500 flex flex-wrap gap-3">
                                  <span>Scope: <strong className="text-slate-300">{msg.queryResult.securityScopeApplied.branchScope}</strong></span>
                                  <span>Role: <strong className="text-slate-300">{msg.queryResult.securityScopeApplied.role}</strong></span>
                                  <span>Zero-DML Enforcement: <strong className="text-emerald-400">Active</strong></span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Suggested Follow-up Pills */}
                          {msg.queryResult.suggestedFollowUps && msg.queryResult.suggestedFollowUps.length > 0 && (
                            <div className="pt-2 border-t border-slate-800/60">
                              <span className="text-[10px] text-slate-400 font-bold block mb-1.5">Suggested Next Questions:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.queryResult.suggestedFollowUps.map((promptText, pIdx) => (
                                  <button
                                    key={pIdx}
                                    onClick={() => handleSendQuery(promptText)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/30 text-[10px] transition-all"
                                  >
                                    {promptText} →
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-500 block text-right pt-0.5">{msg.timestamp}</span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                        <Users className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Synthesizing authorized SQL query & aggregating metrics...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions Carousel */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block">Quick Analytics Prompts:</span>
                <div className="flex flex-wrap gap-2">
                  {suggestedPills.map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(pill.query)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500/15 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs transition-all shadow-sm flex items-center gap-1.5"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Natural Language Prompt Input Bar */}
              <div className="relative flex items-center gap-2 pt-2">
                <div className="relative flex-1">
                  <Input
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendQuery();
                      }
                    }}
                    placeholder="Ask Hive Salon AI (e.g. 'Which branch had the highest revenue this month?')"
                    className="pr-12 text-xs py-3 h-11 bg-slate-950 border-slate-750 focus:border-amber-400 rounded-2xl"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    <span>↵ Enter</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleSendQuery()}
                  disabled={isLoading || !inputQuery.trim()}
                  className="rounded-2xl h-11 px-5 text-xs font-bold"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  Ask AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =======================================================================
          TAB 2: PREDICTIVE FORECASTING (5 ML MODELS)
      ======================================================================== */}
      {activeTab === 'forecasting' && forecasts && (
        <div className="space-y-6">
          {/* Sub-selector for 5 Forecasting Models */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'revenue', label: '1. Revenue Forecast', icon: TrendingUp, stat: '₹31.8L (+18.8%)' },
              { id: 'bookings', label: '2. Booking & Chair Load', icon: Calendar, stat: '88.4% Occupancy' },
              { id: 'inventory', label: '3. Inventory Depletion', icon: Package, stat: '4 Stockout Risks' },
              { id: 'churn', label: '4. Churn Risk & RFM', icon: Users, stat: '142 Dormant Clients' },
              { id: 'demand', label: '5. Service Demand Spikes', icon: Zap, stat: '1.85x Weekend Surge' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedForecastCategory(f.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedForecastCategory === f.id
                    ? 'bg-gradient-to-br from-amber-500/20 to-slate-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <f.icon className={`w-4 h-4 ${selectedForecastCategory === f.id ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-white block">{f.label}</span>
                </div>
                <span className="text-[11px] font-mono text-amber-300 block">{f.stat}</span>
              </button>
            ))}
          </div>

          {/* Model 1: Revenue Forecast */}
          {selectedForecastCategory === 'revenue' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white">Next 30/60/90-Day Revenue Projection</CardTitle>
                    <CardDescription>{forecasts.revenueForecast.summary}</CardDescription>
                  </div>
                  <Badge variant="success">+18.8% Projected Growth</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <StatCard title="Conservative (Lower Bound)" value="₹29.20 Lakh" subtitle="95% Confidence floor" />
                  <StatCard title="Baseline Target Projection" value="₹31.80 Lakh" subtitle="+18.8% vs last month" />
                  <StatCard title="Optimistic (Upper Bound)" value="₹34.50 Lakh" subtitle="Peak wedding demand" />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200">Daily Trajectory Model (October 2026)</h4>
                  <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 pb-2 px-2 bg-slate-900/40 rounded-xl border border-slate-850">
                    {forecasts.revenueForecast.timeSeries.map((pt, idx) => {
                      const heightPct = Math.round((pt.baseline / 180000) * 100);
                      return (
                        <div key={idx} className="flex flex-col items-center justify-end h-full group relative">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-[10px] text-white px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10 font-mono">
                            Opt: ₹{(pt.optimistic / 1000).toFixed(0)}k | Base: ₹{(pt.baseline / 1000).toFixed(0)}k
                          </div>
                          <div style={{ height: `${heightPct}%` }} className="w-full max-w-[32px] rounded-t-lg bg-amber-500 group-hover:bg-amber-400 transition-all" />
                          <span className="text-[10px] text-slate-400 mt-1.5">{pt.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model 2: Booking & Chair Load */}
          {selectedForecastCategory === 'bookings' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white">Chair Occupancy & Roster Allocation Forecast</CardTitle>
                    <CardDescription>{forecasts.bookingForecast.summary}</CardDescription>
                  </div>
                  <Badge variant="warning">88.4% Chain Occupancy</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {forecasts.bookingForecast.branchBreakdown.map((b, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-white block">{b.branchName}</span>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Predicted Visits:</span>
                        <strong className="text-amber-400 font-mono">{b.predictedAppointments}</strong>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Chair Occupancy:</span>
                        <strong className="text-emerald-400 font-mono">{b.predictedOccupancyRate}%</strong>
                      </div>
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <span>Peak: <strong className="text-slate-200">{b.peakTimeSlot}</strong></span><br />
                        <span>Recommended Roster: <strong className="text-amber-300">{b.recommendedStaffCount} Stylists</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model 3: Inventory Depletion */}
          {selectedForecastCategory === 'inventory' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white">Inventory Depletion Velocity & Stockout Risk</CardTitle>
                    <CardDescription>{forecasts.inventoryForecast.summary}</CardDescription>
                  </div>
                  <Badge variant="destructive">4 Urgent Reorders</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 overflow-hidden">
                  {forecasts.inventoryForecast.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.productName}</span>
                          <Badge variant={item.urgency === 'CRITICAL' ? 'destructive' : 'warning'}>
                            {item.daysUntilStockout} Days Left
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku} • Burn Rate: {item.dailyBurnRate} units/day</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-slate-400 text-[10px] block">Suggested PO</span>
                          <strong className="text-amber-300 font-mono">{item.suggestedReorderQuantity} units ({formatCurrency(item.estimatedCost)})</strong>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => setActiveTab('copilot')}>
                          Create PO
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model 4: Customer Churn RFM */}
          {selectedForecastCategory === 'churn' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white">Customer Churn Risk & VIP Win-Back Scoring</CardTitle>
                    <CardDescription>{forecasts.churnForecast.summary}</CardDescription>
                  </div>
                  <Badge variant="destructive">₹8.92L Revenue at Risk</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {forecasts.churnForecast.cohorts.map((c, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{c.segment}</span>
                        <Badge variant={c.churnRiskPercentage > 60 ? 'destructive' : 'warning'}>
                          {c.churnRiskPercentage}% Churn Risk
                        </Badge>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Dormant (&gt;60 days): <strong className="text-slate-200">{c.dormantOver60Days} / {c.totalCustomers}</strong></span>
                        <span>Revenue at Risk: <strong className="text-rose-400 font-mono">{formatCurrency(c.atRiskRevenueValue)}</strong></span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-[11px] text-amber-300">
                        <span>Win-back Action: <strong>{c.suggestedWinbackCampaign}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model 5: Demand Spikes */}
          {selectedForecastCategory === 'demand' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-white">Service Demand Spikes & Station Surge Modeling</CardTitle>
                    <CardDescription>{forecasts.demandForecast.summary}</CardDescription>
                  </div>
                  <Badge variant="warning">Weekend Station Surge Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {forecasts.demandForecast.spikes.map((s, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{s.serviceCategory}</span>
                          <Badge variant="warning">{s.spikeFactor}x Surge Factor</Badge>
                        </div>
                        <span className="text-[11px] text-slate-400">{s.dayOfWeek} • Window: {s.timeWindow}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-[11px] text-emerald-300 sm:max-w-xs text-left sm:text-right">
                        <span>Recommended: {s.recommendedAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* =======================================================================
          TAB 3: AUTOMATED STRATEGIC INSIGHTS
      ======================================================================== */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="border-slate-800 bg-slate-900/90 hover:border-amber-500/40 transition-all">
                <CardContent className="p-5 space-y-3 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Lightbulb className="w-4 h-4" />
                      </span>
                      <div>
                        <Badge
                          variant={
                            insight.severity === 'HIGH' ? 'destructive' : insight.severity === 'MEDIUM' ? 'warning' : 'outline'
                          }
                          className="text-[10px]"
                        >
                          {insight.category.replace(/_/g, ' ')}
                        </Badge>
                        <h3 className="text-sm font-bold text-white mt-1">{insight.title}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Financial Impact:</span>
                      <strong className="text-emerald-400 font-mono">{insight.metricImpact}</strong>
                    </div>
                    <div className="text-[11px] text-amber-300">
                      <span>Action: {insight.recommendedAction}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendQuery(`Tell me more about ${insight.title}`)}
                      className="text-xs"
                    >
                      Analyze with AI →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* =======================================================================
          TAB 4: AI AUDIT & SQL SECURITY INSPECTOR
      ======================================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-white">AI Query Audit Log & Execution Metrics</CardTitle>
                  <CardDescription>
                    Complete immutable audit trail of all natural language questions, generated queries, user security scopes, and response latencies.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> RBAC Enforced
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800 text-xs text-left">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-950 hover:bg-slate-900/60 transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">"{log.question}"</span>
                        <Badge variant="warning">{log.intent}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>User: <strong className="text-slate-200">{log.userName}</strong> ({log.userRole})</span>
                        <span>Latency: <strong className="text-amber-400">{log.executionTimeMs}ms</strong></span>
                        <Badge variant="success">SAFE (READ ONLY)</Badge>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-850 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      <code>{log.generatedSql}</code>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Scope Applied: {log.branchName || 'Enterprise Multi-Branch'}</span>
                      <span>{new Date(log.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
