import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { DIRECTUS_CLIENT } from '../directus/directus.provider';
import { readMe } from '@directus/sdk';

@Injectable()
export class DirectusHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(DIRECTUS_CLIENT)
    private readonly client: { request: (cmd: unknown) => Promise<unknown> },
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.client.request(readMe({ fields: ['id'] }));
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Directus health check failed',
        this.getStatus(key, false, {
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
      );
    }
  }
}
