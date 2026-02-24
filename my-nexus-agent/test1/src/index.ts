import { AutonomousAgent, Vault, WalletManager, ProviderFactory } from '@bch-agent/sdk';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

async function main() {
    console.log(chalk.cyan("🛡️ BCH Agent Starting..."));
    
    // 1. Load config
    const config = JSON.parse(fs.readFileSync('./agent.config.json', 'utf-8'));
    
    // 2. Load wallet
    const vaultPath = path.join(process.cwd(), '.vault', 'main.vault.json');
    if (!fs.existsSync(vaultPath)) {
        console.error("❌ main.vault.json not found. Run 'bch-agent wallet create' and 'wallet save' first.");
        return;
    }
    const mnemonic = Vault.loadFromVault('default', vaultPath);
    const ownerPrivKey = WalletManager.deriveKeyPair(mnemonic, 0);

    // 3. Initialize Agent
    const deployment = config.deployments?.["test1"];
    
    const agent = new AutonomousAgent({
        name: "test1",
        agentId: deployment?.agentId,
        network: config.network,
        artifactPath: path.join(process.cwd(), 'contracts', 'test1.json'),
        provider: ProviderFactory.getProvider(config.network),
        ownerPrivKey: ownerPrivKey,
        llmApiKey: config.ai.apiKey,
        model: config.ai.model
    });

    await agent.initialize();
    console.log(chalk.green("🚀 Agent ONLINE on " + config.network));
    console.log("   Address: " + agent.getAddress());

    // Main Autonomous Loop
    const cycle = async () => {
        try {
            await agent.runAutonomousCycle("Autonomous maintenance cycle.");
        } catch (e: any) {
            console.error(chalk.red("❌ Cycle Error:"), e.message);
        }
    };

    // Initial run
    await cycle();
    
    // Schedule (15 mins)
    setInterval(cycle, 15 * 60 * 1000);
}

main().catch(console.error);