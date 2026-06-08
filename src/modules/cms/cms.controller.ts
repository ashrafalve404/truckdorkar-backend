import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CmsService } from './cms.service';
import { UpdateCmsContentDto, CreateBannerDto } from './dto/cms.dto';
import { Role } from '@prisma/client';

@ApiTags('cms')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'cms', version: '1' })
export class CmsController {
    constructor(private readonly cmsService: CmsService) { }

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
}
