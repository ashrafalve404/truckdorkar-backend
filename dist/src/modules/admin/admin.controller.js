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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const admin_service_1 = require("./admin.service");
const client_1 = require("@prisma/client");
const admin_dto_1 = require("./dto/admin.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getStats() {
        return this.adminService.getDashboardStats();
    }
    getAllUsers(page, limit) {
        return this.adminService.getAllUsers(page, limit);
    }
    createUser(dto) {
        return this.adminService.createUser(dto);
    }
    toggleUser(id, isActive) {
        return this.adminService.toggleUserStatus(id, isActive);
    }
    getAllBookings(page, limit) {
        return this.adminService.getAllBookings(page, limit);
    }
    getAllDrivers(page, limit) {
        return this.adminService.getAllDrivers(page, limit);
    }
    getReferralAnalytics(page, limit, search) {
        return this.adminService.getReferralAnalytics(page ? Number(page) : 1, limit ? Number(limit) : 20, search);
    }
    verifyDriver(id, status, note) {
        return this.adminService.verifyDriver(id, status, note);
    }
    getAllTrucks(page, limit, status) {
        return this.adminService.getAllTrucks(page, limit, status);
    }
    getSettings() {
        return this.adminService.getSettings();
    }
    updateSettings(dto) {
        return this.adminService.updateSettings(dto);
    }
    deleteUser(id) {
        return this.adminService.deleteUser(id);
    }
    deleteDriver(id) {
        return this.adminService.deleteDriver(id);
    }
    deleteTruck(id) {
        return this.adminService.deleteTruck(id);
    }
    deleteAgent(id) {
        return this.adminService.deleteAgent(id);
    }
    getPendingPayments() {
        return this.adminService.getPendingCommissionPayments();
    }
    approvePayment(id, note) {
        return this.adminService.approveCommissionPayment(id, note);
    }
    rejectPayment(id, note) {
        return this.adminService.rejectCommissionPayment(id, note);
    }
    createAdmin(dto) {
        return this.adminService.createAdmin(dto);
    }
    changePassword(adminId, dto) {
        return this.adminService.changeAdminPassword(adminId, dto);
    }
    getAgentWithdrawals(status) {
        return this.adminService.getAgentWithdrawals(status);
    }
    approveAgentWithdrawal(id, adminNote) {
        return this.adminService.approveAgentWithdrawal(id, adminNote);
    }
    rejectAgentWithdrawal(id, adminNote) {
        return this.adminService.rejectAgentWithdrawal(id, adminNote);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get high-level dashboard statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List all users in the system' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user directly from Admin Panel (No OTP required)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateUserByAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate or deactivate a user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleUser", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'List all bookings in the system' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Get)('drivers'),
    (0, swagger_1.ApiOperation)({ summary: 'List all drivers in the system' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllDrivers", null);
__decorate([
    (0, common_1.Get)('referrals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get platform-wide driver referral analytics & 5% payout logs' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getReferralAnalytics", null);
__decorate([
    (0, common_1.Patch)('drivers/:id/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify or reject a driver' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyDriver", null);
__decorate([
    (0, common_1.Get)('trucks'),
    (0, swagger_1.ApiOperation)({ summary: 'List all trucks in the system' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllTrucks", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system settings' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update system settings' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.UpdateSettingsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete a user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Delete)('drivers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete a driver' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteDriver", null);
__decorate([
    (0, common_1.Delete)('trucks/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete a truck' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteTruck", null);
__decorate([
    (0, common_1.Delete)('agents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete an agent' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteAgent", null);
__decorate([
    (0, common_1.Get)('commission-payments'),
    (0, swagger_1.ApiOperation)({ summary: 'List all pending commission payments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingPayments", null);
__decorate([
    (0, common_1.Patch)('commission-payments/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a commission payment' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('adminNote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approvePayment", null);
__decorate([
    (0, common_1.Patch)('commission-payments/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a commission payment' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('adminNote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectPayment", null);
__decorate([
    (0, common_1.Post)('create-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new admin user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change password for currently logged-in admin' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.AdminChangePasswordDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('agent-withdrawals'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Get all agent money withdrawal requests' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAgentWithdrawals", null);
__decorate([
    (0, common_1.Patch)('agent-withdrawals/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Approve agent money withdrawal request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('adminNote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveAgentWithdrawal", null);
__decorate([
    (0, common_1.Patch)('agent-withdrawals/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: '[Admin] Reject agent money withdrawal request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('adminNote')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectAgentWithdrawal", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Controller)({ path: 'admin', version: '1' }),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map