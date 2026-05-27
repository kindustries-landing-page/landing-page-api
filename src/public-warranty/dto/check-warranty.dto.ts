import { IsString, MinLength } from 'class-validator';

export class CheckWarrantyDto {
  @IsString()
  @MinLength(3)
  sokhung!: string;

  @IsString()
  @MinLength(3)
  somay!: string;
}
