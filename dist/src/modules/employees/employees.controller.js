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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const employees_service_1 = require("./employees.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let EmployeesController = class EmployeesController {
    employeesService;
    storageService;
    constructor(employeesService, storageService) {
        this.employeesService = employeesService;
        this.storageService = storageService;
    }
    getDashboard() {
        return this.employeesService.getDashboard();
    }
    findAll() {
        return this.employeesService.findAll();
    }
    async registerTruck(userId, body, files) {
        const [taxTokenUrl, blueBookUrl, numberPlateImageUrl, roadPermitUrl, drivingLicenseUrl] = await Promise.all([
            files.taxTokenFile?.[0] ? this.storageService.save(files.taxTokenFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.blueBookFile?.[0] ? this.storageService.save(files.blueBookFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.numberPlateFile?.[0] ? this.storageService.save(files.numberPlateFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.roadPermitFile?.[0] ? this.storageService.save(files.roadPermitFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.drivingLicenseFile?.[0] ? this.storageService.save(files.drivingLicenseFile[0], 'truck-docs') : Promise.resolve(undefined),
        ]);
        return this.employeesService.registerTruck(userId, {
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
    getMyTrucks(userId) {
        return this.employeesService.getTrucksByEmployee(userId);
    }
    getAdminOverview() {
        return this.employeesService.getAdminOverview();
    }
    getEmployeeTrucks(employeeId) {
        return this.employeesService.getTrucksByEmployeeId(employeeId);
    }
    approveTruck(truckId, status, note) {
        return this.employeesService.approveTruck(truckId, status, note);
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary for employee task dashboard' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] List all employees' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('trucks'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: '[Employee] Register a new truck with documents' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
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
], EmployeesController.prototype, "registerTruck", null);
__decorate([
    (0, common_1.Get)('trucks'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: '[Employee] List trucks registered by this employee' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "getMyTrucks", null);
__decorate([
    (0, common_1.Get)('admin/overview'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all employees with their truck counts and info' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "getAdminOverview", null);
__decorate([
    (0, common_1.Get)('admin/:employeeId/trucks'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all trucks registered by a specific employee' }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "getEmployeeTrucks", null);
__decorate([
    (0, common_1.Patch)('admin/trucks/:truckId/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Approve or reject a truck submitted by an employee' }),
    __param(0, (0, common_1.Param)('truckId')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], EmployeesController.prototype, "approveTruck", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, swagger_1.ApiTags)('employees'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'employees', version: '1' }),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService,
        storage_service_1.StorageService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map