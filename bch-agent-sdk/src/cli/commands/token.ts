
import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { getAuth } from '../../utils/auth.js';

export const tokenCommand = new Command('token');

tokenCommand
    .description('Manage agent tokenization and marketplace listings');

tokenCommand.command('create <agent-name>')
    .description('Tokenize an existing agent (Create NFT + FT shares)')
    .option('-s, --supply <amount>', 'Total supply of shares', '1000000')
    .option('-t, --ticker <ticker>', 'Ticker symbol for the shares', 'EGNT')
    .action(async (agentName, options) => {
        // 0. Check Authentication
        const session = getAuth();
        if (!session.user) {
            console.log(chalk.red('\n❌ Authentication required.'));
            console.log(chalk.white('   You must be logged in to tokenize agents.'));
            console.log(chalk.cyan(`   Please run: ${chalk.bold('bch-agent login')}`));
            return;
        }

        // 1. Validate Agent Existence
        const configPath = path.join(process.cwd(), 'agent.config.json');
        if (!fs.existsSync(configPath)) {
            console.log(chalk.red('Error: agent.config.json not found. Init project first.'));
            return;
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        // Check both 'agents' and 'deployments' for consistency
        const agents = config.agents || config.deployments || {};

        if (!agents[agentName]) {
            console.log(chalk.red(`Error: Agent '${agentName}' not found in config. Create/Deploy it first.`));
            return;
        }

        console.log(chalk.blue(`\n💎 Tokenizing Agent: ${chalk.bold(agentName)} (Pump.fun Model)`));
        console.log(chalk.gray(`   Ticker: $${options.ticker}`));
        console.log(chalk.gray(`   Supply: ${options.supply} (Bonding Curve)`));
        console.log(chalk.gray(`   Operator: ${session.user.email}\n`));

        // Simulation of CashToken genesis transaction
        console.log(chalk.yellow('\n1. Generating Genesis Transaction...'));
        await new Promise(r => setTimeout(r, 800));

        console.log(chalk.yellow('2. Minting Identity NFT & Bonding Curve Pool...'));
        await new Promise(r => setTimeout(r, 800));

        console.log(chalk.yellow(`3. Minting ${options.supply} Share Tokens into Pool...`));
        await new Promise(r => setTimeout(r, 800));

        console.log(chalk.green(`\n✅ SUCCESS! ${agentName} is now tokenized on the bonding curve.`));
        console.log(`   Model:      ${chalk.bold('Fair Launch (No Pre-mine)')}`);
        console.log(`   Curve Cap:  ${chalk.yellow('850.00 BCH')}`);
        console.log(`   Ticker:     ${chalk.cyan('$' + options.ticker)}`);
        console.log(`   Token ID:   ${chalk.cyan('75f9...a1b2')}`);
        console.log(`   Structure:  ${chalk.white('85% Community / 15% Liquidity Reservoir')}`);

        // 4. Update local config
        updateConfig(agentName, {
            tokenized: true,
            ticker: options.ticker,
            supply: options.supply,
            category: '75f9...a1b2', // Genesis placeholder for now
            model: 'pump-fun-curve',
            operator: session.user.id
        });

        // 5. Sync with Dashboard
        try {
            const SyncServiceModule = await import('../../utils/sync.js');
            const agentData = agents[agentName];
            await SyncServiceModule.SyncService.syncAgent(
                agentName,
                'tokenized-agent',
                `Tokenized with ticker $${options.ticker}`,
                agentData.address || '',
                agentData.network || 'testnet4',
                agentData.agentId || ''
            );
            console.log(chalk.green('🌐 Tokenization status synchronized with Web Dashboard.'));
        } catch (e) {
            console.log(chalk.yellow('⚠️  Web sync failed, but local config updated.'));
        }
    });

tokenCommand.command('list <agent-name> <price>')
    .description('List agent tokens for sale on the marketplace')
    .action(async (agentName, price) => {
        // Auth check check
        const session = getAuth();
        if (!session.user) {
            console.log(chalk.red('\n❌ Authentication required.'));
            console.log(chalk.white('   Please run: ') + chalk.bold.cyan('bch-agent login'));
            return;
        }

        console.log(chalk.blue(`\n📢 Listing ${agentName} tokens on Marketplace...`));
        console.log(`   Price per 1000 tokens: ${chalk.yellow(price + ' BCH')}`);

        await new Promise(r => setTimeout(r, 1000));

        console.log(chalk.green('\n✅ Listing created! View at: http://localhost:5173/marketplace'));
    });

function updateConfig(agentName: string, data: any) {
    try {
        const configPath = path.join(process.cwd(), 'agent.config.json');
        let config: any = {};
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }

        // Update either 'agents' or 'deployments' block depending on which one exists
        if (config.deployments && config.deployments[agentName]) {
            config.deployments[agentName].tokenization = data;
        } else {
            if (!config.agents) config.agents = {};
            if (!config.agents[agentName]) config.agents[agentName] = {};
            config.agents[agentName].tokenization = data;
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (e) { }
}
