import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class EmployeesService {
    constructor(private prisma: PrismaService) { }

    async getDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [pendingDrivers, pendingTrucks, openTickets, todayBookings, recentTickets] = await Promise.all([
            this.prisma.driver.count({ where: { status: 'PENDING' } }),
            this.prisma.truck.count({ where: { status: 'PENDING' } }),
            this.prisma.supportTicket.count({ where: { status: TicketStatus.OPEN } }),
            this.prisma.booking.count({ where: { createdAt: { gte: today } } }),
            this.prisma.supportTicket.findMany({
                where: { status: { in: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS] } },
                include: { user: { select: { name: true, phone: true } } },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);

        return {
            message: 'Employee dashboard summary',
            data: {
                counts: {
                    pendingDrivers,
                    pendingTrucks,
                    openTickets,
                    todayBookings,
                },
                recentTickets,
            },
        };
    }

    async findAll() {
        const employees = await this.prisma.employee.findMany({
            include: { user: { select: { name: true, phone: true, email: true, isActive: true } } },
        });
        return { message: 'Employees fetched', data: employees };
    }
}