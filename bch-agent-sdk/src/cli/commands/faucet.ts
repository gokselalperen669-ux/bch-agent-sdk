import { Command } from 'commander';
import chalk from 'chalk';

export const faucetCommand = new Command('faucet')
    .description('Get free Testnet4 BCH for development')
    .argument('[address]', 'BCH Testnet4 address')
    .action(async (address: string) => {
        console.log(chalk.bold.cyan('\n🚰 BCH Testnet4 Faucet Helper\n'));

        if (!address) {
            console.log(chalk.yellow('💡 Usage: bch-agent faucet <your-testnet-address>'));
            console.log(chalk.gray('   To get your address run: bch-agent wallet balance main\n'));
        } else {
            console.log(chalk.white(`   Requesting funds for: ${chalk.bold.yellow(address)}`));
            console.log(chalk.gray('   Connecting to public faucet nodes...\n'));
        }

        console.log(chalk.white('🔗 Popular Testnet4 Faucets:'));
        console.log(chalk.blue('   - https://tbch.goog-py.com/ (Recommended)'));
        console.log(chalk.blue('   - https://faucet.fullstack.cash/'));
        console.log(chalk.blue('   - https://testnet4.cash/faucet\n'));

        console.log(chalk.green('✅ Instructions:'));
        console.log(chalk.white('   1. Copy your address above.'));
        console.log(chalk.white('   2. Visit one of the links.'));
        console.log(chalk.white('   3. Paste and receive your test BCH.\n'));
    });
