import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
    @ApiProperty() @IsString() label: string;
    @ApiProperty() @IsString() address: string;
    @ApiProperty() @IsString() city: string;
    @ApiPropertyOptional() @IsOptional() @IsString() district?: string;
    @ApiPropertyOptional() @IsOptional() @IsNumber() latitude?: number;
    @ApiPropertyOptional() @IsOptional() @IsNumber() longitude?: number;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() isDefault?: boolean;
}
