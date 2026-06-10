import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    getDashboard(): Promise<{
        message: string;
        data: {
            counts: {
                pendingDrivers: number;
                pendingTrucks: number;
                openTickets: number;
                todayBookings: number;
            };
            recentTickets: ({
                user: {
                    phone: string | null;
                    name: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.TicketStatus;
                description: string;
                userId: string;
                subject: string;
                priority: import("@prisma/client").$Enums.TicketPriority;
            })[];
        };
    }>;
    findAll(): Promise<{
        message: string;
        data: ({
            user: {
                email: string | null;
                phone: string | null;
                name: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nidNumber: string | null;
            employeeId: string | null;
            dateOfBirth: Date | null;
            department: string | null;
            designation: string | null;
            userId: string;
        })[];
    }>;
}
