"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CmsService = class CmsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getContent(key) {
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
                ? { ...content.metaJson }
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
            return { message: 'Content not found, using defaults', data: { key, metaJson: {} } };
        }
        return { message: 'Content fetched', data: content };
    }
    async updateContent(key, dto) {
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
    async updateBanner(id, dto) {
        const banner = await this.prisma.banner.update({
            where: { id },
            data: dto,
        });
        return { message: 'Banner updated', data: banner };
    }
    async createBanner(dto) {
        const banner = await this.prisma.banner.create({ data: dto });
        return { message: 'Banner created', data: banner };
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CmsService);
//# sourceMappingURL=cms.service.js.map