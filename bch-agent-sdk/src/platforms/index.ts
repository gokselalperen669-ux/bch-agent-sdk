
export interface Platform {
    id: string;
    name: string;
    type: 'defi' | 'wallet' | 'social' | 'payment';
    connect(): Promise<boolean>;
    disconnect(): Promise<boolean>;
    getStatus(): Promise<string>;
}

export abstract class BasePlatform implements Platform {
    constructor(public id: string, public name: string, public type: Platform['type']) { }

    abstract connect(): Promise<boolean>;
    abstract disconnect(): Promise<boolean>;

    async getStatus(): Promise<string> {
        return 'disconnected';
    }
}

export class PlatformManager {
    private platforms: Map<string, Platform> = new Map();

    register(platform: Platform) {
        this.platforms.set(platform.id, platform);
    }

    get(id: string): Platform | undefined {
        return this.platforms.get(id);
    }

    list(): Platform[] {
        return Array.from(this.platforms.values());
    }
}
