import { Command } from 'commander';
import { WalletManager } from '../../utils/wallet.js';
import { Vault } from '../../utils/vault.js';
import { ProviderFactory } from '../../network/provider.js';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Contract, SignatureTemplate } from 'cashscript';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { SyncService } from '../../utils/sync.js';

export const walletCommand = new Command('wallet')
    .description('BCH Wallet management for agents');

walletCommand
    .command('setup')
    .description('Interactive wallet setup (Create & Save)')
    .action(async () => {
        console.log(chalk.bold.cyan('\n💳 Wallet Setup Assistant\n'));
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    { name: 'Generate a new wallet', value: 'create' },
                    { name: 'Import an existing mnemonic', value: 'import' }
                ]
            }
        ]);

        let mnemonic = '';
        if (action === 'create') {
            mnemonic = WalletManager.generateMnemonic();
            console.log(chalk.green('\n✨ New Mnemonic Generated:'));
            console.log(chalk.bold.yellow(mnemonic));
            console.log(chalk.red('\n⚠️  SAVE THIS PHRASE! You will not see it again.\n'));
        } else {
            const res = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'mnemonic',
                    message: 'Enter your 12-word recovery phrase:'
                }
            ]);
            mnemonic = res.mnemonic;
        }

        const { name, password, agentId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Wallet name (Use "agent-treasury" for agents):',
                default: 'agent-treasury'
            },
            {
                type: 'input',
                name: 'agentId',
                message: 'Agent ID to associate with (Optional):',
                default: ''
            },
            {
                type: 'password',
                name: 'password',
                message: 'Set a password for this vault:',
                default: 'default'
            }
        ]);

        const vaultDir = path.join(process.cwd(), '.vault');
        if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir);

        const vaultPath = path.join(vaultDir, `${name}.vault.json`);
        Vault.saveToVault(mnemonic, password, vaultPath);

        // Sync with Web Profile
        const address = WalletManager.deriveAddress(mnemonic, 0, 'testnet');
        SyncService.syncWallet(name, address, agentId);

        console.log(chalk.green(`\n✅ Wallet "${name}" saved securely!`));
        console.log(chalk.gray(`Path: .vault/${name}.vault.json\n`));
    });

walletCommand
    .command('create')
    .description('Create a new agent wallet (display only)')
    .action(() => {
        const mnemonic = WalletManager.generateMnemonic();
        const address = WalletManager.deriveAddress(mnemonic, 0, 'testnet');

        console.log(chalk.green('\n✨ New HD Wallet Generated (Not Saved)'));
        console.log(chalk.cyan('🔐 Mnemonic: '), chalk.bold.yellow(mnemonic));
        console.log(chalk.cyan('🏠 Address (Testnet): '), chalk.white(address));
        console.log(chalk.red('\n⚠️  IMPORTANT: Use "wallet save" to store it securely.\n'));
    });

walletCommand
    .command('save')
    .description('Securely save a mnemonic to a vault file')
    .argument('<mnemonic>', '12-word recovery phrase')
    .option('-p, --password <pwd>', 'Encryption password', 'default')
    .option('-n, --name <name>', 'Wallet name', 'main')
    .option('-a, --agent <id>', 'Associate with Agent ID', '')
    .action((mnemonic: string, options: any) => {
        const vaultDir = path.join(process.cwd(), '.vault');
        if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir);

        const vaultPath = path.join(vaultDir, `${options.name}.vault.json`);
        Vault.saveToVault(mnemonic, options.password, vaultPath);

        const address = WalletManager.deriveAddress(mnemonic, 0, 'testnet');
        SyncService.syncWallet(options.name, address, options.agent);

        console.log(chalk.green(`✅ Wallet "${options.name}" saved securely.`));
    });

