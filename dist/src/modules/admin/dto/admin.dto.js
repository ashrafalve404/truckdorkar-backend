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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserByAdminDto = exports.AdminChangePasswordDto = exports.CreateAdminDto = exports.UpdateSettingsDto = exports.TruckFareDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class TruckFareDto {
    id;
    nameEn;
    nameBn;
    minFare10km;
    capacityTon;
    lengthFt;
    farePerKm;
    isActive;
}
exports.TruckFareDto = TruckFareDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TruckFareDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TruckFareDto.prototype, "nameEn", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TruckFareDto.prototype, "nameBn", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TruckFareDto.prototype, "minFare10km", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TruckFareDto.prototype, "capacityTon", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TruckFareDto.prototype, "lengthFt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TruckFareDto.prototype, "farePerKm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TruckFareDto.prototype, "isActive", void 0);
class UpdateSettingsDto {
    platformName;
    adminEmail;
    baseFarePerKm;
    truckFares;
}
exports.UpdateSettingsDto = UpdateSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TruckDorkar' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "platformName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@truckdorkar.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "adminEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSettingsDto.prototype, "baseFarePerKm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TruckFareDto], description: 'Dynamic truck fare tiers' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TruckFareDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingsDto.prototype, "truckFares", void 0);
class CreateAdminDto {
    name;
    phone;
    email;
    password;
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin Name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '01700000000' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'newadmin@truckdorkar.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
class AdminChangePasswordDto {
    currentPassword;
    newPassword;
}
exports.AdminChangePasswordDto = AdminChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'oldpassword123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'newpassword123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminChangePasswordDto.prototype, "newPassword", void 0);
class CreateUserByAdminDto {
    name;
    phone;
    email;
    password;
    role;
}
exports.CreateUserByAdminDto = CreateUserByAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rahim Uddin' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserByAdminDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '01826110036' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserByAdminDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserByAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserByAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USER', description: 'USER, DRIVER, AGENT, ADMIN' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserByAdminDto.prototype, "role", void 0);
//# sourceMappingURL=admin.dto.js.map