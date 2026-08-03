import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, SocialLoginDto, VerifyPhoneOtpDto, ResendPhoneOtpDto, ForgotPasswordPhoneDto, ResetPasswordPhoneDto } from './dto/auth.dto';
import { SmsService } from '../sms/sms.service';
export declare class AuthService implements OnModuleInit {
    private prisma;
    private jwtService;
    private config;
    private smsService;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, smsService: SmsService);
    onModuleInit(): Promise<void>;
    private generateAgentId;
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            requiresOtp: boolean;
            phone: string;
            role: "USER" | "DRIVER";
            signupToken: string;
        };
    }>;
    verifyPhoneOtp(dto: VerifyPhoneOtpDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string | null;
                phone: string | null;
                name: string | null;
                role: import("@prisma/client").$Enums.Role;
                isPhoneVerified: boolean;
            };
        };
    }>;
    resendPhoneOtp(dto: ResendPhoneOtpDto): Promise<{
        message: string;
        data: {
            signupToken: string;
            phone: any;
        };
    } | {
        message: string;
        data?: undefined;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                name: string | null;
                avatar: string | null;
                role: import("@prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                isPhoneVerified: boolean;
                isActive: boolean;
                emailVerifyToken: string | null;
                phoneOtp: string | null;
                phoneOtpExpiry: Date | null;
                resetTokenExpiry: Date | null;
                deletedAt: Date | null;
            };
        };
    }>;
    googleLogin(dto: SocialLoginDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string | null;
                phone: string | null;
                name: string | null;
                avatar: string | null;
                role: import("@prisma/client").$Enums.Role;
                isEmailVerified: boolean;
                isPhoneVerified: boolean;
                isActive: boolean;
                emailVerifyToken: string | null;
                phoneOtp: string | null;
                phoneOtpExpiry: Date | null;
                resetTokenExpiry: Date | null;
                deletedAt: Date | null;
            };
        };
    }>;
    refreshTokens(userId: string | undefined, refreshToken: string): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    forgotPasswordPhone(dto: ForgotPasswordPhoneDto): Promise<{
        message: string;
        data: {
            phone: string;
        };
    }>;
    resetPasswordPhone(dto: ResetPasswordPhoneDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        message: string;
        data: {
            agent: {
                id: string;
                agentId: string | null;
                department: string | null;
                designation: string | null;
            } | null;
            id: string;
            createdAt: Date;
            email: string | null;
            phone: string | null;
            name: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.Role;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            driver: {
                id: string;
                totalTrips: number;
                rating: number;
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
            } | null;
        };
    }>;
    private generateTokens;
    private updateRefreshToken;
}
