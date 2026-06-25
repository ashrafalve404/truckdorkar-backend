import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, SocialLoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    private generateAgentId;
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                createdAt: Date;
                email: string | null;
                phone: string | null;
                name: string | null;
                role: import("@prisma/client").$Enums.Role;
            };
        };
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
