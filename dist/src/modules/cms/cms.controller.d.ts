import { CmsService } from './cms.service';
import { UpdateCmsContentDto, CreateBannerDto } from './dto/cms.dto';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    getContent(key: string): Promise<{
        message: string;
        data: {
            id: string | undefined;
            key: string;
            metaJson: {
                [x: string]: any;
            };
            titleEn: string;
            titleBn: string | null | undefined;
            updatedAt: Date | undefined;
        };
    } | {
        message: string;
        data: {
            key: string;
            metaJson: {};
            id?: undefined;
            titleEn?: undefined;
            titleBn?: undefined;
            updatedAt?: undefined;
        };
    } | {
        message: string;
        data: {
            id: string;
            updatedAt: Date;
            key: string;
            titleEn: string | null;
            titleBn: string | null;
            bodyEn: string | null;
            bodyBn: string | null;
            metaJson: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    updateContent(key: string, dto: UpdateCmsContentDto): Promise<{
        message: string;
        data: {
            id: string;
            updatedAt: Date;
            key: string;
            titleEn: string | null;
            titleBn: string | null;
            bodyEn: string | null;
            bodyBn: string | null;
            metaJson: import("@prisma/client/runtime/library").JsonValue | null;
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
}
