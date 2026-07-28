import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { StorageModule } from '../storage/storage.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({ imports: [StorageModule, NotificationsModule], controllers: [DriversController], providers: [DriversService], exports: [DriversService] })
export class DriversModule { }
