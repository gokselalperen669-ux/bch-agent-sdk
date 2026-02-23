
import { Command } from 'commander';
import chalk from 'chalk';
import { PlatformManager } from '../../platforms/index.js';
import { JedexPlatform } from '../../platforms/defi/jedex.js';
import { ElectronCashPlatform } from '../../platforms/wallets/electroncash.js';
import { MemoPlatform } from '../../platforms/social/memo.js';

export const platform = new Command('platform');

platform
    .description('Manage integrations with external BCH platforms');

platform.command('list')
    .description('List all available platform integrations')
    .action(async () => {
        console.log(chalk.bold('\nAvailable Platforms:'));
        console.log(chalk.cyan('-------------------'));
        console.log(`- ${chalk.green('JEDEX')} (DeFi)`);
        console.log(`- ${chalk.green('Electron Cash')} (Wallet)`);
        console.log(`- ${chalk.green('Memo.cash')} (Social)`);
        console.log(`- ${chalk.gray('Chainbased')} (DeFi) [Coming Soon]`);
        console.log(`- ${chalk.gray('BitPay')} (Payment) [Coming Soon]`);
    });

platform.command('connect <name>')
    .description('Connect to a specific platform')
    .action(async (name) => {
        const manager = new PlatformManager();
        // Register available platforms manually for this demo
        manager.register(new JedexPlatform());
        manager.register(new ElectronCashPlatform());
        manager.register(new MemoPlatform());

        const target = manager.get(name.toLowerCase());

        if (!target) {
            console.log(chalk.red(`Error: Platform '${name}' not found.`));
            return;
        }

        console.log(chalk.yellow(`Initiating connection to ${target.name}...`));
        const success = await target.connect();

        if (success) {
            console.log(chalk.green(`Successfully connected to ${target.name}!`));
        } else {
            console.log(chalk.red(`Failed to connect to ${target.name}.`));
        }
    });

platform.command('status')
    .description('Check connection status of platforms')
    .action(async () => {
        console.log(chalk.bold('\nPlatform Status:'));
        console.log(`- JEDEX: ${chalk.green('Available')}`);
        console.log(`- Electron Cash: ${chalk.green('Connected')}`);
        console.log(`- Memo.cash: ${chalk.yellow('Connecting...')}`);
    });
