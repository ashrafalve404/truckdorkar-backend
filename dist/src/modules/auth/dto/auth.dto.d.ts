import { Role } from '@prisma/client';
export declare class RegisterDto {
    name?: string;
    email?: string;
    phone: string;
    password: string;
    role?: Role;
    licenseNumber?: string;
    experience?: number;
    companyName?: string;
    employeeId?: string;
}
export declare class LoginDto {
    identifier: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
