import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    constructor(private configService: ConfigService) { }

    /**
     * Standardizes Bangladeshi Phone Numbers to 8801XXXXXXXX format
     */
    private formatPhoneNumber(phone: string): string {
        let clean = phone.replace(/[^0-9]/g, '');
        if (clean.startsWith('880')) return clean;
        if (clean.startsWith('0')) return '88' + clean;
        if (clean.length === 10) return '880' + clean;
        return clean;
    }

    /**
     * Sends OTP SMS using BulkSMS BD API
     */
    async sendOtp(phone: string, otp: string): Promise<boolean> {
        const apiKey = this.configService.get<string>('SMS_API_KEY') || 'SoWjbF7rLC5Ec5upd5xu';
        const senderId = this.configService.get<string>('SMS_SENDER_ID') || '8809617625732';
        const baseUrl = this.configService.get<string>('SMS_API_URL') || 'http://bulksmsbd.net/api/smsapi';

        const formattedPhone = this.formatPhoneNumber(phone);
        const message = `Your TruckDorkar OTP code is ${otp}. Valid for 5 minutes. Do not share it with anyone.`;

        try {
            this.logger.log(`Sending SMS OTP to ${formattedPhone} via BulkSMS BD...`);
            this.logger.log(`🔑 [DEV MODE OTP CODE]: ${otp} (for ${formattedPhone})`);

            const url = new URL(baseUrl);
            url.searchParams.append('api_key', apiKey);
            url.searchParams.append('type', 'text');
            url.searchParams.append('number', formattedPhone);
            url.searchParams.append('senderid', senderId);
            url.searchParams.append('message', message);

            const res = await fetch(url.toString(), { method: 'GET' });
            const data = await res.text();

            this.logger.log(`BulkSMS BD API Response for ${formattedPhone}: ${data}`);
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to send SMS to ${formattedPhone}: ${error?.message || error}`);
            return true;
        }
    }
}
