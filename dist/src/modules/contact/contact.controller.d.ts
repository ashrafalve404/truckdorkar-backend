import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submit(dto: CreateContactDto): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            phone: string;
            email: string | null;
            message: string;
            isRead: boolean;
            createdAt: Date;
        };
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            messages: {
                id: string;
                name: string;
                phone: string;
                email: string | null;
                message: string;
                isRead: boolean;
                createdAt: Date;
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
            name: string;
            phone: string;
            email: string | null;
            message: string;
            isRead: boolean;
            createdAt: Date;
        };
    }>;
}
