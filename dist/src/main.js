"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet = __importStar(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 3001);
    const apiPrefix = configService.get('API_PREFIX', 'api');
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3000');
    app.use(helmet.default({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: [
            'https://truckdorkar.com',
            'https://www.truckdorkar.com',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
        ],
        credentials: true,
    });
    app.setGlobalPrefix(apiPrefix);
    app.enableVersioning({ type: common_1.VersioningType.URI });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('TruckDorkar API')
        .setDescription('Production-ready REST API for TruckDorkar Logistics Platform — Bangladesh\'s premier truck booking service.')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'access-token')
        .addTag('auth', 'Authentication & Authorization')
        .addTag('users', 'User Management')
        .addTag('drivers', 'Driver Management')
        .addTag('trucks', 'Truck Management')
        .addTag('bookings', 'Booking Management')
        .addTag('quotations', 'Quotation System')
        .addTag('reviews', 'Reviews & Ratings')
        .addTag('notifications', 'Notification System')
        .addTag('support', 'Support Tickets')
        .addTag('cms', 'Content Management')
        .addTag('contact', 'Contact Enquiries')
        .addTag('admin', 'Admin Dashboard')
        .addTag('agents', 'Agent Management')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    await app.listen(port);
    const logger = new common_1.Logger('Bootstrap');
    logger.log(`🚚 TruckDorkar API running on: http://localhost:${port}/${apiPrefix}`);
    logger.log(`📖 Swagger Docs: http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map