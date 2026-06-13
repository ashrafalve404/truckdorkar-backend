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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true, avatar: true,
                role: true, isEmailVerified: true, isPhoneVerified: true, createdAt: true,
                driver: true, agent: true, addresses: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { message: 'Profile fetched', data: user };
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: { id: true, name: true, email: true, phone: true, avatar: true, role: true },
        });
        return { message: 'Profile updated', data: user };
    }
    async updateAvatar(userId, avatarUrl) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarUrl },
            select: { id: true, avatar: true },
        });
        return { message: 'Avatar updated', data: user };
    }
    async getAddresses(userId) {
        const addresses = await this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
        return { message: 'Addresses fetched', data: addresses };
    }
    async createAddress(userId, dto) {
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        const address = await this.prisma.address.create({ data: { ...dto, userId } });
        return { message: 'Address created', data: address };
    }
    async updateAddress(userId, addressId, dto) {
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        if (dto.isDefault) {
            await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
        }
        const updated = await this.prisma.address.update({ where: { id: addressId }, data: dto });
        return { message: 'Address updated', data: updated };
    }
    async deleteAddress(userId, addressId) {
        const address = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        await this.prisma.address.delete({ where: { id: addressId } });
        return { message: 'Address deleted' };
    }
    async getActivityHistory(userId) {
        const logs = await this.prisma.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return { message: 'Activity fetched', data: logs };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map