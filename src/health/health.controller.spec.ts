import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DirectusHealthIndicator } from './directus.health';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let directusIndicator: DirectusHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: DirectusHealthIndicator,
          useValue: {
            isHealthy: jest.fn().mockResolvedValue({
              directus: { status: 'up' },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    directusIndicator = module.get<DirectusHealthIndicator>(
      DirectusHealthIndicator,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return healthy status when directus is up', async () => {
    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.details).toHaveProperty('directus');
    expect(result.details['directus'].status).toBe('up');
  });

  it('should throw when directus is down', async () => {
    const error = {
      directus: { status: 'down', message: 'Connection refused' },
    };
    (directusIndicator.isHealthy as jest.Mock).mockRejectedValue(error);

    await expect(controller.check()).rejects.toEqual(error);
  });
});
