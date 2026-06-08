import { Module } from '@nestjs/common';
import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';
import { StorageModule } from '../storage/storage.module';

@Module({ imports: [StorageModule], controllers: [TrucksController], providers: [TrucksService], exports: [TrucksService] })
export class TrucksModule { }
