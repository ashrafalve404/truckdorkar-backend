import {
    Controller, Get, Post, Patch, Delete, Body, Param, Query,
    UseGuards, UploadedFile, UploadedFiles, UseInterceptors
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
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

    @Get('mine')
    @ApiBearerAuth('access-token')
    @Roles(Role.DRIVER)
    @ApiOperation({ summary: '[Driver] Get my registered trucks' })
    getMyTrucks(@CurrentUser('id') userId: string) {
        return this.trucksService.findMyTrucks(userId);
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
    @ApiOperation({ summary: '[Driver] Add a truck with documents' })
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'taxTokenFile', maxCount: 1 },
        { name: 'blueBookFile', maxCount: 1 },
        { name: 'numberPlateFile', maxCount: 1 },
        { name: 'roadPermitFile', maxCount: 1 },
        { name: 'drivingLicenseFile', maxCount: 1 },
    ]))
    async create(
        @CurrentUser('id') userId: string,
        @Body() body: any,
        @UploadedFiles() files: {
            taxTokenFile?: Express.Multer.File[];
            blueBookFile?: Express.Multer.File[];
            numberPlateFile?: Express.Multer.File[];
            roadPermitFile?: Express.Multer.File[];
            drivingLicenseFile?: Express.Multer.File[];
        },
    ) {
        const [taxTokenUrl, blueBookUrl, numberPlateImageUrl, roadPermitUrl, drivingLicenseUrl] = await Promise.all([
            files.taxTokenFile?.[0] ? this.storageService.save(files.taxTokenFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.blueBookFile?.[0] ? this.storageService.save(files.blueBookFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.numberPlateFile?.[0] ? this.storageService.save(files.numberPlateFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.roadPermitFile?.[0] ? this.storageService.save(files.roadPermitFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.drivingLicenseFile?.[0] ? this.storageService.save(files.drivingLicenseFile[0], 'truck-docs') : Promise.resolve(undefined),
        ]);

        return this.trucksService.create(userId, {
            ...body,
            capacityTon: Number(body.capacityTon),
            lengthFt: Number(body.lengthFt),
            year: body.year ? Number(body.year) : undefined,
            taxTokenUrl,
            blueBookUrl,
            numberPlateImageUrl,
            roadPermitUrl,
            drivingLicenseUrl,
        });
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
