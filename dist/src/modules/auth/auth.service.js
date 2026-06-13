"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        const { name, email, phone, password, role, licenseNumber, experience, companyName, agentId, nidNumber, dateOfBirth } = dto;
        if (email) {
            const emailExists = await this.prisma.user.findUnique({ where: { email } });
            if (emailExists)
                throw new common_1.ConflictException('Email already registered');
        }
        const phoneExists = await this.prisma.user.findUnique({ where: { phone } });
        if (phoneExists)
            throw new common_1.ConflictException('Phone number already registered');
        const safeRole = role === client_1.Role.ADMIN ? client_1.Role.USER : (role ?? client_1.Role.USER);
        const hashed = await bcrypt.hash(password, 12);
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashed,
                role: safeRole,
                ...(safeRole === client_1.Role.DRIVER && {
                    driver: {
                        create: {
                            licenseNumber,
                            experience: experience ? Number(experience) : undefined,
                        }
                    },
                }),
                ...(safeRole === client_1.Role.AGENT && {
                    agent: {
                        create: {
                            agentId,
                            nidNumber,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                            designation: 'Staff',
                            department: companyName || 'Operations',
                        }
                    },
                }),
            },
            select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.phone, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { message: 'Registration successful', data: { user, ...tokens } };
    }
    async login(dto) {
        const { identifier, password } = dto;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }],
                isActive: true,
            },
        });
        if (!user || !user.password)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.generateTokens(user.id, user.email, user.phone, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { password: _, refreshToken: __, resetToken: ___, ...safeUser } = user;
        return { message: 'Login successful', data: { user: safeUser, ...tokens } };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.refreshToken)
            throw new common_1.UnauthorizedException('Access denied');
        const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!rtMatches)
            throw new common_1.UnauthorizedException('Access denied');
        const tokens = await this.generateTokens(user.id, user.email, user.phone, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { message: 'Tokens refreshed', data: tokens };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            return { message: 'If the email exists, a reset link has been sent.' };
        const token = (0, uuid_1.v4)();
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetToken: token, resetTokenExpiry: expiry },
        });
        return { message: 'If the email exists, a reset link has been sent.' };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: dto.token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user)
            throw new common_1.BadRequestException('Invalid or expired reset token');
        const hashed = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpiry: null,
                refreshToken: null,
            },
        });
        return { message: 'Password reset successful. Please login again.' };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.password)
            throw new common_1.NotFoundException('User not found');
        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid)
            throw new common_1.BadRequestException('Current password is incorrect');
        const hashed = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed, refreshToken: null },
        });
        return { message: 'Password changed. Please login again.' };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                createdAt: true,
                driver: {
                    select: { id: true, status: true, rating: true, totalTrips: true, isAvailable: true },
                },
                agent: { select: { id: true, agentId: true, department: true, designation: true } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return { message: 'Profile fetched', data: user };
    }
    async generateTokens(userId, email, phone, role) {
        const payload = { sub: userId, email, phone, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_ACCESS_SECRET'),
                expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashed = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashed },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map