import { PrismaService } from '../../prisma/prisma.service';
export declare class EmployeesService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        message: string;
        data: {
            pendingDrivers: number;
            pendingTrucks: number;
            openTickets: number;
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
            employeeId: string | null;
            department: string | null;
            designation: string | null;
            userId: string;
        })[];
    }>;
}
