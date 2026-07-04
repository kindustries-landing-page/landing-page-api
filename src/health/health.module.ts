import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DirectusHealthIndicator } from './directus.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DirectusHealthIndicator],
})
export class HealthModule {}
