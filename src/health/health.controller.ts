import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { DirectusHealthIndicator } from './directus.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private directus: DirectusHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.directus.isHealthy('directus'),
    ]);
  }
}
