import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post,
  Query,
} from '@nestjs/common';
import { PublicWarrantyService } from './public-warranty.service';
import { CheckWarrantyDto } from './dto/check-warranty.dto';
import { ActivateWarrantyDto } from './dto/activate-warranty.dto';

@Controller('public-warranty')
export class PublicWarrantyController {
  constructor(private readonly publicWarrantyService: PublicWarrantyService) {}

  @Post('check')
  check(
    @Body() dto: CheckWarrantyDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.publicWarrantyService.check(dto, { ip, userAgent });
  }

  @Post('activate')
  activate(
    @Body() dto: ActivateWarrantyDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.publicWarrantyService.activate(dto, { ip, userAgent });
  }
}
