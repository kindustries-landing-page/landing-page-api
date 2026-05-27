import { Module } from '@nestjs/common';
import { PublicWarrantyController } from './public-warranty.controller';
import { PublicWarrantyService } from './public-warranty.service';

@Module({
  controllers: [PublicWarrantyController],
  providers: [PublicWarrantyService],
})
export class PublicWarrantyModule {}
