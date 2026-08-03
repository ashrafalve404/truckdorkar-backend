import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCmsContentDto, CreateBannerDto } from './dto/cms.dto';

@Injectable()
export class CmsService {
    constructor(private prisma: PrismaService) { }

    async getContent(key: string) {
        const content = await this.prisma.cmsContent.findUnique({ where: { key } });
        if (key === 'SYSTEM_SETTINGS') {
            const defaultFares = [
                { id: "T1_OPEN_7FT", nameEn: "1 Ton Open 7 Ft Truck", nameBn: "১ টন খোলা ৭ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 7.0, farePerKm: 50, isActive: true },
                { id: "T1_COVER_7FT", nameEn: "1 Ton Cover 7 Ft Truck", nameBn: "১ টন কাভার ৭ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 7.0, farePerKm: 50, isActive: true },
                { id: "T1_OPEN_9FT", nameEn: "1 Ton Open 9 Ft Truck", nameBn: "১ টন খোলা ৯ ফিট ট্রাক", minFare10km: 1200, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 55, isActive: true },
                { id: "T1_COVER_9FT", nameEn: "1 Ton Cover 9 Ft Truck", nameBn: "১ টন কাভার ৯ ফিট ট্রাক", minFare10km: 1200, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 55, isActive: true },
                { id: "T1_5_OPEN_12FT", nameEn: "1.5 Ton Open 12 Ft Truck", nameBn: "১.৫ টন খোলা ১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
                { id: "T1_5_COVER_12FT", nameEn: "1.5 Ton Cover 12 Ft Truck", nameBn: "১.৫ টন কাভার ১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true }
            ];
            const meta = content?.metaJson && typeof content.metaJson === 'object'
                ? { ...(content.metaJson as Record<string, any>) }
                : {};
            const hasLegacyId = Array.isArray(meta.truckFares) && meta.truckFares.some((f: any) =>
                f.id.includes('7_9FT') || f.id.includes('16_14FT') || f.id.includes('10_12FT') || f.nameEn?.includes('7/9') || f.nameEn?.includes('14/16')
            );
            if (!meta.truckFares || !Array.isArray(meta.truckFares) || hasLegacyId) {
                meta.truckFares = defaultFares;
                // Auto update DB so old settings are cleared
                await this.prisma.cmsContent.upsert({
                    where: { key: 'SYSTEM_SETTINGS' },
                    update: { metaJson: meta },
                    create: { key: 'SYSTEM_SETTINGS', metaJson: meta, titleEn: 'System Settings' }
                });
            }
            return {
                message: 'Content fetched',
                data: {
                    id: content?.id,
                    key: 'SYSTEM_SETTINGS',
                    metaJson: meta,
                    titleEn: content?.titleEn || 'System Settings',
                    titleBn: content?.titleBn,
                    updatedAt: content?.updatedAt
                }
            };
        }
        if (!content) {
            // Return empty data instead of 404 so clients can use fallback logic
            return { message: 'Content not found, using defaults', data: { key, metaJson: {} } };
        }
        return { message: 'Content fetched', data: content };
    }

    async updateContent(key: string, dto: UpdateCmsContentDto) {
        const content = await this.prisma.cmsContent.upsert({
            where: { key },
            update: dto,
            create: { key, ...dto },
        });
        return { message: 'Content updated', data: content };
    }

    async getBanners() {
        const banners = await this.prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
        return { message: 'Banners fetched', data: banners };
    }

    async updateBanner(id: string, dto: Partial<CreateBannerDto>) {
        const banner = await this.prisma.banner.update({
            where: { id },
            data: dto,
        });
        return { message: 'Banner updated', data: banner };
    }

    async createBanner(dto: CreateBannerDto) {
        const banner = await this.prisma.banner.create({ data: dto });
        return { message: 'Banner created', data: banner };
    }
}
