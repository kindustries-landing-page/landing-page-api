import { HealthCheckError } from '@nestjs/terminus';
import { DirectusHealthIndicator } from './directus.health';

describe('DirectusHealthIndicator', () => {
  let indicator: DirectusHealthIndicator;
  const request = jest.fn();
  const client = { request } as any;

  beforeEach(() => {
    request.mockReset();
    indicator = new DirectusHealthIndicator(client);
  });

  it('should return up status when directus responds', async () => {
    request.mockResolvedValue({ id: 'user-1' });

    const result = await indicator.isHealthy('directus');

    expect(result).toEqual({ directus: { status: 'up' } });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('should throw HealthCheckError when directus is unreachable', async () => {
    request.mockRejectedValue(new Error('connect ECONNREFUSED'));

    await expect(indicator.isHealthy('directus')).rejects.toBeInstanceOf(
      HealthCheckError,
    );
  });

  it('should include error message in the health check error', async () => {
    request.mockRejectedValue(new Error('timeout'));

    try {
      await indicator.isHealthy('directus');
      fail('Expected HealthCheckError');
    } catch (error) {
      expect(error).toBeInstanceOf(HealthCheckError);
      const causes = (error as HealthCheckError).causes;
      expect(causes).toEqual({
        directus: { status: 'down', message: 'timeout' },
      });
    }
  });

  it('should handle non-Error thrown values', async () => {
    request.mockRejectedValue('string error');

    try {
      await indicator.isHealthy('directus');
      fail('Expected HealthCheckError');
    } catch (error) {
      expect(error).toBeInstanceOf(HealthCheckError);
      const causes = (error as HealthCheckError).causes;
      expect(causes).toEqual({
        directus: { status: 'down', message: 'Unknown error' },
      });
    }
  });
});
