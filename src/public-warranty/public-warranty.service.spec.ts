import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DIRECTUS_CLIENT } from '../directus/directus.provider';
import { PublicWarrantyService } from './public-warranty.service';

describe('PublicWarrantyService', () => {
  const request = jest.fn();
  const directus = { request } as any;
  const configService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'DIRECTUS_URL') return 'http://directus.local';
      if (key === 'DIRECTUS_ADMIN_TOKEN') return 'secret';
      throw new Error(`Unexpected key ${key}`);
    }),
    get: jest.fn((key: string) => {
      if (key === 'WARRANTY_DURATION_MONTHS') return '24';
      return undefined;
    }),
  } as unknown as ConfigService;

  let service: PublicWarrantyService;

  beforeEach(() => {
    request.mockReset();
    jest.restoreAllMocks();
    service = new PublicWarrantyService(directus, configService);
    jest.spyOn(service as any, 'getAdminClient').mockReturnValue(directus);
  });

  it('returns vehicle and active warranty on check', async () => {
    request
      .mockResolvedValueOnce([
        {
          id: 'vehicle-1',
          frame_no: 'FRAME-001',
          engine_no: 'ENGINE-001',
          vin: 'VIN001',
          model_code: 'M1',
          model_name: 'Model 1',
          warranty_status: 'ACTIVE',
          delivery_date: '2026-05-27',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'w1',
          warranty_code: 'WRN-1',
          status: 'ACTIVE',
          activated_date: '2026-05-27',
          activated_at: '2026-05-27T10:00:00.000Z',
          warranty_start_date: '2026-05-27',
          warranty_end_date: '2028-05-27',
        },
      ])
      .mockResolvedValueOnce({ id: 'log-1' });

    const result = await service.check({
      sokhung: 'frame-001',
      somay: 'engine-001',
    });

    expect(result.vehicle.frame_no).toBe('FRAME-001');
    expect(result.active_warranty?.warranty_code).toBe('WRN-1');
    expect(request).toHaveBeenCalledTimes(3);
  });

  it('throws when vehicle is not found on check', async () => {
    request.mockResolvedValueOnce([]).mockResolvedValueOnce({ id: 'log-1' });

    await expect(
      service.check({ sokhung: 'missing', somay: 'missing' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates activation and updates vehicle status', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-27T10:30:00.000Z'));

    request
      .mockResolvedValueOnce([
        {
          id: 'vehicle-1',
          frame_no: 'FRAME-001',
          engine_no: 'ENGINE-001',
          vin: 'VIN001',
          warranty_status: 'NOT_ACTIVATED',
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({
        id: 'activation-1',
        warranty_code: 'WRN-20260527-E-001',
        activated_date: '2026-05-27',
        activated_at: '2026-05-27T10:30:00.000Z',
        warranty_start_date: '2026-05-27',
        warranty_end_date: '2028-05-27',
        status: 'ACTIVE',
      })
      .mockResolvedValueOnce({ id: 'vehicle-1' })
      .mockResolvedValueOnce({ id: 'log-1' });

    const result = await service.activate({
      sokhung: 'frame-001',
      somay: 'engine-001',
      customer_name: 'A',
    });

    expect(result.activation.status).toBe('ACTIVE');
    expect(result.vehicle.warranty_status).toBe('ACTIVE');
    expect(request).toHaveBeenCalledTimes(5);
    jest.useRealTimers();
  });

  it('blocks duplicate activation', async () => {
    request
      .mockResolvedValueOnce([
        {
          id: 'vehicle-1',
          frame_no: 'FRAME-001',
          engine_no: 'ENGINE-001',
          warranty_status: 'ACTIVE',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'w1',
          warranty_code: 'WRN-1',
          status: 'ACTIVE',
          activated_date: '2026-05-27',
          activated_at: '2026-05-27T10:00:00.000Z',
          warranty_start_date: '2026-05-27',
          warranty_end_date: '2028-05-27',
        },
      ])
      .mockResolvedValueOnce({ id: 'log-1' });

    await expect(
      service.activate({ sokhung: 'frame-001', somay: 'engine-001' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
