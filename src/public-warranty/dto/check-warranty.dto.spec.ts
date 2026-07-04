import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CheckWarrantyDto } from './check-warranty.dto';

describe('CheckWarrantyDto', () => {
  function createDto(data: Partial<CheckWarrantyDto>) {
    return plainToInstance(CheckWarrantyDto, data);
  }

  it('should pass with valid data', async () => {
    const dto = createDto({ sokhung: 'FRAME-001', somay: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when sokhung is missing', async () => {
    const dto = createDto({ somay: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('sokhung');
  });

  it('should fail when somay is missing', async () => {
    const dto = createDto({ sokhung: 'FRAME-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('somay');
  });

  it('should fail when sokhung is too short', async () => {
    const dto = createDto({ sokhung: 'AB', somay: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('sokhung');
  });

  it('should fail when somay is too short', async () => {
    const dto = createDto({ sokhung: 'FRAME-001', somay: 'AB' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('somay');
  });

  it('should fail when sokhung is not a string', async () => {
    const dto = createDto({ sokhung: 123 as any, somay: 'ENGINE-001' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
