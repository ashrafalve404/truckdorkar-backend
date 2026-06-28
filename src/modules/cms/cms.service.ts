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
                { id: "T1_OPEN_7_9FT", nameEn: "1 Ton Open 7/9 Ft Truck", nameBn: "১ টন খোলা ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
                { id: "T1_COVER_7_9FT", nameEn: "1 Ton Cover 7/9 Ft Truck", nameBn: "১ টন কাভার ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
                { id: "T1_5_OPEN_10_12FT", nameEn: "1.5 Ton Open 10/12 Ft Truck", nameBn: "১.৫ টন খোলা ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
                { id: "T1_5_COVER_10_12FT", nameEn: "1.5 Ton Cover 10/12 Ft Truck", nameBn: "১.৫ টন কাভার ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
                { id: "T3_OPEN_16_14FT", nameEn: "3 Ton Open 14/16 Ft Truck", nameBn: "৩ টন খোলা ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true },
                { id: "T3_COVER_16_14FT", nameEn: "3 Ton Cover 14/16 Ft Truck", nameBn: "৩ টন কাভার ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true }
            ];
            const meta = content?.metaJson && typeof content.metaJson === 'object'
                ? { ...(content.metaJson as Record<string, any>) }
                : {};
            if (!meta.truckFares || !Array.isArray(meta.truckFares)) {
                meta.truckFares = defaultFares;
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
