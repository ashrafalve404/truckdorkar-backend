import { CmsService } from './cms.service';
import { UpdateCmsContentDto, CreateBannerDto } from './dto/cms.dto';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            titleEn: string;
            titleBn: string | null;
            imageUrl: string;
            linkUrl: string | null;
            sortOrder: number;
        }[];
    }>;
    createBanner(dto: CreateBannerDto): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            titleEn: string;
            titleBn: string | null;
            imageUrl: string;
            linkUrl: string | null;
            sortOrder: number;
        };
    }>;
    updateBanner(id: string, dto: Partial<CreateBannerDto>): Promise<{
        message: string;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            titleEn: string;
            titleBn: string | null;
            imageUrl: string;
            linkUrl: string | null;
            sortOrder: number;
        };
    }>;
}
