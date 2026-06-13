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
exports.TrucksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const trucks_service_1 = require("./trucks.service");
const truck_dto_1 = require("./dto/truck.dto");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let TrucksController = class TrucksController {
    trucksService;
    storageService;
    constructor(trucksService, storageService) {
        this.trucksService = trucksService;
        this.storageService = storageService;
    }
    findAll(query) {
        return this.trucksService.findAll(query);
    }
    getMyTrucks(userId) {
        return this.trucksService.findMyTrucks(userId);
    }
    findOne(id) {
        return this.trucksService.findOne(id);
    }
    async create(userId, body, files) {
        const [taxTokenUrl, blueBookUrl, numberPlateImageUrl, roadPermitUrl, drivingLicenseUrl] = await Promise.all([
            files.taxTokenFile?.[0] ? this.storageService.save(files.taxTokenFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.blueBookFile?.[0] ? this.storageService.save(files.blueBookFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.numberPlateFile?.[0] ? this.storageService.save(files.numberPlateFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.roadPermitFile?.[0] ? this.storageService.save(files.roadPermitFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.drivingLicenseFile?.[0] ? this.storageService.save(files.drivingLicenseFile[0], 'truck-docs') : Promise.resolve(undefined),
        ]);
        return this.trucksService.create(userId, {
            ...body,
            capacityTon: Number(body.capacityTon),
            lengthFt: Number(body.lengthFt),
            year: body.year ? Number(body.year) : undefined,
            taxTokenUrl,
            blueBookUrl,
            numberPlateImageUrl,
            roadPermitUrl,
            drivingLicenseUrl,
        });
    }
    update(id, user, dto) {
        return this.trucksService.update(id, user.id, user.role, dto);
    }
    remove(id, user) {
        return this.trucksService.remove(id, user.id, user.role);
    }
    async addImage(truckId, userId, file, isPrimary) {
        const url = await this.storageService.save(file, 'trucks');
        return this.trucksService.addImage(truckId, userId, url, isPrimary === 'true');
    }
    approve(id, dto) {
        return this.trucksService.approveTruck(id, dto.status, dto.note);
    }
};
exports.TrucksController = TrucksController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List available trucks (public)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: '[Driver] Get my registered trucks' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "getMyTrucks", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get truck details (public)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: '[Driver] Add a truck with documents' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'taxTokenFile', maxCount: 1 },
        { name: 'blueBookFile', maxCount: 1 },
        { name: 'numberPlateFile', maxCount: 1 },
        { name: 'roadPermitFile', maxCount: 1 },
        { name: 'drivingLicenseFile', maxCount: 1 },
    ])),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TrucksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Driver/Admin] Update truck info' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, truck_dto_1.UpdateTruckDto]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Driver/Admin] Soft-delete truck' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: '[Driver] Upload truck image' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)('isPrimary')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Promise)
], TrucksController.prototype, "addImage", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Approve or reject a truck' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, truck_dto_1.ApproveTruckDto]),
    __metadata("design:returntype", void 0)
], TrucksController.prototype, "approve", null);
exports.TrucksController = TrucksController = __decorate([
    (0, swagger_1.ApiTags)('trucks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'trucks', version: '1' }),
    __metadata("design:paramtypes", [trucks_service_1.TrucksService, storage_service_1.StorageService])
], TrucksController);
//# sourceMappingURL=trucks.controller.js.map