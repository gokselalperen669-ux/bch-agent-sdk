import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { AutonomousAgent } from '../../core/autonomous-agent.js';
import { Vault } from '../../utils/vault.js';
import { WalletManager } from '../../utils/wallet.js';
import { ProviderFactory } from '../../network/provider.js';
import { SyncService } from '../../utils/sync.js';

export const startCommand = new Command('start')
    .description('Start an autonomous agent 7/24 execution loop')
    .argument('<agent-name>', 'Name of the agent to start')
    .option('-i, --interval <minutes>', 'Execution interval in minutes', '15')
    .option('--now', 'Run immediately on start', true)
    .action(async (agentName: string, options: any) => {
        console.log(chalk.bold.cyan(`\n🛡️  BCH Agent Runner - Starting ${agentName}\n`));

        const configPath = path.join(process.cwd(), 'agent.config.json');
        if (!fs.existsSync(configPath)) {
            console.error(chalk.red('❌ Error: agent.config.json not found. Run "bch-agent init" first.'));
            return;
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const deployment = config.deployments?.[agentName];

        if (!deployment) {
            console.error(chalk.red(`❌ Error: Agent "${agentName}" is not deployed. Run "bch-agent deploy ${agentName}" first.`));
            return;
        }

        // 1. Load wallet
        const vaultPath = path.join(process.cwd(), '.vault', 'main.vault.json');
        if (!fs.existsSync(vaultPath)) {
            console.error(chalk.red('❌ Error: main.vault.json not found. Set up your wallet first.'));
            return;
        }

        try {
            // In a real scenario, we might prompt for password if not in ENV
            const vaultPassword = process.env.AGENT_CONFIG_PASSWORD || 'default';
            const mnemonic = Vault.loadFromVault(vaultPassword, vaultPath);
            const ownerPrivKey = WalletManager.deriveKeyPair(mnemonic, 0);

            let apiKey = config.ai?.apiKey;
            if (config.ai?.encryptedKey) {
                const vaultPassword = process.env.AGENT_CONFIG_PASSWORD || 'default';
                try {
                    const enc = config.ai.encryptedKey;
                    apiKey = Vault.decrypt(enc.iv, enc.content, vaultPassword, enc.salt, enc.tag);
                } catch (e) {
                    throw new Error("Failed to decrypt AI key. Check your password.");
                }
            }

            // 2. Initialize Agent
            const agent = new AutonomousAgent({
                name: agentName,
                agentId: deployment.agentId,
                network: config.network || 'testnet4',
                artifactPath: path.join(process.cwd(), 'contracts', `${agentName}.json`),
                provider: ProviderFactory.getProvider(config.network),
                ownerPrivKey: ownerPrivKey,
                llmApiKey: apiKey,
                model: config.ai?.model
            });

            await agent.initialize();

            console.log(chalk.green(`✅ Agent ${chalk.bold(agentName)} is ONLINE!`));
            console.log(chalk.white(`   Address:  ${chalk.bold(agent.getAddress())}`));
            console.log(chalk.white(`   Network:  ${chalk.bold(config.network)}`));
            console.log(chalk.white(`   Interval: ${chalk.bold(options.interval)} minutes\n`));

            // 3. Start Loop
            const intervalMs = parseInt(options.interval) * 60 * 1000;

            const runCycle = async () => {
                const timestamp = new Date().toLocaleTimeString();
                process.stdout.write(chalk.gray(`[${timestamp}] 🔄 Triggering cycle... `));

                try {
                    await agent.runAutonomousCycle("Scheduled maintenance.");
                    console.log(chalk.green("Success"));
                    await SyncService.syncStatus(agentName, 'online');
                } catch (e: any) {
                    console.log(chalk.red("Failed"));
                    console.error(chalk.red(`   Error: ${e.message}`));
                    await SyncService.syncLog(agentName, 'error', `Cycle failed: ${e.message}`);
                    await SyncService.syncStatus(agentName, 'error');
                }
            };

            // Initial Heartbeat
            await SyncService.syncStatus(agentName, 'online');

            if (options.now) await runCycle();

            const timer = setInterval(runCycle, intervalMs);

            // Handle Shutdown
            process.on('SIGINT', async () => {
                console.log(chalk.yellow('\n\n🛑 Shutting down gracefully...'));
                clearInterval(timer);
                await SyncService.syncStatus(agentName, 'offline');
                console.log(chalk.gray('👋 Goodbye.'));
                process.exit(0);
            });

            // Keep process alive
            console.log(chalk.blue('🚀 7/24 autonomous loop active. Press Ctrl+C to stop.\n'));

        } catch (e: any) {
            console.error(chalk.red(`❌ Startup failed: ${e.message}`));
        }
    });
