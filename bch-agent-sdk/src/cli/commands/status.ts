import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export const statusCommand = new Command('status')
    .description('Check the current status of your BCH Agent project')
    .action(() => {
        const configPath = path.join(process.cwd(), 'agent.config.json');

        console.log(chalk.bold.cyan('\n🛡️  BCH Agent Project Status\n'));

        if (!fs.existsSync(configPath)) {
            console.log(chalk.red('❌ No active BCH Agent project found in this directory.'));
            console.log(chalk.gray('💡 Use "bch-agent init" to start a new project.\n'));
            return;
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        console.log(`${chalk.white('Project:')}  ${chalk.bold.green(config.name)}`);
        console.log(`${chalk.white('Network:')}  ${chalk.bold.yellow(config.network)}`);
        console.log(`${chalk.white('AI Engine:')} ${chalk.bold.blue(config.ai?.provider || 'None')}`);

        const contractsDir = path.join(process.cwd(), 'contracts');
        if (fs.existsSync(contractsDir)) {
            const contracts = fs.readdirSync(contractsDir).filter(f => f.endsWith('.cash'));
            const artifacts = fs.readdirSync(contractsDir).filter(f => f.endsWith('.json'));
            console.log(`${chalk.white('Contracts:')} ${chalk.cyan(contracts.length)} (.cash) / ${chalk.cyan(artifacts.length)} (compiled)`);
            contracts.forEach(c => console.log(chalk.gray(` - ${c}`)));
        }

        const vaultDir = path.join(process.cwd(), '.vault');
        if (fs.existsSync(vaultDir)) {
            const wallets = fs.readdirSync(vaultDir).filter(f => f.endsWith('.vault.json'));
            console.log(`${chalk.white('Wallets:')}   ${chalk.cyan(wallets.length)} saved in vault`);
            wallets.forEach(w => console.log(chalk.gray(` - ${w.replace('.vault.json', '')}`)));
        }

        if (config.deployments) {
            console.log(`\n${chalk.bold.white('Active Deployments:')}`);
            Object.keys(config.deployments).forEach(name => {
                const d = config.deployments[name];
                console.log(`${chalk.green('✓')} ${chalk.bold(name)} @ ${chalk.yellow(d.address)} (${d.network})`);
            });
        }

        if (config.agents) {
            console.log(`\n${chalk.bold.white('Tokenized Agents:')}`);
            Object.keys(config.agents).forEach(name => {
                const t = config.agents[name].tokenization;
                if (t) {
                    console.log(`${chalk.blue('💎')} ${chalk.bold(name)} -> $${chalk.cyan(t.ticker)} (Supply: ${t.supply})`);
                }
            });
        }

        console.log('');
    });

