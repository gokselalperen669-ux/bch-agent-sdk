import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.bch-agent');
const CONFIG_FILE = path.join(CONFIG_DIR, 'auth.json');

export interface AuthConfig {
    user: {
        id: string;
        email: string;
        name: string;
        token: string;
    } | null;
    apiUrl?: string;
}

export const getAuth = (): AuthConfig => {
    if (!fs.existsSync(CONFIG_FILE)) {
        return { user: null };
    }
    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {
        return { user: null };
    }
};

export const saveAuth = (auth: AuthConfig) => {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(auth, null, 2));
};

export const clearAuth = () => {
    if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE);
    }
};
