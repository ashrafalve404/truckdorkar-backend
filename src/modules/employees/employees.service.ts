import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingStatus, TicketStatus, TruckStatus } from '@prisma/client';

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

    // ── Truck Registration by Employee ─────────────────────────────────────

    async registerTruck(userId: string, data: any) {
        // Find the employee record
        const employee = await this.prisma.employee.findUnique({ where: { userId } });
        if (!employee) throw new NotFoundException('Employee profile not found');

        // Find or create a driver placeholder linked to a "fleet driver" user
        // Trucks registered by employees need a driverId — we use a system driver or find one
        // For employee-registered trucks, we create a special relationship:
        // The truck is owned by the employee fleet, so we need a dummy driverId.
        // Best practice: the employee links a specific driver. For now we require driverPhone field.
        // Find driver by phone or ID passed in body
        let driver: any = null;
        if (data.driverUserId) {
            driver = await this.prisma.driver.findFirst({ where: { userId: data.driverUserId } });
        } else if (data.driverPhone) {
            const driverUser = await this.prisma.user.findFirst({ where: { phone: data.driverPhone } });
            if (driverUser) {
                driver = await this.prisma.driver.findFirst({ where: { userId: driverUser.id } });
            }
        }

        if (!driver) {
            throw new NotFoundException('Driver not found. Please provide a valid driver phone number or user ID.');
        }

        const truck = await this.prisma.truck.create({
            data: {
                driverId: driver.id,
                registeredByEmployeeId: employee.id,
                name: data.name,
                registrationNo: data.registrationNo,
                numberPlateText: data.numberPlateText,
                category: data.category,
                capacityTon: Number(data.capacityTon),
                lengthFt: Number(data.lengthFt),
                make: data.make,
                model: data.model,
                year: data.year ? Number(data.year) : undefined,
                color: data.color,
                description: data.description,
                roadPermitUrl: data.roadPermitUrl,
                taxTokenUrl: data.taxTokenUrl,
                blueBookUrl: data.blueBookUrl,
                numberPlateImageUrl: data.numberPlateImageUrl,
                drivingLicenseUrl: data.drivingLicenseUrl,
                status: TruckStatus.PENDING,
            } as any,
        });

        return { message: 'Truck registered for review', data: truck };
    }

    async getTrucksByEmployee(userId: string) {
        const employee = await this.prisma.employee.findUnique({ where: { userId } });
        if (!employee) throw new NotFoundException('Employee profile not found');

        const trucks = await this.prisma.truck.findMany({
            where: { registeredByEmployeeId: employee.id } as any,
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return { message: 'Employee trucks fetched', data: trucks };
    }

    // ── Admin Operations ──────────────────────────────────────────────────

    async getAdminOverview() {
        const employees = await this.prisma.employee.findMany({
            include: {
                user: { select: { name: true, phone: true, email: true, isActive: true } },
                trucks: {
                    select: {
                        id: true,
                        name: true,
                        registrationNo: true,
                        status: true,
                        createdAt: true,
                    },
                },
            } as any,
            orderBy: { createdAt: 'desc' },
        });

        const overview = employees.map((emp: any) => ({
            id: emp.id,
            employeeId: emp.employeeId,
            user: emp.user,
            department: emp.department,
            designation: emp.designation,
            trucksTotal: emp.trucks ? emp.trucks.length : 0,
            trucksPending: emp.trucks ? emp.trucks.filter((t: any) => t.status === 'PENDING').length : 0,
            trucksApproved: emp.trucks ? emp.trucks.filter((t: any) => t.status === 'APPROVED').length : 0,
            trucksRejected: emp.trucks ? emp.trucks.filter((t: any) => t.status === 'REJECTED').length : 0,
            recentTrucks: emp.trucks ? emp.trucks.slice(0, 3) : [],
        }));

        return { message: 'Admin employee overview fetched', data: overview };
    }

    async getTrucksByEmployeeId(employeeId: string) {
        const trucks = await this.prisma.truck.findMany({
            where: { registeredByEmployeeId: employeeId } as any,
            include: {
                driver: { include: { user: { select: { name: true, phone: true } } } },
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return { message: 'Employee trucks fetched', data: trucks };
    }

    async approveTruck(truckId: string, status: string, note?: string) {
        const truck = await this.prisma.truck.update({
            where: { id: truckId },
            data: { status: status as TruckStatus, approvalNote: note, isAvailable: status === 'APPROVED' },
        });
        return { message: `Truck ${status.toLowerCase()}`, data: truck };
    }
}