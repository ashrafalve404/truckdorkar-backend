import {
    Controller, Get, Post, Patch, Body, Param, UseGuards,
    UploadedFiles, UseInterceptors, Request, Query
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { EmployeesService } from './employees.service';
import { StorageService } from '../storage/storage.service';
import { Role } from '@prisma/client';

@ApiTags('employees')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
    constructor(
        private readonly employeesService: EmployeesService,
        private readonly storageService: StorageService,
    ) { }

    @Get('dashboard')
    @Roles(Role.EMPLOYEE, Role.ADMIN)
    @ApiOperation({ summary: 'Get summary for employee task dashboard' })
    getDashboard() {
        return this.employeesService.getDashboard();
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] List all employees' })
    findAll() {
        return this.employeesService.findAll();
    }

    // ── Truck Registration by Employee ─────────────────────────────────────

    @Post('trucks')
    @Roles(Role.EMPLOYEE)
    @ApiOperation({ summary: '[Employee] Register a new truck with documents' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'taxTokenFile', maxCount: 1 },
        { name: 'blueBookFile', maxCount: 1 },
        { name: 'numberPlateFile', maxCount: 1 },
        { name: 'roadPermitFile', maxCount: 1 },
        { name: 'drivingLicenseFile', maxCount: 1 },
    ]))
    async registerTruck(
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
        // Upload docs to storage
        const [taxTokenUrl, blueBookUrl, numberPlateImageUrl, roadPermitUrl, drivingLicenseUrl] = await Promise.all([
            files.taxTokenFile?.[0] ? this.storageService.save(files.taxTokenFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.blueBookFile?.[0] ? this.storageService.save(files.blueBookFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.numberPlateFile?.[0] ? this.storageService.save(files.numberPlateFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.roadPermitFile?.[0] ? this.storageService.save(files.roadPermitFile[0], 'truck-docs') : Promise.resolve(undefined),
            files.drivingLicenseFile?.[0] ? this.storageService.save(files.drivingLicenseFile[0], 'truck-docs') : Promise.resolve(undefined),
        ]);

        return this.employeesService.registerTruck(userId, {
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

    @Get('trucks')
    @Roles(Role.EMPLOYEE)
    @ApiOperation({ summary: '[Employee] List trucks registered by this employee' })
    getMyTrucks(@CurrentUser('id') userId: string) {
        return this.employeesService.getTrucksByEmployee(userId);
    }

    // ── Admin: Employee Overview ────────────────────────────────────────────

    @Get('admin/overview')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Get all employees with their truck counts and info' })
    getAdminOverview() {
        return this.employeesService.getAdminOverview();
    }

    @Get('admin/:employeeId/trucks')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Get all trucks registered by a specific employee' })
    getEmployeeTrucks(@Param('employeeId') employeeId: string) {
        return this.employeesService.getTrucksByEmployeeId(employeeId);
    }

    @Patch('admin/trucks/:truckId/approve')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[Admin] Approve or reject a truck submitted by an employee' })
    approveTruck(
        @Param('truckId') truckId: string,
        @Body('status') status: string,
        @Body('note') note?: string,
    ) {
        return this.employeesService.approveTruck(truckId, status, note);
    }
}
