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
exports.DriversController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const drivers_service_1 = require("./drivers.service");
const driver_dto_1 = require("./dto/driver.dto");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let DriversController = class DriversController {
    driversService;
    storageService;
    constructor(driversService, storageService) {
        this.driversService = driversService;
        this.storageService = storageService;
    }
    getProfile(userId) {
        return this.driversService.getProfile(userId);
    }
    updateProfile(userId, dto) {
        return this.driversService.updateProfile(userId, dto);
    }
    async uploadDocument(userId, file, type) {
        const url = await this.storageService.save(file, 'documents');
        return this.driversService.uploadDocument(userId, type, url);
    }
    setAvailability(userId, dto) {
        return this.driversService.setAvailability(userId, dto.isAvailable, dto.lat, dto.lng);
    }
    getEarnings(userId) {
        return this.driversService.getEarnings(userId);
    }
    getBookings(userId) {
        return this.driversService.getDriverBookings(userId);
    }
    getMyCommissionPayments(userId) {
        return this.driversService.getMyCommissionPayments(userId);
    }
    submitCommissionPayment(userId, dto) {
        return this.driversService.submitCommissionPayment(userId, dto.amount, dto.transactionId);
    }
    findAll(query) {
        return this.driversService.findAll(query);
    }
    verify(id, dto) {
        return this.driversService.verifyDriver(id, dto.status, dto.note);
    }
};
exports.DriversController = DriversController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: "Get driver's own profile" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, driver_dto_1.UpdateDriverProfileDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('documents'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Upload driver document (nid_front/nid_back/license_front/license_back)' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Patch)('availability'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Set online/offline availability' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, driver_dto_1.SetAvailabilityDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "setAvailability", null);
__decorate([
    (0, common_1.Get)('earnings'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Get earnings summary' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getEarnings", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: "Get driver's bookings" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('commission-payments'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Get driver commission payment history and balance' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getMyCommissionPayments", null);
__decorate([
    (0, common_1.Post)('commission-payments'),
    (0, roles_decorator_1.Roles)(client_1.Role.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a commission payment for approval' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "submitCommissionPayment", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] List all drivers' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/verify'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Verify or reject a driver' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, driver_dto_1.VerifyDriverDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "verify", null);
exports.DriversController = DriversController = __decorate([
    (0, swagger_1.ApiTags)('drivers'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'drivers', version: '1' }),
    __metadata("design:paramtypes", [drivers_service_1.DriversService,
        storage_service_1.StorageService])
], DriversController);
//# sourceMappingURL=drivers.controller.js.map