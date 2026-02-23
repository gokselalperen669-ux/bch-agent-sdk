import { ElectrumNetworkProvider, NetworkProvider } from 'cashscript';

export enum NetworkType {
    MAINNET = 'mainnet',
    TESTNET = 'testnet4', // Using testnet4 as it's the current chip-ready testnet
    REGTEST = 'regtest'
}

export class ProviderFactory {
    /**
     * Create a network provider based on the type
     */
    static getProvider(network: string = 'testnet'): NetworkProvider {
        switch (network) {
            case 'mainnet':
                return new ElectrumNetworkProvider('mainnet');
            case 'testnet':
            case 'testnet4':
                return new ElectrumNetworkProvider('testnet4');
            case 'chipnet':
                return new ElectrumNetworkProvider('chipnet');
            default:
                return new ElectrumNetworkProvider('testnet4');
        }
    }
}
