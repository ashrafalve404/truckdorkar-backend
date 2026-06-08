import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { TrucksService } from './trucks.service';
import { CreateTruckDto, UpdateTruckDto, ApproveTruckDto } from './dto/truck.dto';
import { StorageService } from '../storage/storage.service';
import { Role } from '@prisma/client';

@ApiTags('trucks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'trucks', version: '1' })
export class TrucksController {
    constructor(private readonly trucksService: TrucksService, private readonly storageService: StorageService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'List available trucks (public)' })
    findAll(@Query() query: any) {
        return this.trucksService.findAll(query);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get truck details (public)' })
    findOne(@Param('id') id: string) {
        return this.trucksService.findOne(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: '[Driver] Add a truck' })
    create(@CurrentUser('id') userId: string, @Body() dto: CreateTruckDto) {
        return this.trucksService.create(userId, dto);
    }

    @Patch(':id')
    @ApiBearerAuth('access-token')
    @Roles(Role.DRIVER, Role.ADMIN)
    @ApiOperation({ summary: '[Driver/Admin] Update truck info' })
    update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateTruckDto) {
        return this.trucksService.update(id, user.id, user.role, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @Roles(Role.DRIVER, Role.ADMIN)
    @ApiOperation({ summary: '[Driver/Admin] Soft-delete truck' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.trucksService.remove(id, user.id, user.role);
    }

    @Post(':id/images')
    @ApiBearerAuth('access-token')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: '[Driver] Upload truck image' })
    @UseInterceptors(FileInterceptor('image'))
    async addImage(
        @Param('id') truckId: string,
        @CurrentUser('id') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body('isPrimary') isPrimary?: string,
    ) {
        const url = await this.storageService.save(file, 'trucks');
        return this.trucksService.addImage(truckId, userId, url, isPrimary === 'true');
    }

    @Patch(':id/approve')
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: '[Admin] Approve or reject a truck' })
    approve(@Param('id') id: string, @Body() dto: ApproveTruckDto) {
        return this.trucksService.approveTruck(id, dto.status, dto.note);
    }
}
