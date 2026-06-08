import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EmployeesService } from './employees.service';
import { Role } from '@prisma/client';

@ApiTags('employees')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EMPLOYEE, Role.ADMIN)
@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Get('dashboard')
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
}
