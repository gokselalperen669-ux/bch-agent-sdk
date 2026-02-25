import { SyncService } from './dist/utils/sync.js';
import chalk from 'chalk';

async function testSync() {
    console.log(chalk.cyan("🧪 Simulating NexusSwap DeFi Agent Sync..."));

    // 1. Sync the Agent identity
    await SyncService.syncAgent(
        "NexusSwap",
        "defi",
        "Autonomous Liquidity Management & Arbitrage Agent. Powered by on-chain covenants.",
        "bitcoincash:pv3v57l3...", // Mock address
        "testnet4"
    );

    // 2. Sync an Initial Log with Proof-of-State visualization
    const mockHash = "a7b3c1d9e5f7a2b4c6d8e0f2a4b6c8d0e2f4a6b8";
    await SyncService.syncLog(
        "NexusSwap",
        "ai",
        `[Proof-of-State] Mental Cycle complete. Reasoning Hash: ${mockHash}. Executing on-chain audit.`
    );

    await SyncService.syncLog(
        "NexusSwap",
        "info",
        "NexusSwap is now monitoring DeFi liquidity pools on testnet4."
    );

    // 3. Set Status to Online
    await SyncService.syncStatus("NexusSwap", "online");

    console.log(chalk.green("✅ Test sync complete! NexusSwap should now be visible on the dashboard."));
}

testSync().catch(console.error);
