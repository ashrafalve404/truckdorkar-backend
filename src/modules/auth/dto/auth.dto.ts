import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsMobilePhone } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
    @ApiPropertyOptional({ example: 'Rahim Uddin' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'rahim@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: '01826110036' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'SecurePass@123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ enum: Role, default: Role.USER })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    // Optional fields for Driver/Agent
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    licenseNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    experience?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    companyName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    agentId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    nidNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    dateOfBirth?: string;
}

export class LoginDto {
    @ApiProperty({ example: '01826110036', description: 'Phone or Email' })
    @IsString()
    identifier: string;

    @ApiProperty({ example: 'SecurePass@123' })
    @IsString()
    password: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'rahim@example.com' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    newPassword: string;
}

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    currentPassword: string;

    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    newPassword: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    refreshToken: string;
}
