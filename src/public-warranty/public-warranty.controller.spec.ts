import { Test, TestingModule } from '@nestjs/testing';
import { PublicWarrantyController } from './public-warranty.controller';
import { PublicWarrantyService } from './public-warranty.service';

describe('PublicWarrantyController', () => {
  let controller: PublicWarrantyController;
  let service: jest.Mocked<PublicWarrantyService>;

  const mockService = {
    check: jest.fn(),
    activate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicWarrantyController],
      providers: [{ provide: PublicWarrantyService, useValue: mockService }],
    }).compile();

    controller = module.get<PublicWarrantyController>(PublicWarrantyController);
    service = module.get(PublicWarrantyService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    const dto = { sokhung: 'FRAME-001', somay: 'ENGINE-001' };
    const ip = '127.0.0.1';
    const userAgent = 'Mozilla/5.0';

    it('should call service.check with dto and meta', async () => {
      const expected = {
        found: true,
        vehicle: { frame_no: 'FRAME-001' },
        active_warranty: null,
      };
      mockService.check.mockResolvedValue(expected);

      const result = await controller.check(dto, ip, userAgent);

      expect(result).toEqual(expected);
      expect(service.check).toHaveBeenCalledWith(dto, { ip, userAgent });
    });

    it('should pass undefined userAgent when header is missing', async () => {
      mockService.check.mockResolvedValue({
        found: false,
        vehicle: null,
        active_warranty: null,
      });

      await controller.check(dto, ip, undefined);

      expect(service.check).toHaveBeenCalledWith(dto, {
        ip,
        userAgent: undefined,
      });
    });

    it('should return not found result', async () => {
      const notFound = { found: false, vehicle: null, active_warranty: null };
      mockService.check.mockResolvedValue(notFound);

      const result = await controller.check(dto, ip, userAgent);

      expect(result).toEqual(notFound);
    });
  });

  describe('activate', () => {
    const dto = {
      sokhung: 'FRAME-001',
      somay: 'ENGINE-001',
      customer_name: 'Nguyen Van A',
    };
    const ip = '192.168.1.1';
    const userAgent = 'Chrome/120';

    it('should call service.activate with dto and meta', async () => {
      const expected = {
        message: 'Kích hoạt bảo hành thành công',
        activation: {
          id: 'act-1',
          warranty_code: 'WRN-20260527-E-001',
          status: 'ACTIVE',
        },
        vehicle: { id: 'v-1', frame_no: 'FRAME-001' },
      };
      mockService.activate.mockResolvedValue(expected);

      const result = await controller.activate(dto, ip, userAgent);

      expect(result).toEqual(expected);
      expect(service.activate).toHaveBeenCalledWith(dto, { ip, userAgent });
    });

    it('should propagate service errors', async () => {
      mockService.activate.mockRejectedValue(
        new Error('Xe này đã được kích hoạt bảo hành'),
      );

      await expect(controller.activate(dto, ip, userAgent)).rejects.toThrow(
        'Xe này đã được kích hoạt bảo hành',
      );
    });
  });
});
