import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { StorageModule } from '../storage/storage.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [StorageModule, NotificationsModule],
    controllers: [AgentsController],
    providers: [AgentsService],
    exports: [AgentsService],
})
export class AgentsModule { }
