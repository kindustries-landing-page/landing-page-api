import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ActivateWarrantyDto } from './activate-warranty.dto';

describe('ActivateWarrantyDto', () => {
  function createDto(data: Partial<ActivateWarrantyDto>) {
    return plainToInstance(ActivateWarrantyDto, data);
  }

  it('should pass with required fields only', async () => {
    const dto = createDto({
      sokhung: 'FRAME-001',
      somay: 'ENGINE-001',
      customer_name: 'Nguyen Van A',
      customer_phone: '0901234567',
      customer_address: 'Hanoi',
      dealer_id: 'DL01',
      dealer_name: 'Dealer 1',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with all fields', async () => {
    const dto = createDto({
      sokhung: 'FRAME-001',
      somay: 'ENGINE-001',
      customer_name: 'Nguyen Van A',
      customer_phone: '0901234567',
      customer_address: 'Hanoi',
      dealer_id: 'DL01',
      dealer_name: 'Dealer 1',
      notes: 'Test note',
    });
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
    const dto = createDto({ sokhung: 'FRAME-001', somay: 'XY' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('somay');
  });

  it('should allow optional fields to be undefined', async () => {
    const dto = createDto({
      sokhung: 'FRAME-001',
      somay: 'ENGINE-001',
      customer_name: 'Nguyen Van A',
      customer_phone: '0901234567',
      customer_address: 'Hanoi',
      dealer_id: 'DL01',
      dealer_name: 'Dealer 1',
      notes: undefined,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when customer_name is not a string', async () => {
    const dto = createDto({
      sokhung: 'FRAME-001',
      somay: 'ENGINE-001',
      customer_name: 123 as any,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'customer_name')).toBe(true);
  });
});
