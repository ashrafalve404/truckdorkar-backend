import { TicketPriority } from '@prisma/client';
export declare class CreateTicketDto {
    subject: string;
    description: string;
    priority?: TicketPriority;
}
export declare class CreateReplyDto {
    message: string;
}
