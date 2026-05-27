import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createDirectus,
  createItem,
  readItems,
  rest,
  staticToken,
  updateItem,
} from '@directus/sdk';
import { DIRECTUS_CLIENT } from '../directus/directus.provider';
import { CheckWarrantyDto } from './dto/check-warranty.dto';
import { ActivateWarrantyDto } from './dto/activate-warranty.dto';

type DirectusClient = ReturnType<typeof createDirectus>;

type VehicleRow = {
  id: string;
  frame_no: string;
  engine_no: string;
  vin?: string | null;
  model_code?: string | null;
  model_name?: string | null;
  warranty_status: string;
  delivery_date?: string | null;
};

type WarrantyRow = {
  id: string;
  warranty_code: string;
  status: string;
  activated_date: string;
  activated_at: string;
  warranty_start_date: string;
  warranty_end_date: string;
};

@Injectable()
export class PublicWarrantyService {
  constructor(
    @Inject(DIRECTUS_CLIENT)
    private readonly directus: DirectusClient,
    private readonly configService: ConfigService,
  ) {}

  private getAdminClient(): DirectusClient {
    const url = this.configService.getOrThrow<string>('DIRECTUS_URL');
    const token = this.configService.getOrThrow<string>('DIRECTUS_ADMIN_TOKEN');
    return createDirectus(url).with(staticToken(token)).with(rest());
  }

  private normalize(value: string): string {
    return value.trim().toUpperCase();
  }

  private toPayloadRecord(
    dto: CheckWarrantyDto | ActivateWarrantyDto,
  ): Record<string, unknown> {
    return { ...dto } as Record<string, unknown>;
  }

  private warrantyDurationMonths(): number {
    const raw = this.configService.get<string>('WARRANTY_DURATION_MONTHS');
    const parsed = Number(raw ?? '24');
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
  }

  private addMonths(date: Date, months: number): Date {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  }

  private toDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private buildWarrantyCode(vehicle: VehicleRow, now: Date): string {
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = vehicle.frame_no.slice(-6);
    return `WRN-${datePart}-${suffix}`;
  }

  private async findVehicle(client: DirectusClient, dto: CheckWarrantyDto) {
    const frameNo = this.normalize(dto.sokhung);
    const engineNo = this.normalize(dto.somay);
    const rows = await (client as any).request(
      (readItems as any)('klotus_vehicle_registry', {
        fields: [
          'id',
          'frame_no',
          'engine_no',
          'vin',
          'model_code',
          'model_name',
          'warranty_status',
          'delivery_date',
        ],
        filter: {
          _and: [
            { frame_no: { _eq: frameNo } },
            { engine_no: { _eq: engineNo } },
          ],
        },
        limit: 1,
      }),
    );
    return ((rows as VehicleRow[]) ?? [])[0] ?? null;
  }

  private async findActiveWarranty(client: DirectusClient, vehicleId: string) {
    const rows = await (client as any).request(
      (readItems as any)('klotus_warranty_activations', {
        fields: [
          'id',
          'warranty_code',
          'status',
          'activated_date',
          'activated_at',
          'warranty_start_date',
          'warranty_end_date',
        ],
        filter: {
          vehicle_id: { _eq: vehicleId },
          status: { _eq: 'ACTIVE' },
        },
        sort: ['-activated_at'],
        limit: 1,
      }),
    );
    return ((rows as WarrantyRow[]) ?? [])[0] ?? null;
  }

  private async logEvent(
    client: DirectusClient,
    payload: {
      vehicleId?: string | null;
      frameNo: string;
      engineNo: string;
      requestPayload: Record<string, unknown>;
      result: string;
      errorMessage?: string | null;
      ipAddress?: string | null;
      userAgent?: string | null;
    },
  ) {
    await (client as any).request(
      (createItem as any)('klotus_activation_logs', {
        vehicle_id: payload.vehicleId ?? null,
        frame_no_input: payload.frameNo,
        engine_no_input: payload.engineNo,
        request_payload: payload.requestPayload,
        result: payload.result,
        error_message: payload.errorMessage ?? null,
        ip_address: payload.ipAddress ?? null,
        user_agent: payload.userAgent ?? null,
      }),
    );
  }

