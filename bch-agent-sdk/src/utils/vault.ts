import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export class Vault {
    private static ALGORITHM = 'aes-256-gcm'; // Upgraded to GCM for authentication
    private static ITERATIONS = 100000;
    private static KEY_LENGTH = 32;

    /**
     * Encrypt data with a password using PBKDF2 and AES-256-GCM
     */
    static encrypt(text: string, password: string): { iv: string; content: string; salt: string; tag: string } {
        const salt = crypto.randomBytes(16);
        const iv = crypto.randomBytes(12); // GCM prefers 12 bytes
        const key = crypto.pbkdf2Sync(password, salt, this.ITERATIONS, this.KEY_LENGTH, 'sha512');

        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv) as crypto.CipherGCM;
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex'),
            salt: salt.toString('hex'),
            tag: tag.toString('hex')
        };
    }

    /**
     * Decrypt data with a password
     */
    static decrypt(iv: string, content: string, password: string, salt: string, tag: string): string {
        const key = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), this.ITERATIONS, this.KEY_LENGTH, 'sha512');
        const decipher = crypto.createDecipheriv(this.ALGORITHM, key, Buffer.from(iv, 'hex')) as crypto.DecipherGCM;
        decipher.setAuthTag(Buffer.from(tag, 'hex'));

        const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
        return decrypted.toString('utf8');
    }

    /**
     * Save encrypted mnemonic to a local vault file
     */
    static saveToVault(mnemonic: string, password: string, filePath: string): void {
        const encrypted = this.encrypt(mnemonic, password);
        fs.writeFileSync(filePath, JSON.stringify(encrypted, null, 2));
    }

    /**
     * Load and decrypt mnemonic from vault file
     */
    static loadFromVault(password: string, filePath: string): string {
        if (!fs.existsSync(filePath)) throw new Error('Vault file not found');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return this.decrypt(data.iv, data.content, password, data.salt, data.tag);
    }
}
