import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DirectusModule } from './directus/directus.module';
import { HealthModule } from './health/health.module';
import { PublicWarrantyModule } from './public-warranty/public-warranty.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DirectusModule,
    HealthModule,
    PublicWarrantyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
