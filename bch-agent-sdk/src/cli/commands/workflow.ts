import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { getAuth } from '../../utils/auth.js';

export const workflowCommand = new Command('workflow')
    .description('Show the logical next step for your agent project')
    .action(async () => {
        console.log(chalk.bold.cyan('\n🛤️  BCH Agent - Intelligent Workflow Guide\n'));

        const cwd = process.cwd();
        const configPath = path.join(cwd, 'agent.config.json');
        const vaultDir = path.join(cwd, '.vault');
        const contractsDir = path.join(cwd, 'contracts');
        const auth = getAuth();

        let step = 1;
        const printStep = (title: string, desc: string, cmd: string, active: boolean) => {
            const color = active ? chalk.bold.green : chalk.gray;
            const prefix = active ? chalk.bold.green('👉 STEP ' + step + ':') : chalk.gray('   STEP ' + step + ':');
            console.log(`${prefix} ${color(title)}`);
            console.log(chalk.gray(`          ${desc}`));
            if (active) console.log(chalk.white(`          Command: ${chalk.bold.yellow(cmd)}`));
            console.log('');
            step++;
            return active;
        };

        // Step 1: Init
        const needsInit = !fs.existsSync(configPath);
        if (printStep('Initialize Project', 'Create the foundation of your BCH Agent.', 'bch-agent init', needsInit)) return;

        // Step 2: Login
        const needsLogin = !auth.user;
        if (printStep('Authentication', 'Connect your local CLI to the Nexus Cloud.', 'bch-agent login', needsLogin)) return;

        // Step 3: Wallet
        const needsWallet = !fs.existsSync(vaultDir) || fs.readdirSync(vaultDir).length === 0;
        if (printStep('Vault Setup', 'Secure your private keys and fund your treasury.', 'bch-agent wallet setup', needsWallet)) return;

        // Step 4: Agent Create
        const needsAgent = !fs.existsSync(contractsDir) || fs.readdirSync(contractsDir).filter(f => f.endsWith('.cash')).length === 0;
        if (printStep('Create Agent', 'Generate smart contracts and autonomous logic.', 'bch-agent agent create <name>', needsAgent)) return;

        // Step 5: Compile
        const needsCompile = fs.existsSync(contractsDir) && fs.readdirSync(contractsDir).filter(f => f.endsWith('.cash')).length > 0 &&
            fs.readdirSync(contractsDir).filter(f => f.endsWith('.json')).length === 0;
        if (printStep('Compile Contracts', 'Prepare your on-chain logic for deployment.', 'bch-agent compile', needsCompile)) return;

        // Step 6: Deploy
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const needsDeploy = !config.deployments || Object.keys(config.deployments).length === 0;
        if (printStep('Deploy On-Chain', 'Instantiate your agent on the Bitcoin Cash network.', 'bch-agent deploy <name>', needsDeploy)) return;

        // Step 7: Run
        printStep('Launch 7/24 Loop', 'Your agent is ready for autonomous execution.', 'bch-agent start <name>', true);

        console.log(chalk.green('🚀 Your environment is fully configured and ready for action!\n'));
    });
