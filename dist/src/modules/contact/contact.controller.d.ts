import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submit(dto: CreateContactDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            email: string | null;
            phone: string;
            name: string;
            message: string;
            isRead: boolean;
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
                message: string;
                isRead: boolean;
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
            message: string;
            isRead: boolean;
        };
    }>;
}
