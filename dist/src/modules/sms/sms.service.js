"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SmsService = SmsService_1 = class SmsService {
    configService;
    logger = new common_1.Logger(SmsService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    formatPhoneNumber(phone) {
        let clean = phone.replace(/[^0-9]/g, '');
        if (clean.startsWith('880'))
            return clean;
        if (clean.startsWith('0'))
            return '88' + clean;
        if (clean.length === 10)
            return '880' + clean;
        return clean;
    }
    async sendOtp(phone, otp) {
        const apiKey = this.configService.get('SMS_API_KEY') || 'SoWjbF7rLC5Ec5upd5xu';
        const senderId = this.configService.get('SMS_SENDER_ID') || '8809617625732';
        const baseUrl = this.configService.get('SMS_API_URL') || 'http://bulksmsbd.net/api/smsapi';
        const formattedPhone = this.formatPhoneNumber(phone);
        const message = `Your TruckDorkar OTP code is ${otp}. Valid for 5 minutes. Do not share it with anyone.`;
        try {
            this.logger.log(`Sending SMS OTP to ${formattedPhone} via BulkSMS BD...`);
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
        }
        catch (error) {
            this.logger.error(`Failed to send SMS to ${formattedPhone}: ${error?.message || error}`);
            return true;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map