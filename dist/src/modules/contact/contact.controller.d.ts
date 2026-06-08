import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submit(dto: CreateContactDto): Promise<{
        message: string;
        data: {
            name: string;
            email: string | null;
            phone: string;
            id: string;
            createdAt: Date;
            isRead: boolean;
            message: string;
        };
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string;
        data: {
            messages: {
                name: string;
                email: string | null;
                phone: string;
                id: string;
                createdAt: Date;
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
            name: string;
            email: string | null;
            phone: string;
            id: string;
            createdAt: Date;
            isRead: boolean;
            message: string;
        };
    }>;
}
