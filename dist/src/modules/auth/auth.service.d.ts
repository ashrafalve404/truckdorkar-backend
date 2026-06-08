import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                name: string | null;
                email: string | null;
                phone: string | null;
                role: import("@prisma/client").$Enums.Role;
                id: string;
                createdAt: Date;
            };
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                name: string | null;
                email: string | null;
                phone: string | null;
                role: import("@prisma/client").$Enums.Role;
                id: string;
                avatar: string | null;
                isEmailVerified: boolean;
                isPhoneVerified: boolean;
                isActive: boolean;
                emailVerifyToken: string | null;
                phoneOtp: string | null;
                phoneOtpExpiry: Date | null;
                resetTokenExpiry: Date | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
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
            driver: {
                id: string;
                totalTrips: number;
                rating: number;
                status: import("@prisma/client").$Enums.DriverStatus;
                isAvailable: boolean;
            } | null;
            employee: {
                id: string;
                employeeId: string | null;
                department: string | null;
                designation: string | null;
            } | null;
            name: string | null;
            email: string | null;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            id: string;
            avatar: string | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            createdAt: Date;
        };
    }>;
    private generateTokens;
    private updateRefreshToken;
}
