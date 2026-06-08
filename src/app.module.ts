import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { TrucksModule } from './modules/trucks/trucks.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupportModule } from './modules/support/support.module';
import { CmsModule } from './modules/cms/cms.module';
import { ContactModule } from './modules/contact/contact.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    DriversModule,
    TrucksModule,
    BookingsModule,
    QuotationsModule,
    ReviewsModule,
    NotificationsModule,
    SupportModule,
    CmsModule,
    ContactModule,
    AdminModule,
    EmployeesModule,
  ],
})
export class AppModule { }
