import { IsString, MinLength } from 'class-validator';

export class CheckWarrantyDto {
  @IsString()
  @MinLength(3)
  vin_no!: string;

  @IsString()
  @MinLength(3)
  engine_no!: string;
}
