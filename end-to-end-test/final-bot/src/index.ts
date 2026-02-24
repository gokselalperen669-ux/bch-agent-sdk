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
    const deployment = config.deployments?.["final-bot"];
    
    const agent = new AutonomousAgent({
        name: "final-bot",
        agentId: deployment?.agentId,
        network: config.network,
        artifactPath: path.join(process.cwd(), 'contracts', 'final-bot.json'),
        provider: ProviderFactory.getProvider(config.network),
        ownerPrivKey: ownerPrivKey,
        llmApiKey: config.ai.apiKey,
        model: config.ai.model
    });

    await agent.initialize();
    console.log("🚀 Agent Address:", agent.getAddress());
    console.log("🟢 Agent Status: ACTIVE on " + config.network);

    await agent.runAutonomousCycle("Startup initialization complete.");
}

main().catch(console.error);