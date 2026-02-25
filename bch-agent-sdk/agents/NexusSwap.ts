import { AutonomousAgent, Vault, WalletManager, ProviderFactory, SyncService } from '@bch-agent/sdk';
import * as fs from 'fs';
import chalk from 'chalk';

async function main() {
    console.log(chalk.cyan("🛡️ Initializing NexusSwap (DEFI)..."));

    // Load config
    const config = JSON.parse(fs.readFileSync('./agent.config.json', 'utf-8'));

    // Load wallet (Prefer agent-treasury, fallback to main)
    const vaultName = fs.existsSync('./.vault/agent-treasury.vault.json') ? 'agent-treasury' : 'main';
    const vaultPath = `./.vault/${vaultName}.vault.json`;

    if (!fs.existsSync(vaultPath)) {
        console.error(chalk.red(`❌ Wallet not found at ${vaultPath}. Run 'bch-agent wallet setup' first.`));
        process.exit(1);
    }

    const mnemonic = Vault.loadFromVault('default', vaultPath);
    const ownerPrivKey = WalletManager.deriveKeyPair(mnemonic, 0);

    let apiKey = config.ai?.apiKey;
    if (config.ai?.encryptedKey) {
        console.log(chalk.yellow("🔐 AI Configuration is encrypted."));
        // In a real production setup, you might use process.env or a secure prompt
        // For this SDK, we'll try 'default' or look for an ENV variable
        const password = process.env.AGENT_CONFIG_PASSWORD || 'default';
        try {
            const enc = config.ai.encryptedKey;
            apiKey = Vault.decrypt(enc.iv, enc.content, password, enc.salt, enc.tag);
        } catch (e) {
            console.error(chalk.red("❌ Failed to decrypt AI key. Set AGENT_CONFIG_PASSWORD env var."));
            process.exit(1);
        }
    }

    // Load deployment info if available
    const deployment = config.deployments?.["NexusSwap"];

    const agent = new AutonomousAgent({
        name: "NexusSwap",
        agentId: deployment?.agentId,
        network: config.network || "testnet4",
        artifactPath: "./contracts/NexusSwap.json",
        provider: ProviderFactory.getProvider(config.network),
        ownerPrivKey: ownerPrivKey,
        llmApiKey: apiKey,
        model: config.ai?.model
    });

    await agent.initialize();
    console.log(chalk.green("🚀 NexusSwap is ONLINE on " + config.network));

    // Initial sync
    await SyncService.syncStatus("NexusSwap", "online");

    // Loop
    setInterval(async () => {
        try {
            await agent.runAutonomousCycle("System Heartbeat");
            await SyncService.syncStatus("NexusSwap", "online");
        } catch (e: any) {
            console.error(chalk.red("❌ Cycle Error:"), e.message);
            await SyncService.syncStatus("NexusSwap", "error");
        }
    }, 600000); // 10 minutes
}

main().catch(console.error);
