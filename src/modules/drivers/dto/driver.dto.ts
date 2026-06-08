import { IsOptional, IsString, IsInt, IsDateString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDriverProfileDto {
    @ApiPropertyOptional() @IsOptional() @IsString() nidNumber?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() licenseNumber?: string;
    @ApiPropertyOptional() @IsOptional() @IsDateString() licenseExpiry?: string;
    @ApiPropertyOptional() @IsOptional() @IsInt() experience?: number;
}

export class SetAvailabilityDto {
    @ApiPropertyOptional() @IsOptional() isAvailable: boolean;
    @ApiPropertyOptional() @IsOptional() @IsNumber() lat?: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() lng?: number;
}

export class VerifyDriverDto {
    @ApiPropertyOptional() @IsString() status: string;
    @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}
