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
exports.AgentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const agents_service_1 = require("./agents.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let AgentsController = class AgentsController {
    agentsService;
    storageService;
    constructor(agentsService, storageService) {
        this.agentsService = agentsService;
        this.storageService = storageService;
    }
    getDashboard(userId) {
        return this.agentsService.getDashboard(userId);
    }
    findAll() {
        return this.agentsService.findAll();
    }
    async registerTruck(userId, body, files) {
        const [taxTokenUrl, blueBookUrl, numberPlateImageUrl, roadPermitUrl, drivingLicenseUrl] = await Promise.all([
            files.taxTokenFile?.[0] ? this.storageService.save(files.taxTokenFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.blueBookFile?.[0] ? this.storageService.save(files.blueBookFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.numberPlateFile?.[0] ? this.storageService.save(files.numberPlateFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.roadPermitFile?.[0] ? this.storageService.save(files.roadPermitFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.drivingLicenseFile?.[0] ? this.storageService.save(files.drivingLicenseFile[0], 'truck-docs') : Promise.resolve(undefined),
        ]);
        return this.agentsService.registerTruck(userId, {
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
        return this.agentsService.getAgentTrucks(userId);
    }
    getEarnings(userId) {
        return this.agentsService.getAgentEarnings(userId);
    }
    getAdminOverview() {
        return this.agentsService.getAdminOverview();
    }
    getAgentTrucks(agentId) {
        return this.agentsService.getTrucksByAgentId(agentId);
    }
    approveTruck(truckId, status, note) {
        return this.agentsService.approveTruck(truckId, status, note);
    }
    remove(agentId) {
        return this.agentsService.remove(agentId);
    }
    getProfile(userId) {
        return this.agentsService.getAgentProfile(userId);
    }
    async uploadNid(userId, nidNumber, files) {
        const [nidFrontUrl, nidBackUrl] = await Promise.all([
            files.nidFront?.[0] ? this.storageService.save(files.nidFront[0], 'agent-docs') : Promise.resolve(undefined),
            files.nidBack?.[0] ? this.storageService.save(files.nidBack[0], 'agent-docs') : Promise.resolve(undefined),
        ]);
        return this.agentsService.updateNid(userId, {
            nidNumber,
            nidFrontUrl: nidFrontUrl || '',
            nidBackUrl: nidBackUrl || ''
        });
    }
    verifyAgent(agentId, status) {
        return this.agentsService.verifyAgent(agentId, status);
    }
    createAgent(body) {
        return this.agentsService.createAgent(body);
    }
};
exports.AgentsController = AgentsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary for agent task dashboard' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] List all agents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('trucks'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Agent] Register a new truck with documents' }),
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
], AgentsController.prototype, "registerTruck", null);
__decorate([
    (0, common_1.Get)('trucks'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Agent] List trucks registered by this agent' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "getMyTrucks", null);
__decorate([
    (0, common_1.Get)('earnings'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Agent] View earnings and commissions from completed trips' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "getEarnings", null);
__decorate([
    (0, common_1.Get)('admin/overview'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all agents with their truck counts and info' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "getAdminOverview", null);
__decorate([
    (0, common_1.Get)('admin/:agentId/trucks'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all trucks registered by a specific agent' }),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "getAgentTrucks", null);
__decorate([
    (0, common_1.Patch)('admin/trucks/:truckId/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Approve or reject a truck submitted by an agent' }),
    __param(0, (0, common_1.Param)('truckId')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "approveTruck", null);
__decorate([
    (0, common_1.Delete)(':agentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Remove an agent' }),
    __param(0, (0, common_1.Param)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Agent] Get agent profile including verification status' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('profile/nid'),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Agent] Upload NID images for verification' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'nidFront', maxCount: 1 },
        { name: 'nidBack', maxCount: 1 },
    ])),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)('nidNumber')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AgentsController.prototype, "uploadNid", null);
__decorate([
    (0, common_1.Patch)('admin/:agentId/verify'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Approve or Reject agent NID verification' }),
    __param(0, (0, common_1.Param)('agentId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "verifyAgent", null);
__decorate([
    (0, common_1.Post)('admin/register'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Register a new agent manually' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgentsController.prototype, "createAgent", null);
exports.AgentsController = AgentsController = __decorate([
    (0, swagger_1.ApiTags)('agents'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'agents', version: '1' }),
    __metadata("design:paramtypes", [agents_service_1.AgentsService,
        storage_service_1.StorageService])
], AgentsController);
//# sourceMappingURL=agents.controller.js.map