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
        if (!content)
            throw new common_1.NotFoundException('Content not found');
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