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
exports.SupportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const support_service_1 = require("./support.service");
const support_dto_1 = require("./dto/support.dto");
const client_1 = require("@prisma/client");
let SupportController = class SupportController {
    supportService;
    constructor(supportService) {
        this.supportService = supportService;
    }
    create(userId, dto) {
        return this.supportService.createTicket(userId, dto);
    }
    findAll(user) {
        return this.supportService.findAll(user.id, user.role);
    }
    findOne(id, user) {
        return this.supportService.findOne(id, user.id, user.role);
    }
    reply(id, userId, dto) {
        return this.supportService.reply(id, userId, dto);
    }
    updateStatus(id, status) {
        return this.supportService.updateStatus(id, status);
    }
};
exports.SupportController = SupportController;
__decorate([
    (0, common_1.Post)('tickets'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new support ticket' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_dto_1.CreateTicketDto]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('tickets'),
    (0, swagger_1.ApiOperation)({ summary: 'List tickets (filtered by role)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ticket details and conversation' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('tickets/:id/replies'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a reply to a ticket' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, support_dto_1.CreateReplyDto]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "reply", null);
__decorate([
    (0, common_1.Patch)('tickets/:id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Update ticket status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SupportController.prototype, "updateStatus", null);
exports.SupportController = SupportController = __decorate([
    (0, swagger_1.ApiTags)('support'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'support', version: '1' }),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportController);
//# sourceMappingURL=support.controller.js.map