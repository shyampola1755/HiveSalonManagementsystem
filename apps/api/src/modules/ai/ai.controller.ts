import { Controller, Post, Get, Body, Headers, UseGuards, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { AIQueryRequest, AISecurityContext } from '@hive/types';

@Controller('api/v1/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  async executeQuery(
    @Body() body: AIQueryRequest,
    @Headers('x-org-id') orgId?: string,
    @Headers('x-branch-id') branchId?: string,
    @Headers('x-user-role') role?: string,
    @Headers('x-user-id') userId?: string
  ) {
    const callerContext: Partial<AISecurityContext> = {
      organizationId: orgId || body.securityContext?.organizationId || 'org-hive-001',
      branchId: branchId || body.securityContext?.branchId,
      role: role || body.securityContext?.role || 'SUPER_ADMIN',
      userId: userId || body.securityContext?.userId || 'usr-admin-1',
    };

    return this.aiService.executeQuery(body, callerContext);
  }

  @Get('forecasts')
  async getForecasts() {
    return this.aiService.getForecastSuite();
  }

  @Get('insights')
  async getInsights() {
    return this.aiService.getStrategicInsights();
  }

  @Get('audit')
  async getAuditLogs(@Query('role') role?: string, @Headers('x-user-role') headerRole?: string) {
    const activeRole = role || headerRole || 'SUPER_ADMIN';
    return this.aiService.getAuditLogs(activeRole);
  }

  @Get('prompts')
  async getSuggestedPrompts() {
    return [
      {
        category: 'Revenue & Sales',
        prompts: [
          'How much did we sell today?',
          'Which branch performed best this month?',
          'Show me monthly revenue trend for all branches',
        ],
      },
      {
        category: 'Team & Productivity',
        prompts: [
          'Which stylist generated the highest revenue?',
          'Show stylist commission and guest satisfaction ranking',
          'Which stylist has the highest retail cross-sell rate?',
        ],
      },
      {
        category: 'Services & Treatments',
        prompts: [
          'Which services are most popular?',
          'Show service category revenue contribution',
          'Which services have declining demand?',
        ],
      },
      {
        category: 'Inventory & Stockouts',
        prompts: [
          'Which products are running low?',
          'Show days until stockout for retail products',
          'What is the estimated restock cost for critical items?',
        ],
      },
      {
        category: 'Retention & Churn',
        prompts: [
          'Which customers haven\'t visited in 60 days?',
          'Show dormant VIP clients and at-risk revenue',
          'What is the predicted win-back recovery rate?',
        ],
      },
      {
        category: 'Predictive Forecasting',
        prompts: [
          'Forecast revenue for the next 90 days',
          'What is the projected booking load by branch next month?',
          'Show service demand surge patterns by day of week',
        ],
      },
    ];
  }
}
