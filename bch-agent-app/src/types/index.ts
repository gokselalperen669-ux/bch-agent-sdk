export interface InventoryItem {
    id: string;
    agentId: string;
    name: string;
    type: 'nft' | 'lp_token' | 'other';
    value: string;
    acquiredAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    token?: string;
    inventory?: InventoryItem[];
}

export interface Agent {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    userId: string;
    agentId?: string;
    ticker?: string;
    supply?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'online';
    liquidity?: string;
    description?: string;
}

export interface Log {
    id: string | number;
    agentName: string;
    action: string;
    timestamp: string;
}

export interface Wallet {
    id: string;
    name: string;
    address: string;
    userId: string;
    createdAt: string;
    balance?: string;
    agentId?: string;
}
