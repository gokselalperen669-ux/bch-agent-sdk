import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory, ECPairInterface } from 'ecpair';
import { BIP32Factory } from 'bip32';
import * as crypto from 'crypto';
import * as cashaddr from 'cashaddrjs';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

export class WalletManager {
    /**
     * Generate a new 12-word mnemonic
     */
    static generateMnemonic(): string {
        return bip39.generateMnemonic();
    }

    /**
     * Derive a BCH key pair from a mnemonic
     * Following BIP44 path for BCH (m/44'/145'/0'/0/0)
     */
    static deriveKeyPair(mnemonic: string, index: number = 0): ECPairInterface {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const root = bip32.fromSeed(seed);
        const path = `m/44'/145'/0'/0/${index}`;
        const child = root.derivePath(path);

        return ECPair.fromPrivateKey(child.privateKey!);
    }

    /**
     * Get public key from mnemonic
     */
    static getPublicKey(mnemonic: string, index: number = 0): Buffer {
        const keyPair = this.deriveKeyPair(mnemonic, index);
        return Buffer.from(keyPair.publicKey);
    }

    /**
     * Derive BCH Cash Address (P2PKH) from mnemonic
     */
    static deriveAddress(mnemonic: string, index: number = 0, network: string = 'bitcoincash'): string {
        const pubKey = this.getPublicKey(mnemonic, index);

        // Hash160: ripemd160(sha256(pubkey))
        const sha256 = crypto.createHash('sha256').update(pubKey).digest();
        const hash160 = crypto.createHash('ripemd160').update(sha256).digest();

        const prefix = network === 'mainnet' ? 'bitcoincash' : 'bchtest';
        return cashaddr.encode(prefix, 'P2PKH', new Uint8Array(hash160));
    }
}
