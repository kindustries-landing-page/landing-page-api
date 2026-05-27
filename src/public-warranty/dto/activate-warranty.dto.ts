import { IsOptional, IsString, MinLength } from 'class-validator';

export class ActivateWarrantyDto {
  @IsString()
  @MinLength(3)
  sokhung!: string;

  @IsString()
  @MinLength(3)
  somay!: string;

  @IsOptional()
  @IsString()
  customer_name?: string;

  @IsOptional()
  @IsString()
  customer_phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
