import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CheckWarrantyDto } from './check-warranty.dto';

describe('CheckWarrantyDto', () => {
  function createDto(data: Partial<CheckWarrantyDto>) {
    return plainToInstance(CheckWarrantyDto, data);
  }

  it('should pass with valid data', async () => {
    const dto = createDto({ vin_no: 'FRAME-001', engine_no: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when vin_no is missing', async () => {
    const dto = createDto({ engine_no: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('vin_no');
  });

  it('should fail when engine_no is missing', async () => {
    const dto = createDto({ vin_no: 'FRAME-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('engine_no');
  });

  it('should fail when vin_no is too short', async () => {
    const dto = createDto({ vin_no: 'AB', engine_no: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('vin_no');
  });

  it('should fail when engine_no is too short', async () => {
    const dto = createDto({ vin_no: 'FRAME-001', engine_no: 'AB' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('engine_no');
  });

  it('should fail when vin_no is not a string', async () => {
    const dto = createDto({ vin_no: 123 as any, engine_no: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