  async check(
    dto: CheckWarrantyDto,
    meta?: { ip?: string; userAgent?: string },
  ) {
    const client = this.getAdminClient();
    const frameNo = this.normalize(dto.sokhung);
    const engineNo = this.normalize(dto.somay);
    const vehicle = await this.findVehicle(client, dto);
    const requestPayload = this.toPayloadRecord(dto);

    if (!vehicle) {
      await this.logEvent(client, {
        frameNo,
        engineNo,
        requestPayload,
        result: 'CHECK_NOT_FOUND',
        errorMessage: 'Vehicle not found',
        ipAddress: meta?.ip,
        userAgent: meta?.userAgent,
      });
      throw new NotFoundException(
        'Không tìm thấy xe phù hợp với số khung và số máy',
      );
    }

    const activeWarranty = await this.findActiveWarranty(client, vehicle.id);
    await this.logEvent(client, {
      vehicleId: vehicle.id,
      frameNo,
      engineNo,
      requestPayload,
      result: 'CHECK_OK',
      ipAddress: meta?.ip,
      userAgent: meta?.userAgent,
    });

    return {
      found: true,
      vehicle: {
        frame_no: vehicle.frame_no,
        engine_no: vehicle.engine_no,
        vin: vehicle.vin ?? null,
        model_code: vehicle.model_code ?? null,
        model_name: vehicle.model_name ?? null,
        warranty_status: vehicle.warranty_status,
        delivery_date: vehicle.delivery_date ?? null,
      },
      active_warranty: activeWarranty
        ? {
            warranty_code: activeWarranty.warranty_code,
            status: activeWarranty.status,
            activated_date: activeWarranty.activated_date,
            activated_at: activeWarranty.activated_at,
            warranty_start_date: activeWarranty.warranty_start_date,
            warranty_end_date: activeWarranty.warranty_end_date,
          }
        : null,
    };
  }

  async activate(
    dto: ActivateWarrantyDto,
    meta?: { ip?: string; userAgent?: string },
  ) {
    const client = this.getAdminClient();
    const frameNo = this.normalize(dto.sokhung);
    const engineNo = this.normalize(dto.somay);
    const requestPayload = this.toPayloadRecord(dto);
    const vehicle = await this.findVehicle(client, dto);

    if (!vehicle) {
      await this.logEvent(client, {
        frameNo,
        engineNo,
        requestPayload,
        result: 'ACTIVATE_ERROR',
        errorMessage: 'Vehicle not found',
        ipAddress: meta?.ip,
        userAgent: meta?.userAgent,
      });
      throw new NotFoundException(
        'Không tìm thấy xe phù hợp với số khung và số máy',
      );
    }

    const activeWarranty = await this.findActiveWarranty(client, vehicle.id);
    if (activeWarranty) {
      await this.logEvent(client, {
        vehicleId: vehicle.id,
        frameNo,
        engineNo,
        requestPayload,
        result: 'ACTIVATE_DUPLICATE',
        errorMessage: 'Vehicle already has active warranty',
        ipAddress: meta?.ip,
        userAgent: meta?.userAgent,
      });
      throw new BadRequestException('Xe này đã được kích hoạt bảo hành');
    }

    const now = new Date();
    const activatedDate = this.toDateOnly(now);
    const warrantyEndDate = this.toDateOnly(
      this.addMonths(now, this.warrantyDurationMonths()),
    );

    const created = await (client as any).request(
      (createItem as any)('klotus_warranty_activations', {
        vehicle_id: vehicle.id,
        warranty_code: this.buildWarrantyCode(vehicle, now),
        activated_date: activatedDate,
        activated_at: now.toISOString(),
        warranty_start_date: activatedDate,
        warranty_end_date: warrantyEndDate,
        status: 'ACTIVE',
        activation_channel: 'LANDING_PAGE',
        customer_name: dto.customer_name ?? null,
        customer_phone: dto.customer_phone ?? null,
        notes: dto.notes ?? null,
        request_payload: requestPayload,
      }),
    );

    await (client as any).request(
      (updateItem as any)('klotus_vehicle_registry', vehicle.id, {
        warranty_status: 'ACTIVE',
        updated_at: now.toISOString(),
      }),
    );

    await this.logEvent(client, {
      vehicleId: vehicle.id,
      frameNo,
      engineNo,
      requestPayload,
      result: 'ACTIVATE_OK',
      ipAddress: meta?.ip,
      userAgent: meta?.userAgent,
    });

    return {
      message: 'Kích hoạt bảo hành thành công',
      activation: {
        id: created.id,
        warranty_code: created.warranty_code,
        activated_date: created.activated_date,
        activated_at: created.activated_at,
        warranty_start_date: created.warranty_start_date,
        warranty_end_date: created.warranty_end_date,
        status: created.status,
      },
      vehicle: {
        id: vehicle.id,
        frame_no: vehicle.frame_no,
        engine_no: vehicle.engine_no,
        vin: vehicle.vin ?? null,
        warranty_status: 'ACTIVE',
      },
    };
  }
}
