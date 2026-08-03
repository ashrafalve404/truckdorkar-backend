import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
    RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, SocialLoginDto,
    VerifyPhoneOtpDto, ResendPhoneOtpDto, ForgotPasswordPhoneDto, ResetPasswordPhoneDto
} from './dto/auth.dto';
import { Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService implements OnModuleInit {
    private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
        private smsService: SmsService,
    ) { }

    async onModuleInit() {
        try {
            // Safely mark any legacy accounts as verified so NestJS startup never fails
            await this.prisma.user.updateMany({
                where: { isPhoneVerified: false },
                data: { isPhoneVerified: true }
            });
        } catch (e) {
            console.error('AuthService onModuleInit warning:', e);
        }
    }

    private generateAgentId(): string {
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TDL-AGENT-${random}-${Date.now().toString().slice(-4)}`;
    }

    // ─── Register ────────────────────────────────────────────────────────────

    async register(dto: RegisterDto) {
        const { name, email, phone, password, role, licenseNumber, experience } = dto;

        // Check uniqueness for existing database users
        if (email && email.trim() !== '') {
            const emailExists = await this.prisma.user.findUnique({ where: { email } });
            if (emailExists) throw new ConflictException('Email is already registered.');
        }

        const phoneExists = await this.prisma.user.findUnique({ where: { phone } });
        if (phoneExists) throw new ConflictException('Phone number is already registered.');

        // Prevent direct ADMIN and AGENT registration
        const safeRole = (role === Role.ADMIN || role === Role.AGENT) ? Role.USER : (role ?? Role.USER);
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Signed signup session token (valid for 10 minutes)
        const signupToken = this.jwtService.sign(
            {
                name,
                email: (email && email.trim() !== '') ? email : null,
                phone,
                hashedPassword,
                role: safeRole,
                licenseNumber,
                experience: experience ? Number(experience) : undefined,
                otp,
            },
            {
                secret: this.config.get('JWT_ACCESS_SECRET'),
                expiresIn: '10m',
            }
        );

        // Send OTP via BulkSMS BD
        await this.smsService.sendOtp(phone, otp);

        // ZERO database rows created yet!
        return {
            message: 'OTP sent to your phone number. Please enter the OTP to complete registration.',
            data: { requiresOtp: true, phone, role: safeRole, signupToken }
        };
    }

    // ─── Verify Registration Phone OTP ───────────────────────────────────────

    async verifyPhoneOtp(dto: VerifyPhoneOtpDto) {
        let payload: any;

        if (dto.signupToken) {
            try {
                payload = await this.jwtService.verifyAsync(dto.signupToken, {
                    secret: this.config.get('JWT_ACCESS_SECRET'),
                });
            } catch (e) {
                throw new BadRequestException('Registration session expired. Please register again.');
            }
        }

        // Fallback or verify OTP matching
        if (!payload || payload.otp !== dto.otp) {
            // Check if there is a pending user record in DB as fallback
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
            throw new BadRequestException('Invalid OTP code. Please check and try again.');
        }

        // Re-verify uniqueness before creating database row
        const phoneExists = await this.prisma.user.findUnique({ where: { phone: payload.phone } });
        if (phoneExists) throw new ConflictException('Phone number is already registered.');

        // NOW CREATE USER IN DATABASE ONLY AFTER SUCCESSFUL OTP VERIFICATION!
        const user = await this.prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                password: payload.hashedPassword,
                role: payload.role,
                isPhoneVerified: true,
                isActive: true,
                ...(payload.role === Role.DRIVER && {
                    driver: {
                        create: {
                            licenseNumber: payload.licenseNumber,
                            experience: payload.experience,
                        }
                    }
                })
            },
            select: { id: true, name: true, email: true, phone: true, role: true, isPhoneVerified: true }
        });

        // Notify Admins only after verified creation
        const admins = await this.prisma.user.findMany({ where: { role: Role.ADMIN } });
        await Promise.all(admins.map(admin =>
            this.prisma.notification.create({
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
            })
        ));

        const tokens = await this.generateTokens(user.id, user.email || '', user.phone || '', user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            message: 'Phone number verified successfully. Welcome to TruckDorkar!',
            data: { user, ...tokens }
        };
    }

    // ─── Resend Phone OTP ───────────────────────────────────────────────────

    async resendPhoneOtp(dto: ResendPhoneOtpDto) {
        if (dto.signupToken) {
            try {
                const payload: any = this.jwtService.decode(dto.signupToken);
                if (payload && payload.phone) {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const newSignupToken = this.jwtService.sign(
                        { ...payload, otp: newOtp },
                        { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: '10m' }
                    );
                    await this.smsService.sendOtp(payload.phone, newOtp);
                    return {
                        message: 'New OTP sent to your phone number.',
                        data: { signupToken: newSignupToken, phone: payload.phone }
                    };
                }
            } catch (e) { }
        }

        // Fallback for existing unverified user record
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

        throw new BadRequestException('Could not resend OTP. Please start registration again.');
    }

    // ─── Login ───────────────────────────────────────────────────────────────

    async login(dto: LoginDto) {
        const { identifier, password } = dto;

        // Find by email or phone
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phone: identifier }],
            },
        });

        if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

        if (!user.isActive) {
            throw new UnauthorizedException(
                user.role === Role.AGENT
                    ? 'Your agent account is pending admin approval. Please wait for verification.'
                    : 'Your account is currently inactive. Please contact support.'
            );
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        const tokens = await this.generateTokens(user.id, user.email!, user.phone!, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        const { password: _, refreshToken: __, resetToken: ___, ...safeUser } = user;
        return { message: 'Login successful', data: { user: safeUser, ...tokens } };
    }

    // ─── Google Login ────────────────────────────────────────────────────────

    async googleLogin(dto: SocialLoginDto) {
        try {
            let email: string;

            try {
                // Try verifying as ID Token first
                const ticket = await this.googleClient.verifyIdToken({
                    idToken: dto.token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload || !payload.email) throw new Error('No email in payload');
                email = payload.email;
            } catch (e) {
                // If not an ID Token, it might be an Access Token (implicit flow)
                // Fetch user info from Google directly
                const userInfo = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${dto.token}`)
                    .then(res => res.json());

                if (!userInfo || !userInfo.email) {
                    throw new BadRequestException('Invalid Google token or unable to fetch user info');
                }
                email = userInfo.email;
            }

            // Find user by email
            const user = await this.prisma.user.findUnique({
                where: { email, isActive: true },
            });

            if (!user) {
                throw new NotFoundException('No account found with this Google email. Please register first.');
            }

            // Generate tokens for existing user
            const tokens = await this.generateTokens(user.id, user.email!, user.phone || 'G-User', user.role);
            await this.updateRefreshToken(user.id, tokens.refreshToken);

            const { password: _, refreshToken: __, resetToken: ___, ...safeUser } = user;
            return { message: 'Google login successful', data: { user: safeUser, ...tokens } };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
            console.error('Google Auth Error:', error);
            throw new UnauthorizedException('Google authentication failed');
        }
    }

    // ─── Refresh Token ───────────────────────────────────────────────────────

    async refreshTokens(userId: string | undefined, refreshToken: string) {
        let finalUserId = userId;

        if (!finalUserId) {
            try {
                const payload = await this.jwtService.verifyAsync(refreshToken, {
                    secret: this.config.get('JWT_REFRESH_SECRET'),
                });
                finalUserId = payload.sub;
            } catch (e) {
                throw new UnauthorizedException('Invalid refresh token');
            }
        }

        const user = await this.prisma.user.findUnique({ where: { id: finalUserId } });
        if (!user?.refreshToken) throw new UnauthorizedException('Access denied');

        const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!rtMatches) throw new UnauthorizedException('Access denied');

        const tokens = await this.generateTokens(user.id, user.email!, user.phone!, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { message: 'Tokens refreshed', data: tokens };
    }

    // ─── Logout ──────────────────────────────────────────────────────────────

    async logout(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        return { message: 'Logged out successfully' };
    }

    // ─── Forgot Password ─────────────────────────────────────────────────────

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        // Always return success to prevent email enumeration
        if (!user) return { message: 'If the email exists, a reset link has been sent.' };

        const token = uuidv4();
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetToken: token, resetTokenExpiry: expiry },
        });

        // TODO: Send email with reset link
        // await this.mailerService.sendResetEmail(user.email, token);

        return { message: 'If the email exists, a reset link has been sent.' };
    }

    // ─── Reset Password ──────────────────────────────────────────────────────

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: dto.token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) throw new BadRequestException('Invalid or expired reset token');

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

    // ─── Phone-based Forgot Password (SMS OTP) ───────────────────────────────

    async forgotPasswordPhone(dto: ForgotPasswordPhoneDto) {
        const user = await this.prisma.user.findFirst({
            where: { phone: dto.phone }
        });

        if (!user) {
            throw new NotFoundException('No account found with this phone number.');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

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

    // ─── Phone-based Reset Password with OTP ──────────────────────────────────

    async resetPasswordPhone(dto: ResetPasswordPhoneDto) {
        const user = await this.prisma.user.findFirst({
            where: { phone: dto.phone }
        });

        if (!user) throw new NotFoundException('No account found with this phone number.');

        if (!user.phoneOtp || user.phoneOtp !== dto.otp) {
            throw new BadRequestException('Invalid OTP code. Please check and try again.');
        }

        if (!user.phoneOtpExpiry || user.phoneOtpExpiry < new Date()) {
            throw new BadRequestException('OTP code has expired. Please request a new OTP.');
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

    // ─── Change Password ─────────────────────────────────────────────────────

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.password) throw new NotFoundException('User not found');

        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid) throw new BadRequestException('Current password is incorrect');

        const hashed = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashed, refreshToken: null },
        });

        return { message: 'Password changed. Please login again.' };
    }

    // ─── Get Me ───────────────────────────────────────────────────────────────

    async getMe(userId: string) {
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
        if (!user) throw new NotFoundException('User not found');
        return { message: 'Profile fetched', data: user };
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private async generateTokens(userId: string, email: string, phone: string, role: Role) {
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

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashed = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashed },
        });
    }
}
