import { IsString, IsOptional, IsObject, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCmsContentDto {
    @ApiPropertyOptional() @IsOptional() @IsString() titleEn?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() titleBn?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() bodyEn?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() bodyBn?: string;
    @ApiPropertyOptional() @IsOptional() @IsObject() metaJson?: any;
}

export class CreateBannerDto {
    @ApiProperty() @IsString() titleEn: string;
    @ApiProperty() @IsOptional() @IsString() titleBn?: string;
    @ApiProperty() @IsString() imageUrl: string;
    @ApiPropertyOptional() @IsOptional() @IsString() linkUrl?: string;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
}
