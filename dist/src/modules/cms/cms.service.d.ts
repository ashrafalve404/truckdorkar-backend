import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCmsContentDto, CreateBannerDto } from './dto/cms.dto';
export declare class CmsService {
    private prisma;
    constructor(prisma: PrismaService);
    getContent(key: string): Promise<{
        message: string;
        data: {
            id: string;
            updatedAt: Date;
            titleEn: string | null;
            titleBn: string | null;
            bodyEn: string | null;
            bodyBn: string | null;
            metaJson: import("@prisma/client/runtime/library").JsonValue | null;
            key: string;
        };
    }>;
    updateContent(key: string, dto: UpdateCmsContentDto): Promise<{
        message: string;
        data: {
            id: string;
            updatedAt: Date;
            titleEn: string | null;
            titleBn: string | null;
            bodyEn: string | null;
            bodyBn: string | null;
            metaJson: import("@prisma/client/runtime/library").JsonValue | null;
            key: string;
        };
    }>;
    getBanners(): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            titleEn: string;
            titleBn: string | null;
            imageUrl: string;
            linkUrl: string | null;
            sortOrder: number;
        }[];
    }>;
    updateBanner(id: string, dto: Partial<CreateBannerDto>): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            titleEn: string;
            titleBn: string | null;
            imageUrl: string;
            linkUrl: string | null;
            sortOrder: number;
        };
    }>;
    createBanner(dto: CreateBannerDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            titleEn: string;
            titleBn: string | null;
            imageUrl: string;
            linkUrl: string | null;
            sortOrder: number;
        };
    }>;
}
