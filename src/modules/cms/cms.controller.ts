import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CmsService } from './cms.service';
import { StorageService } from '../storage/storage.service';
import { UpdateCmsContentDto, CreateBannerDto } from './dto/cms.dto';
import { Role } from '@prisma/client';

@ApiTags('cms')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'cms', version: '1' })
export class CmsController {
    constructor(
        private readonly cmsService: CmsService,
        private readonly storageService: StorageService,
    ) { }

    @Public()
    @Get('content/:key')
    @ApiOperation({ summary: 'Get CMS content by key (public)' })
    getContent(@Param('key') key: string) {
        return this.cmsService.getContent(key);
    }

    @Patch('content/:key')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Update CMS content' })
    updateContent(@Param('key') key: string, @Body() dto: UpdateCmsContentDto) {
        return this.cmsService.updateContent(key, dto);
    }

    @Public()
    @Get('banners')
    @ApiOperation({ summary: 'Get active banners (public)' })
    getBanners() {
        return this.cmsService.getBanners();
    }

    @Get('banners/admin')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Get all banners' })
    getAllBannersAdmin() {
        return this.cmsService.getAllBannersAdmin();
    }

    @Get('banners/all')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Get all banners (alias)' })
    getAllBannersAll() {
        return this.cmsService.getAllBannersAdmin();
    }

    @Post('banners/upload')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Upload banner image' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async uploadBannerImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Please select an image file to upload.');
        }
        const url = await this.storageService.save(file, 'banners');
        return { message: 'Image uploaded successfully', url };
    }

    @Post('banners')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Create a banner' })
    createBanner(@Body() dto: CreateBannerDto) {
        return this.cmsService.createBanner(dto);
    }

    @Patch('banners/:id')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Update a banner' })
    updateBanner(@Param('id') id: string, @Body() dto: Partial<CreateBannerDto>) {
        return this.cmsService.updateBanner(id, dto);
    }

    @Delete('banners/:id')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Delete a banner' })
    deleteBanner(@Param('id') id: string) {
        return this.cmsService.deleteBanner(id);
    }
}
