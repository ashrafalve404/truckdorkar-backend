import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmployeesService {
    constructor(private prisma: PrismaService) { }

    async getDashboard() {
        const [pendingDrivers, pendingTrucks, openTickets] = await Promise.all([
            this.prisma.driver.count({ where: { status: 'PENDING' } }),
            this.prisma.truck.count({ where: { status: 'PENDING' } }),
            this.prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        ]);
        return {
            message: 'Employee dashboard summary',
            data: { pendingDrivers, pendingTrucks, openTickets },
        };
    }

    async findAll() {
        const employees = await this.prisma.employee.findMany({
            include: { user: { select: { name: true, phone: true, email: true, isActive: true } } },
        });
        return { message: 'Employees fetched', data: employees };
    }
}
