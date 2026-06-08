import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCmsContentDto, CreateBannerDto } from './dto/cms.dto';

@Injectable()
export class CmsService {
    constructor(private prisma: PrismaService) { }

    async getContent(key: string) {
        const content = await this.prisma.cmsContent.findUnique({ where: { key } });
        if (!content) throw new NotFoundException('Content not found');
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
