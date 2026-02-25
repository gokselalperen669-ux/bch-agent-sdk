import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { SyncService } from '../../utils/sync.js';
import { getAuth } from '../../utils/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const agentCommand = new Command('agent')
    .description('Manage and run autonomous agents');

agentCommand
    .command('create')
    .description('Generate a new agent with contract and logic')
    .argument('<name>', 'Name of the agent')
    .option('-t, --type <type>', 'Agent type (defi, nft, social, vault)', 'vault')
    .action((name: string, options: any) => {
        // Check Authentication
        const session = getAuth();
        if (!session.user) {
            console.log(chalk.red('\n❌ Authentication required.'));
            console.log(chalk.white('   You must be logged in to manage agents.'));
            console.log(chalk.cyan(`   Please run: ${chalk.bold('bch-agent login')}`));
            return;
        }

        const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '');
        const type = options.type.toLowerCase();

        console.log(chalk.cyan(`🤖 Generating ${chalk.bold(type.toUpperCase())} Agent: ${chalk.bold(sanitizedName)}...`));
        console.log(chalk.gray(`   Creator: ${session.user.email}\n`));

        // 1. Template Selection
        const templateName = `${options.type.charAt(0).toUpperCase() + options.type.slice(1)}Agent`;
        let contractCode = '';

        const possiblePaths = [
            path.join(__dirname, '..', '..', '..', 'contracts', 'templates', `${templateName}.cash`),
            path.join(__dirname, '..', '..', 'contracts', 'templates', `${templateName}.cash`)
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                contractCode = fs.readFileSync(p, 'utf-8');
                break;
            }
        }

        if (!contractCode) {
            // Fallback
            contractCode = `pragma cashscript ^0.12.0;\n\ncontract ${sanitizedName}(pubkey ownerPk, bytes20 agentId) {\n    function execute(sig ownerSig) {\n        require(checkSig(ownerSig, ownerPk));\n    }\n}`;
        } else {
            // Rename contract class in template (Case insensitive to match DeFiAgent vs DefiAgent)
            contractCode = contractCode.replace(new RegExp(templateName, 'gi'), sanitizedName);
        }

        const contractPath = path.join(process.cwd(), 'contracts', `${sanitizedName}.cash`);
        fs.writeFileSync(contractPath, contractCode);

        // 2. Create Agent Logic
        const agentLogic = `import { AutonomousAgent, Vault, WalletManager, ProviderFactory } from '@bch-agent/sdk';
import * as fs from 'fs';
import chalk from 'chalk';

async function main() {
    console.log(chalk.cyan("🛡️ Initializing ${sanitizedName} (${type.toUpperCase()})..."));
    
    // Load config
    const config = JSON.parse(fs.readFileSync('./agent.config.json', 'utf-8'));
    
    // Load wallet (Prefer agent-treasury, fallback to main)
    const vaultName = fs.existsSync('./.vault/agent-treasury.vault.json') ? 'agent-treasury' : 'main';
    const vaultPath = \`./.vault/\${vaultName}.vault.json\`;
    
    if (!fs.existsSync(vaultPath)) {
        console.error(chalk.red(\`❌ Wallet not found at \${vaultPath}. Run 'bch-agent wallet setup' first.\`));
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
    const deployment = config.deployments?.["${sanitizedName}"];
    
    const agent = new AutonomousAgent({
        name: "${sanitizedName}",
        agentId: deployment?.agentId,
        network: config.network || "testnet4",
        artifactPath: "./contracts/${sanitizedName}.json",
        provider: ProviderFactory.getProvider(config.network),
        ownerPrivKey: ownerPrivKey,
        llmApiKey: apiKey,
        model: config.ai?.model
    });

    await agent.initialize();
    console.log(chalk.green("🚀 ${sanitizedName} is ONLINE on " + config.network));
    
    // Initial sync
    await SyncService.syncStatus("${sanitizedName}", "online");

    // Loop
    setInterval(async () => {
        try {
            await agent.runAutonomousCycle("System Heartbeat");
            await SyncService.syncStatus("${sanitizedName}", "online");
        } catch (e: any) {
            console.error(chalk.red("❌ Cycle Error:"), e.message);
            await SyncService.syncStatus("${sanitizedName}", "error");
        }
    }, 600000); // 10 minutes
}

main().catch(console.error);
`;
        const logicDir = path.join(process.cwd(), 'agents');
        if (!fs.existsSync(logicDir)) fs.mkdirSync(logicDir, { recursive: true });
        const logicPath = path.join(logicDir, `${sanitizedName}.ts`);
        fs.writeFileSync(logicPath, agentLogic);

        // 3. Update local config
        const configPath = path.join(process.cwd(), 'agent.config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (!config.agents) config.agents = {};
            config.agents[sanitizedName] = {
                type,
                createdAt: new Date().toISOString(),
                status: 'offline' // Not yet deployed
            };
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        }

        // 4. Sync with Web Profile (API)
        console.log(chalk.yellow('☁️  Syncing agent with Cloud Dashboard...'));
        SyncService.syncAgent(sanitizedName, type, `Created via CLI by ${session.user?.email || 'System'}`)
            .then(() => {
                console.log(chalk.green('✅ Agent synced successfully!'));
                console.log(chalk.gray(`Contracts: contracts/${sanitizedName}.cash`));
                console.log(chalk.gray(`Logic:     src/${sanitizedName}.ts`));
            })
            .catch(err => {
                console.warn(chalk.yellow('⚠️  Sync delayed. Is the API running?'));
            });
    });

