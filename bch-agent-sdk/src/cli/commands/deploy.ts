import { Command } from 'commander';
import { Contract } from 'cashscript';
import { Vault } from '../../utils/vault.js';
import { WalletManager } from '../../utils/wallet.js';
import { ProviderFactory } from '../../network/provider.js';
import { getAuth } from '../../utils/auth.js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import chalk from 'chalk';

export const deployCommand = new Command('deploy')
    .description('Deploy an agent instance to the BCH network')
    .argument('<agent-name>', 'Name of the agent (e.g. "MyBot")')
    .option('-w, --wallet <wallet>', 'Vault wallet to use as owner', 'main')
    .option('-p, --password <password>', 'Vault password', 'default')
    .option('-n, --network <network>', 'Network (mainnet, testnet4)', 'testnet4')
    .option('-l, --limit <satoshis>', 'Transaction spending limit', '100000') // 0.001 BCH default limit
    .action(async (agentName: string, options: any) => {
        try {
            // Check Authentication
            const session = getAuth();
            if (!session.user) {
                console.log(chalk.red('\n❌ Authentication required.'));
                console.log(chalk.white('   Deploying agents requires a verified Web Account.'));
                console.log(chalk.cyan('   Opening Browser to Login/Register...'));

                const DASHBOARD_URL = process.env.AGENT_DASHBOARD_URL || 'http://localhost:5173';
                const url = `${DASHBOARD_URL}/login`;
                const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
                require('child_process').exec(`${start} ${url}`);

                console.log(chalk.gray(`\n   Alternatively, run: ${chalk.bold('bch-agent login')}\n`));
                return;
            }

            console.log(chalk.bold.cyan(`\n🚀 Deploying Agent: ${agentName}...`));
            console.log(chalk.gray(`   Operator: ${session.user.email}\n`));

            // 1. Check for artifact
            const artifactPath = path.join(process.cwd(), 'contracts', `${agentName}.json`);
            if (!fs.existsSync(artifactPath)) {
                throw new Error(`Compiled artifact not found for ${agentName}. Run "bch-agent compile" first.`);
            }
            const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'));

            // 2. Load Owner Wallet
            const vaultPath = path.join(process.cwd(), '.vault', `${options.wallet}.vault.json`);
            if (!fs.existsSync(vaultPath)) {
                throw new Error(`Wallet "${options.wallet}" not found in vault. Create one first.`);
            }
            const mnemonic = Vault.loadFromVault(options.password, vaultPath);
            const ownerKeyPair = WalletManager.deriveKeyPair(mnemonic, 0);
            const ownerPubKey = Buffer.from(ownerKeyPair.publicKey);

            // 3. Prepare Agent Identity
            const agentIdSeed = `${options.wallet}-${agentName}`;
            const agentId = crypto.createHash('sha256').update(agentIdSeed).digest().slice(0, 20);

            // 4. Initialize Network Provider
            const provider = ProviderFactory.getProvider(options.network);

            // 5. Instantiate Contract with Constructor Args
            const constructorArgs: any[] = [ownerPubKey, agentId];

            // If the artifact expects a 3rd parameter (like DeFi maximum amount), add it
            if (artifact.constructorInputs && artifact.constructorInputs.length > 2) {
                constructorArgs.push(BigInt(options.limit));
                console.log(chalk.yellow(`🛡️  Spending Limit active: ${options.limit} satoshis/tx`));
            }

            const contract = new Contract(artifact, constructorArgs, { provider });

            console.log(chalk.green('✅ Contract Instance Created:'));
            console.log(`${chalk.white('   Address:')}  ${chalk.bold.yellow(contract.address)}`);
            console.log(`${chalk.white('   Agent ID:')} ${chalk.gray(agentId.toString('hex'))}`);
            console.log(`${chalk.white('   Network:')}  ${chalk.bold(options.network)}`);

            // 6. Check if funded
            const balance = await contract.getBalance();

            if (balance === 0n) {
                console.log(chalk.yellow('\n⚠️  Agent is not yet active on-chain (0 balance).'));
                console.log(chalk.white(`   Please send some ${chalk.bold(options.network)} BCH to activate it.`));
                console.log(chalk.gray(`   Run: bch-agent wallet send ${options.wallet} ${contract.address} 10000 --network ${options.network}`));
            } else {
                console.log(chalk.bold.green(`\n💰 Agent is ONLINE with ${Number(balance) / 100_000_000} BCH balance.`));
            }

            // Save deployment info to config
            const configPath = path.join(process.cwd(), 'agent.config.json');
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

            if (!config.deployments) config.deployments = {};
            config.deployments[agentName] = {
                address: contract.address,
                agentId: agentId.toString('hex'),
                network: options.network,
                owner: options.wallet,
                deployedAt: new Date().toISOString(),
                limit: options.limit
            };

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            console.log(chalk.gray('\n📝 Deployment record updated in agent.config.json'));

            // 7. Register with Web Dashboard (API)
            try {
                const SyncServiceModule = await import('../../utils/sync.js');
                await SyncServiceModule.SyncService.syncAgent(
                    agentName,
                    artifact.contractName.toLowerCase().includes('defi') ? 'defi' : 'general',
                    `Deployed via CLI to ${options.network}`,
                    contract.address,
                    options.network,
                    agentId.toString('hex')
                );
                console.log(chalk.green('🌐 Agent synchronized with Web Dashboard.'));
            } catch (err: any) {
                console.log(chalk.yellow(`⚠️  Could not sync with Web Dashboard: ${err.message}`));
            }

            console.log('\n');

        } catch (e: any) {
            console.error(chalk.red(`❌ Deployment failed: ${e.message}`));
        }
    });
