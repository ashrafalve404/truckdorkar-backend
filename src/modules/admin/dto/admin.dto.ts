import { IsString, IsNumber, IsEmail, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TruckFareDto {
    @IsString()
    id: string;

    @IsString()
    nameEn: string;

    @IsString()
    nameBn: string;

    @IsNumber()
    minFare10km: number;

    @IsNumber()
    @IsOptional()
    capacityTon?: number;

    @IsNumber()
    @IsOptional()
    lengthFt?: number;

    @IsNumber()
    @IsOptional()
    farePerKm?: number;

    @IsOptional()
    isActive?: boolean;
}

export class UpdateSettingsDto {
    @ApiProperty({ example: 'TruckDorkar' })
    @IsString()
    @IsOptional()
    platformName?: string;

    @ApiProperty({ example: 'admin@truckdorkar.com' })
    @IsEmail()
    @IsOptional()
    adminEmail?: string;

    @ApiProperty({ example: 500 })
    @IsNumber()
    @IsOptional()
    baseFarePerKm?: number;

    @ApiProperty({ type: [TruckFareDto], description: 'Dynamic truck fare tiers' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TruckFareDto)
    @IsOptional()
    truckFares?: TruckFareDto[];
}

export class CreateAdminDto {
    @ApiProperty({ example: 'Admin Name' })
    @IsString()
    name: string;

    @ApiProperty({ example: '01700000000' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'newadmin@truckdorkar.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    password: string;
}

export class AdminChangePasswordDto {
    @ApiProperty({ example: 'oldpassword123' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'newpassword123' })
    @IsString()
    newPassword: string;
}
