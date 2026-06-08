import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private config;
    private readonly logger;
    private readonly uploadDir;
    private readonly driver;
    constructor(config: ConfigService);
    save(file: Express.Multer.File, folder?: string): Promise<string>;
    private saveLocal;
    delete(fileUrl: string): Promise<void>;
    private ensureDir;
}
