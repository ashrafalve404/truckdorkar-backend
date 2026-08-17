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
const google_auth_library_1 = require("google-auth-library");
const sms_service_1 = require("../sms/sms.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    config;
    smsService;
    googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    constructor(prisma, jwtService, config, smsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.smsService = smsService;
    }
    async onModuleInit() {
        try {
            await this.prisma.user.updateMany({
                where: { isPhoneVerified: false },
                data: { isPhoneVerified: true }
            });
        }
        catch (e) {
            console.error('AuthService onModuleInit warning:', e);
        }
    }
    generateAgentId() {
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TDL-AGENT-${random}-${Date.now().toString().slice(-4)}`;
    }
    async register(dto) {
        const { name, email, phone, password, role, licenseNumber, experience, referralCode } = dto;
        if (email && email.trim() !== '') {
            const emailExists = await this.prisma.user.findUnique({ where: { email } });
            if (emailExists)
                throw new common_1.ConflictException('Email is already registered.');
        }
        const phoneExists = await this.prisma.user.findUnique({ where: { phone } });
        if (phoneExists)
            throw new common_1.ConflictException('Phone number is already registered.');
        const safeRole = (role === client_1.Role.ADMIN || role === client_1.Role.AGENT) ? client_1.Role.USER : (role ?? client_1.Role.USER);
        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const signupToken = this.jwtService.sign({
            name,
            email: (email && email.trim() !== '') ? email : null,
            phone,
            hashedPassword,
            role: safeRole,
            licenseNumber,
            experience: experience ? Number(experience) : undefined,
            referralCode,
            otp,
        }, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: '10m',
        });
        await this.smsService.sendOtp(phone, otp);
        return {
            message: 'OTP sent to your phone number. Please enter the OTP to complete registration.',
            data: { requiresOtp: true, phone, role: safeRole, signupToken }
        };
    }
    async verifyPhoneOtp(dto) {
        let payload;
        if (dto.signupToken) {
            try {
                payload = await this.jwtService.verifyAsync(dto.signupToken, {
                    secret: this.config.get('JWT_ACCESS_SECRET'),
                });
            }
            catch (e) {
                throw new common_1.BadRequestException('Registration session expired. Please register again.');
            }
        }
        if (!payload || payload.otp !== dto.otp) {
            const existingUser = await this.prisma.user.findFirst({ where: { phone: dto.phone } });
            if (existingUser && !existingUser.isPhoneVerified && existingUser.phoneOtp === dto.otp && existingUser.phoneOtpExpiry && existingUser.phoneOtpExpiry > new Date()) {
                const updatedUser = await this.prisma.user.update({
                    where: { id: existingUser.id },
                    data: { isPhoneVerified: true, phoneOtp: null, phoneOtpExpiry: null },
                    select: { id: true, name: true, email: true, phone: true, role: true, isPhoneVerified: true }
                });
                const tokens = await this.generateTokens(updatedUser.id, updatedUser.email || '', updatedUser.phone || '', updatedUser.role);
                await this.updateRefreshToken(updatedUser.id, tokens.refreshToken);
                return { message: 'Phone number verified successfully.', data: { user: updatedUser, ...tokens } };
            }
            throw new common_1.BadRequestException('Invalid OTP code. Please check and try again.');
        }
        const phoneExists = await this.prisma.user.findUnique({ where: { phone: payload.phone } });
        if (phoneExists)
            throw new common_1.ConflictException('Phone number is already registered.');
        let referredById = undefined;
        if (payload.role === client_1.Role.DRIVER && payload.referralCode) {
            const referrer = await this.prisma.driver.findFirst({
                where: { referralCode: payload.referralCode.trim().toUpperCase() }
            });
            if (referrer) {
                referredById = referrer.id;
            }
        }
        let newDriverReferralCode = undefined;
        if (payload.role === client_1.Role.DRIVER) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let randomStr = '';
            for (let i = 0; i < 6; i++) {
                randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            newDriverReferralCode = `DRV-${randomStr}`;
        }
        const user = await this.prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                password: payload.hashedPassword,
                role: payload.role,
                isPhoneVerified: true,
                isActive: true,
                ...(payload.role === client_1.Role.DRIVER && {
                    driver: {
                        create: {
                            licenseNumber: payload.licenseNumber,
                            experience: payload.experience,
                            referralCode: newDriverReferralCode,
                            referredById,
                        }
                    }
                })
            },
            select: { id: true, name: true, email: true, phone: true, role: true, isPhoneVerified: true }
        });
        const admins = await this.prisma.user.findMany({ where: { role: client_1.Role.ADMIN } });
        await Promise.all(admins.map(admin => this.prisma.notification.create({
            data: {
                userId: admin.id,
                type: 'SYSTEM',
                title: `New Verified ${user.role === 'DRIVER' ? 'Driver' : 'User'} Registered`,
                body: `A new ${user.role.toLowerCase()} ${user.name || user.phone} has registered and verified phone number.`,
                data: {
                    userId: user.id,
                    role: user.role,
                }
            }
        })));
        const tokens = await this.generateTokens(user.id, user.email || '', user.phone || '', user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return {
            message: 'Phone number verified successfully. Welcome to TruckDorkar!',
            data: { user, ...tokens }
        };
    }
    async resendPhoneOtp(dto) {
        if (dto.signupToken) {
            try {
                const payload = this.jwtService.decode(dto.signupToken);
                if (payload && payload.phone) {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const newSignupToken = this.jwtService.sign({ ...payload, otp: newOtp }, { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: '10m' });
                    await this.smsService.sendOtp(payload.phone, newOtp);
                    return {
                        message: 'New OTP sent to your phone number.',
                        data: { signupToken: newSignupToken, phone: payload.phone }
                    };
                }
            }
            catch (e) { }
        }
        const user = await this.prisma.user.findFirst({ where: { phone: dto.phone } });
        if (user && !user.isPhoneVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await this.prisma.user.update({
                where: { id: user.id },
                data: { phoneOtp: otp, phoneOtpExpiry: new Date(Date.now() + 5 * 60 * 1000) }
            });
            await this.smsService.sendOtp(dto.phone, otp);
            return { message: 'A new OTP has been sent to your phone.' };
        }
        throw new common_1.BadRequestException('Could not resend OTP. Please start registration again.');
    }
    async login(dto) {
        const { identifier, password } = dto;
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }],
            },
        });
        if (!user || !user.password)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isActive) {
            throw new common_1.UnauthorizedException(user.role === client_1.Role.AGENT
                ? 'Your agent account is pending admin approval. Please wait for verification.'
                : 'Your account is currently inactive. Please contact support.');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.generateTokens(user.id, user.email, user.phone, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const { password: _, refreshToken: __, resetToken: ___, ...safeUser } = user;
        return { message: 'Login successful', data: { user: safeUser, ...tokens } };
    }
    async googleLogin(dto) {
        try {
            let email;
            try {
                const ticket = await this.googleClient.verifyIdToken({
                    idToken: dto.token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload || !payload.email)
                    throw new Error('No email in payload');
                email = payload.email;
            }
            catch (e) {
                const userInfo = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${dto.token}`)
                    .then(res => res.json());
                if (!userInfo || !userInfo.email) {
                    throw new common_1.BadRequestException('Invalid Google token or unable to fetch user info');
                }
                email = userInfo.email;
            }
            const user = await this.prisma.user.findUnique({
                where: { email, isActive: true },
            });
            if (!user) {
                throw new common_1.NotFoundException('No account found with this Google email. Please register first.');
            }
            const tokens = await this.generateTokens(user.id, user.email, user.phone || 'G-User', user.role);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            const { password: _, refreshToken: __, resetToken: ___, ...safeUser } = user;
            return { message: 'Google login successful', data: { user: safeUser, ...tokens } };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            console.error('Google Auth Error:', error);
            throw new common_1.UnauthorizedException('Google authentication failed');
        }
    }
    async refreshTokens(userId, refreshToken) {
        let finalUserId = userId;
        if (!finalUserId) {
            try {
                const payload = await this.jwtService.verifyAsync(refreshToken, {
                    secret: this.config.get('JWT_REFRESH_SECRET'),
                });
                finalUserId = payload.sub;
            }
            catch (e) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
        }
        const user = await this.prisma.user.findUnique({ where: { id: finalUserId } });
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
    async forgotPasswordPhone(dto) {
        const user = await this.prisma.user.findFirst({
            where: { phone: dto.phone }
        });
        if (!user) {
            throw new common_1.NotFoundException('No account found with this phone number.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                phoneOtp: otp,
                phoneOtpExpiry: otpExpiry,
            }
        });
        await this.smsService.sendOtp(dto.phone, otp);
        return {
            message: 'OTP has been sent to your phone number via SMS.',
            data: { phone: dto.phone }
        };
    }
    async resetPasswordPhone(dto) {
        const user = await this.prisma.user.findFirst({
            where: { phone: dto.phone }
        });
        if (!user)
            throw new common_1.NotFoundException('No account found with this phone number.');
        if (!user.phoneOtp || user.phoneOtp !== dto.otp) {
            throw new common_1.BadRequestException('Invalid OTP code. Please check and try again.');
        }
        if (!user.phoneOtpExpiry || user.phoneOtpExpiry < new Date()) {
            throw new common_1.BadRequestException('OTP code has expired. Please request a new OTP.');
        }
        const hashed = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                phoneOtp: null,
                phoneOtpExpiry: null,
                refreshToken: null,
            }
        });
        return { message: 'Password reset successful! Please login with your new password.' };
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
        config_1.ConfigService,
        sms_service_1.SmsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map