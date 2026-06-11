import { IsString, IsEnum, IsNumber, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TruckCategory } from '@prisma/client';

export class CreateTruckDto {
    @ApiProperty() @IsString() name: string;
    @ApiProperty() @IsString() registrationNo: string;
    @ApiProperty({ enum: TruckCategory }) @IsEnum(TruckCategory) category: TruckCategory;
    @ApiProperty() @IsNumber() capacityTon: number;
    @ApiProperty() @IsNumber() lengthFt: number;
    @ApiPropertyOptional() @IsOptional() @IsString() make?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() model?: string;
    @ApiPropertyOptional() @IsOptional() @IsInt() year?: number;
    @ApiPropertyOptional() @IsOptional() @IsString() color?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() numberPlateText?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() roadPermitUrl?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() taxTokenUrl?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() blueBookUrl?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() numberPlateImageUrl?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() registeredByEmployeeId?: string;
}

export class UpdateTruckDto {
    @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
    @ApiPropertyOptional() @IsOptional() @IsNumber() capacityTon?: number;
    @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() isAvailable?: boolean;
}

export class ApproveTruckDto {
    @ApiProperty() @IsString() status: string;
    @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}
