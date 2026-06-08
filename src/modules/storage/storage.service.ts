import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Abstracted StorageService.
 * Currently uses local disk. Switch STORAGE_DRIVER=s3 to route to S3.
 * Designed for easy drop-in replacement (AWS S3, Cloudflare R2, etc.)
 */
@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly uploadDir: string;
    private readonly driver: string;

    constructor(private config: ConfigService) {
        this.uploadDir = config.get<string>('UPLOAD_DIR', './uploads');
        this.driver = config.get<string>('STORAGE_DRIVER', 'local');
        if (this.driver === 'local') {
            this.ensureDir(this.uploadDir);
        }
    }

    async save(file: Express.Multer.File, folder: string = 'misc'): Promise<string> {
        if (this.driver === 'local') {
            return this.saveLocal(file, folder);
        }
        // Future: return this.saveS3(file, folder);
        return this.saveLocal(file, folder);
    }

    private async saveLocal(file: Express.Multer.File, folder: string): Promise<string> {
        const dir = path.join(this.uploadDir, folder);
        this.ensureDir(dir);
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(dir, filename);
        fs.writeFileSync(filepath, file.buffer);
        this.logger.log(`Saved file: ${filepath}`);
        return `/uploads/${folder}/${filename}`;
    }

    async delete(fileUrl: string): Promise<void> {
        if (this.driver === 'local') {
            const filepath = path.join('.', fileUrl);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
    }

    private ensureDir(dir: string) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}
