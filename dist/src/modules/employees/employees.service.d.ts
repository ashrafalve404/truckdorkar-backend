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
                name: string | null;
                email: string | null;
                phone: string | null;
                isActive: boolean;
            };
        } & {
            employeeId: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            department: string | null;
            designation: string | null;
            userId: string;
        })[];
    }>;
}
