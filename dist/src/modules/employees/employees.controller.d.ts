import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
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
