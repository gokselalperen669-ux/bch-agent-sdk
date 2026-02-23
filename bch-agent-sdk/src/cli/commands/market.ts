import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';

export const marketCommand = new Command('market')
    .description('View real-time BCH market data and network status')
    .action(async () => {
        console.log(chalk.bold.cyan('\n📊 BCH Market & Network Status\n'));

        try {
            // Price Data from CoinGecko (no API key needed for basic)
            const priceRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd,btc&include_24hr_change=true');
            const data = priceRes.data['bitcoin-cash'];

            console.log(chalk.white('💰 Price Data:'));
            console.log(`   - USD: ${chalk.bold.green('$' + data.usd.toFixed(2))} (${data.usd_24h_change.toFixed(2)}%)`);
            console.log(`   - BTC: ${chalk.bold.yellow(data.btc.toFixed(8))} BTC`);

            console.log(chalk.white('\n🌐 Network Context:'));
            // Fetching block height from a public explorer API
            const blockRes = await axios.get('https://chipnet.imaginary.cash/api/v1/status');
            const height = blockRes.data?.height || 'N/A';

            console.log(`   - Height: ${chalk.cyan(height)}`);
            console.log(`   - Fees:   ${chalk.green('~1.0 sat/byte')} (Standard)`);

            console.log(chalk.gray(`\nUpdated at: ${new Date().toLocaleTimeString()}\n`));

        } catch (e: any) {
            console.error(chalk.red(`❌ Could not fetch market data: ${e.message}`));
        }
    });
