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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const cms_service_1 = require("./cms.service");
const storage_service_1 = require("../storage/storage.service");
const cms_dto_1 = require("./dto/cms.dto");
const client_1 = require("@prisma/client");
let CmsController = class CmsController {
    cmsService;
    storageService;
    constructor(cmsService, storageService) {
        this.cmsService = cmsService;
        this.storageService = storageService;
    }
    getContent(key) {
        return this.cmsService.getContent(key);
    }
    updateContent(key, dto) {
        return this.cmsService.updateContent(key, dto);
    }
    getBanners() {
        return this.cmsService.getBanners();
    }
    getAllBannersAdmin() {
        return this.cmsService.getAllBannersAdmin();
    }
    getAllBannersAll() {
        return this.cmsService.getAllBannersAdmin();
    }
    async uploadBannerImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Please select an image file to upload.');
        }
        const url = await this.storageService.save(file, 'banners');
        return { message: 'Image uploaded successfully', url };
    }
    createBanner(dto) {
        return this.cmsService.createBanner(dto);
    }
    updateBanner(id, dto) {
        return this.cmsService.updateBanner(id, dto);
    }
    deleteBanner(id) {
        return this.cmsService.deleteBanner(id);
    }
};
exports.CmsController = CmsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('content/:key'),
    (0, swagger_1.ApiOperation)({ summary: 'Get CMS content by key (public)' }),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getContent", null);
__decorate([
    (0, common_1.Patch)('content/:key'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update CMS content' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cms_dto_1.UpdateCmsContentDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateContent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('banners'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active banners (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getBanners", null);
__decorate([
    (0, common_1.Get)('banners/admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all banners' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAllBannersAdmin", null);
__decorate([
    (0, common_1.Get)('banners/all'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all banners (alias)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAllBannersAll", null);
__decorate([
    (0, common_1.Post)('banners/upload'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Upload banner image' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "uploadBannerImage", null);
__decorate([
    (0, common_1.Post)('banners'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Create a banner' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cms_dto_1.CreateBannerDto]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "createBanner", null);
__decorate([
    (0, common_1.Patch)('banners/:id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update a banner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "updateBanner", null);
__decorate([
    (0, common_1.Delete)('banners/:id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Delete a banner' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "deleteBanner", null);
exports.CmsController = CmsController = __decorate([
    (0, swagger_1.ApiTags)('cms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'cms', version: '1' }),
    __metadata("design:paramtypes", [cms_service_1.CmsService,
        storage_service_1.StorageService])
], CmsController);
//# sourceMappingURL=cms.controller.js.map