walletCommand
    .command('balance')
    .description('Check the balance of a saved wallet')
    .argument('<name>', 'Wallet name (e.g. "main")')
    .option('-p, --password <pwd>', 'Vault password', 'default')
    .option('-n, --network <network>', 'Network (mainnet, testnet4)', 'testnet4')
    .action(async (name: string, options: any) => {
        try {
            const vaultPath = path.join(process.cwd(), '.vault', `${name}.vault.json`);
            if (!fs.existsSync(vaultPath)) throw new Error('Wallet not found');

            const mnemonic = Vault.loadFromVault(options.password, vaultPath);
            const address = WalletManager.deriveAddress(mnemonic, 0, options.network === 'mainnet' ? 'mainnet' : 'testnet');

            console.log(chalk.yellow(`🔍 Querying ${options.network} balance for ${address}...`));

            const provider = ProviderFactory.getProvider(options.network);
            const utxos = await provider.getUtxos(address);
            const balance = utxos.reduce((total: bigint, utxo: any) => total + utxo.satoshis, 0n);

            console.log(chalk.bold.green(`💰 Balance: ${Number(balance) / 100_000_000} BCH`));
            console.log(chalk.gray(`(${balance} satoshis)`));
        } catch (e: any) {
            console.error(chalk.red(`❌ Error: ${e.message}`));
        }
    });

walletCommand
    .command('list')
    .description('List saved wallets in the vault')
    .action(() => {
        const vaultDir = path.join(process.cwd(), '.vault');
        if (!fs.existsSync(vaultDir) || fs.readdirSync(vaultDir).length === 0) {
            console.log(chalk.gray('📂 Vault is empty.'));
            return;
        }

        const wallets = fs.readdirSync(vaultDir).filter(f => f.endsWith('.vault.json'));
        console.log(chalk.bold('📂 Saved Wallets:'));
        wallets.forEach(w => console.log(chalk.cyan(` - ${w.replace('.vault.json', '')}`)));
    });

walletCommand
    .command('derive')
    .description('Derive a key from an existing mnemonic')
    .argument('<mnemonic>', '12-word recovery phrase')
    .option('-i, --index <number>', 'Address index', '0')
    .option('-n, --network <network>', 'Network (mainnet, testnet)', 'testnet')
    .action((mnemonic: string, options: any) => {
        const index = parseInt(options.index);
        const keyPair = WalletManager.deriveKeyPair(mnemonic, index);
        const address = WalletManager.deriveAddress(mnemonic, index, options.network);

        console.log(chalk.bold.green(`🔑 Key derived at index ${index} (${options.network}):`));
        console.log(chalk.cyan(`💳 Public Key: ${Buffer.from(keyPair.publicKey).toString('hex')}`));
        console.log(chalk.cyan(`🏠 Address:    ${address}`));
    });

walletCommand
    .command('send')
    .description('Send BCH from a saved wallet to another address')
    .argument('<name>', 'Wallet name')
    .argument('<to>', 'Recipient address')
    .argument('<amount>', 'Amount in satoshis')
    .option('-p, --password <pwd>', 'Vault password', 'default')
    .option('-n, --network <network>', 'Network (mainnet, testnet4)', 'testnet4')
    .action(async (name: string, to: string, amount: string, options: any) => {
        try {
            const vaultPath = path.join(process.cwd(), '.vault', `${name}.vault.json`);
            if (!fs.existsSync(vaultPath)) throw new Error('Wallet not found');

            const mnemonic = Vault.loadFromVault(options.password, vaultPath);
            const keyPair = WalletManager.deriveKeyPair(mnemonic, 0);
            const provider = ProviderFactory.getProvider(options.network);

            // P2PKH Artifact for spending from a standard address
            const p2pkhArtifact: any = {
                contractName: 'P2PKH',
                constructorInputs: [{ name: 'pkh', type: 'bytes20' }],
                functions: [{ name: 'spend', inputs: [{ name: 'pk', type: 'pubkey' }, { name: 's', type: 'sig' }] }],
                bytecode: '76a9147588ac' // OP_DUP OP_HASH160 OP_PUSH20(pkh) OP_EQUALVERIFY OP_CHECKSIG
            };

            const pubKey = Buffer.from(keyPair.publicKey);
            const sha256 = crypto.createHash('sha256').update(pubKey).digest();
            const pkh = crypto.createHash('ripemd160').update(sha256).digest();

            const contract = new Contract(p2pkhArtifact, [pkh], { provider }) as any;

            console.log(`📤 Sending ${amount} satoshis from ${name} to ${to}...`);

            const signer = new SignatureTemplate(keyPair.privateKey!);
            const tx = await contract.functions
                .spend(pubKey, signer)
                .to(to, BigInt(amount))
                .send();


            console.log(`✅ Transaction sent!`);
            console.log(`🔗 TXID: ${tx.txid}`);
        } catch (e: any) {
            console.error(`❌ Error sending funds: ${e.message}`);
        }
    });


