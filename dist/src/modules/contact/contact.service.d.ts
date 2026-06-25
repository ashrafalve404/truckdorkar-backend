import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/contact.dto';
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    submit(dto: CreateContactDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            email: string | null;
            phone: string;
            name: string;
            isRead: boolean;
            message: string;
        };
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            messages: {
                id: string;
                createdAt: Date;
                email: string | null;
                phone: string;
                name: string;
                isRead: boolean;
                message: string;
            }[];
            total: number;
            page: number;
            limit: number;
        };
    }>;
    markAsRead(id: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            email: string | null;
            phone: string;
            name: string;
            isRead: boolean;
            message: string;
        };
    }>;
}
