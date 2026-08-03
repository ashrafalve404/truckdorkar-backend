import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    private formatPhoneNumber;
    sendOtp(phone: string, otp: string): Promise<boolean>;
}
