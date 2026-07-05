import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckWarrantyDto } from './dto/check-warranty.dto';
import { ActivateWarrantyDto } from './dto/activate-warranty.dto';

@Injectable()
export class PublicWarrantyService {
  private readonly erpApiUrl: string;
  private readonly erpApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.erpApiUrl = this.configService.getOrThrow<string>('ERP_API_URL');
    this.erpApiKey = this.configService.get<string>('ERP_API_KEY') || '';
  }

  private async fetchFromErp(path: string, payload: any) {
    const url = `${this.erpApiUrl.replace(/\/$/, '')}${path}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.erpApiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new BadRequestException(data.message || 'ERP API Error');
      }

      return data;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to connect to ERP API: ${error.message}`,
      );
    }
  }

  async check(
    dto: CheckWarrantyDto,
    meta?: { ip?: string; userAgent?: string },
  ) {
    return this.fetchFromErp('/public-warranty/check', dto);
  }

  async activate(
    dto: ActivateWarrantyDto,
    meta?: { ip?: string; userAgent?: string },
  ) {
    return this.fetchFromErp('/public-warranty/activate', dto);
  }
}
