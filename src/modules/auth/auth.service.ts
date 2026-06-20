import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, SocialLoginDto } from './dto/auth.dto';
import { Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
    private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    private generateAgentId(): string {
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `TDL-AGENT-${random}-${Date.now().toString().slice(-4)}`;
    }

    // ─── Register ────────────────────────────────────────────────────────────

    async register(dto: RegisterDto) {
        const { name, email, phone, password, role, licenseNumber, experience, companyName, agentId, nidNumber, dateOfBirth } = dto;

        // Check uniqueness
        if (email) {
            const emailExists = await this.prisma.user.findUnique({ where: { email } });
            if (emailExists) throw new ConflictException('Email already registered');
        }

        const phoneExists = await this.prisma.user.findUnique({ where: { phone } });
        if (phoneExists) throw new ConflictException('Phone number already registered');

        // Prevent direct ADMIN registration
        const safeRole = role === Role.ADMIN ? Role.USER : (role ?? Role.USER);

        const hashed = await bcrypt.hash(password, 12);

        // Preventive settings for roles
        let isActive = true;
        let finalAgentId = agentId;
        const currentCompanyName = "Truck Dorkar Limited";

        if (safeRole === Role.AGENT) {
            isActive = false; // Require admin approval
            finalAgentId = this.generateAgentId();
        }

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashed,
                role: safeRole,
                isActive,
                // Auto-create driver profile if role is DRIVER
                ...(safeRole === Role.DRIVER && {
                    driver: {
                        create: {
                            licenseNumber,
                            experience: experience ? Number(experience) : undefined,
                        }
                    },
                }),
                // Auto-create agent profile if role is AGENT
                ...(safeRole === Role.AGENT && {
                    agent: {
                        create: {
                            agentId: finalAgentId,
                            nidNumber,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                            designation: 'Staff',
                            department: currentCompanyName,
                        }
                    },
                }),
            },
            select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
        });

        // Notify Admins for all new registrations
        const admins = await this.prisma.user.findMany({ where: { role: Role.ADMIN } });
        await Promise.all(admins.map(admin =>
            this.prisma.notification.create({
                data: {
                    userId: admin.id,
                    type: 'SYSTEM',
                    title: `New ${safeRole === 'AGENT' ? 'Agent' : safeRole === 'DRIVER' ? 'Driver' : 'User'} Registered`,
                    body: `A new ${safeRole.toLowerCase()} ${name || phone} has joined. ${safeRole !== 'USER' ? 'Verification needed.' : ''}`,
                    data: {
                        userId: user.id,
                        role: safeRole,
                        agentId: safeRole === 'AGENT' ? finalAgentId : undefined
                    }
                }
            })
        ));

        const tokens = await this.generateTokens(user.id, user.email!, user.phone!, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            message: safeRole === Role.AGENT ? 'Registration successful. Waiting for admin approval.' : 'Registration successful',
            data: { user, ...tokens }
        };
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
