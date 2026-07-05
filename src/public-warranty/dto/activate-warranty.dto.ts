import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class ActivateWarrantyDto {
  @IsString()
  @MinLength(3)
  sokhung!: string;

  @IsString()
  @MinLength(3)
  somay!: string;

  @IsString()
  @IsNotEmpty()
  dealer_id!: string;

  @IsString()
  @IsNotEmpty()
  dealer_name!: string;

  @IsString()
  @IsNotEmpty()
  customer_name!: string;

  @IsString()
  @IsNotEmpty()
  customer_phone!: string;

  @IsString()
  @IsNotEmpty()
  customer_address!: string;

  @IsOptional()
  @IsString()
  customer_dob?: string;

  @IsOptional()
  @IsString()
  customer_email?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
