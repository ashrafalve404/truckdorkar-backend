import { IsString, IsNumber, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
