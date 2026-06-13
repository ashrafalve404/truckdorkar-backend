"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const drivers_module_1 = require("./modules/drivers/drivers.module");
const trucks_module_1 = require("./modules/trucks/trucks.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const quotations_module_1 = require("./modules/quotations/quotations.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const support_module_1 = require("./modules/support/support.module");
const cms_module_1 = require("./modules/cms/cms.module");
const contact_module_1 = require("./modules/contact/contact.module");
const admin_module_1 = require("./modules/admin/admin.module");
const agents_module_1 = require("./modules/agents/agents.module");
const storage_module_1 = require("./modules/storage/storage.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            storage_module_1.StorageModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            drivers_module_1.DriversModule,
            trucks_module_1.TrucksModule,
            bookings_module_1.BookingsModule,
            quotations_module_1.QuotationsModule,
            reviews_module_1.ReviewsModule,
            notifications_module_1.NotificationsModule,
            support_module_1.SupportModule,
            cms_module_1.CmsModule,
            contact_module_1.ContactModule,
            admin_module_1.AdminModule,
            agents_module_1.AgentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map