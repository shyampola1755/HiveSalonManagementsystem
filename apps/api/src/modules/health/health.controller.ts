import { Controller, Get } from '@nestjs/common';
import { brandMeta } from '@hive/config';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    return {
      status: 'healthy',
      service: brandMeta.name,
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      version: '0.1.0-phase0',
    };
  }
}
