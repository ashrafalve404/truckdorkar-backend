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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const contact_service_1 = require("./contact.service");
const contact_dto_1 = require("./dto/contact.dto");
const client_1 = require("@prisma/client");
let ContactController = class ContactController {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    submit(dto) {
        return this.contactService.submit(dto);
    }
    findAll(page, limit) {
        return this.contactService.findAll(page, limit);
    }
    markAsRead(id) {
        return this.contactService.markAsRead(id);
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit contact inquiry (public)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] List all inquiries' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.AGENT),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Mark inquiry as read' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "markAsRead", null);
exports.ContactController = ContactController = __decorate([
    (0, swagger_1.ApiTags)('contact'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)({ path: 'contact', version: '1' }),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map