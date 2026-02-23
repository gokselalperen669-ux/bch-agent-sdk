import { Contract, NetworkProvider } from 'cashscript';
import { ECPairInterface } from 'ecpair';

export interface AgentConfig {
    name: string;
    network: 'mainnet' | 'testnet' | 'regtest';
    provider: NetworkProvider;
    ownerPrivKey: ECPairInterface;
}

export interface AgentState {
    agentId: string;
    commitment: string;
    balance: number;
}

export abstract class BchAgent {
    public name: string;
    public network: string;
    protected provider: NetworkProvider;
    protected ownerPrivKey: ECPairInterface;
    protected contract?: Contract;

    constructor(config: AgentConfig) {
        this.name = config.name;
        this.network = config.network;
        this.provider = config.provider;
        this.ownerPrivKey = config.ownerPrivKey;
    }

    abstract initialize(): Promise<void>;
    abstract executeAction(actionName: string, params: any[]): Promise<string>;
    abstract syncState(): Promise<AgentState>;

    public getAddress(): string | undefined {
        return this.contract?.address;
    }
}
