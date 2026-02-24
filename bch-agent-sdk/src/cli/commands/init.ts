import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

export const initCommand = new Command('init')
    .description('Initialize a new BCH Agent project environment')
    .argument('[project-name]', 'Name of the project folder')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .option('-n, --network <net>', 'Network (testnet4, mainnet, chipnet)', 'testnet4')
    .option('-a, --ai <provider>', 'AI Provider (openai, anthropic, local, none)', 'openai')
    .action(async (projectName, options) => {
        console.log(chalk.bold.cyan('\n🛡️  BCH Agent Framework - Project Initializer\n'));

        let answers;
        if (options.yes) {
            answers = {
                name: projectName || 'my-bch-agent',
                network: options.network || 'testnet4',
                aiProvider: options.ai || 'openai',
                gitInit: true
            };
        } else {
            answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Project name:',
                    default: projectName || 'my-bch-agent',
                    validate: (input) => input.length > 0 ? true : 'Project name is required'
                },
                {
                    type: 'list',
                    name: 'network',
                    message: 'Target Network:',
                    choices: [
                        { name: 'Testnet4 (Development - Recommended)', value: 'testnet4' },
                        { name: 'Mainnet (Production)', value: 'mainnet' },
                        { name: 'Chipnet (Staging)', value: 'chipnet' }
                    ],
                    default: 'testnet4'
                },
                {
                    type: 'list',
                    name: 'aiProvider',
                    message: 'AI LLM Provider:',
                    choices: [
                        { name: 'OpenAI (GPT-4)', value: 'openai' },
                        { name: 'Anthropic (Claude)', value: 'anthropic' },
                        { name: 'Local / Ollama', value: 'local' },
                        { name: 'None (Logic Only)', value: 'none' }
                    ],
                    default: 'openai'
                },
                {
                    type: 'confirm',
                    name: 'gitInit',
                    message: 'Initialize git repository?',
                    default: true
                }
            ]);
        }

        const projectDir = path.join(process.cwd(), answers.name);
        if (fs.existsSync(projectDir)) {
            console.error(chalk.red(`❌ Error: Directory "${answers.name}" already exists.`));
            return;
        }

        console.log(chalk.yellow(`\n🚀 Setting up ${answers.name}...`));

        // Create folder structure
        fs.mkdirSync(projectDir);
        fs.mkdirSync(path.join(projectDir, 'contracts'));
        fs.mkdirSync(path.join(projectDir, 'src'));
        fs.mkdirSync(path.join(projectDir, '.vault'));

        // Create a local package.json
        const pkgJson = {
            name: answers.name,
            version: '1.0.0',
            type: 'module',
            dependencies: {
                "@bch-agent/sdk": "^1.0.0"
            },
            scripts: {
                "start": "tsc && node dist/index.js",
                "build": "tsc",
                "dev": "tsc -w"
            }
        };
        fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

        // Create tsconfig.json
        const tsConfig = {
            "compilerOptions": {
                "target": "ESNext",
                "module": "ESNext",
                "moduleResolution": "node",
                "outDir": "./dist",
                "rootDir": "./src",
                "strict": true,
                "esModuleInterop": true,
                "skipLibCheck": true
            },
            "include": ["src/**/*"]
        };
        fs.writeFileSync(path.join(projectDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

        // Create agent config
        const config = {
            name: answers.name,
            network: answers.network,
            ai: {
                provider: answers.aiProvider,
                model: answers.aiProvider === 'openai' ? 'gpt-4-turbo' : 'claude-3-opus',
                apiKey: "YOUR_API_KEY"
            }
        };
        fs.writeFileSync(path.join(projectDir, 'agent.config.json'), JSON.stringify(config, null, 2));

        // Create sample contract
        const sampleContract = `pragma cashscript ^0.12.0;

/**
 * ${answers.name} - Autonomous Agent Contract
 * Network: ${answers.network}
 */
contract ${answers.name.replace(/[^a-zA-Z0-9]/g, '')}(pubkey ownerPk, bytes20 agentId) {
    function execute(sig ownerSig) {
        require(checkSig(ownerSig, ownerPk));
    }

    function withdraw(sig ownerSig, int amount) {
        require(checkSig(ownerSig, ownerPk));
        require(amount > 0);
    }
}`;
        fs.writeFileSync(path.join(projectDir, 'contracts', `${answers.name}.cash`), sampleContract);

        // Create runner script
        const runnerScript = `import { AutonomousAgent, Vault, WalletManager, ProviderFactory } from '@bch-agent/sdk';
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
    const deployment = config.deployments?.["${answers.name}"];
    
    const agent = new AutonomousAgent({
        name: "${answers.name}",
        agentId: deployment?.agentId,
        network: config.network,
        artifactPath: path.join(process.cwd(), 'contracts', '${answers.name}.json'),
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

main().catch(console.error);`;
        fs.writeFileSync(path.join(projectDir, 'src', 'index.ts'), runnerScript);

        // .gitignore
        fs.writeFileSync(path.join(projectDir, '.gitignore'), `node_modules\ndist\n.vault/*.json\n.env\nagent.config.json\n`);

        // Dockerfile
        const dockerfileContent = `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN if [ -f \"tsconfig.json\" ]; then npx tsc; fi
# Use global or local bch-agent for production loop
CMD [\"npx\", \"bch-agent\", \"start\", \"${answers.name}\"]`;
        fs.writeFileSync(path.join(projectDir, 'Dockerfile'), dockerfileContent);

        // docker-compose.yml
        const composeContent = `version: '3.8'
services:
  agent:
    build: .
    volumes:
      - ./.vault:/app/.vault
    environment:
      - AGENT_API_URL=\${AGENT_API_URL:-http://localhost:4000}
      - AGENT_CONFIG_PASSWORD=default
    restart: always
`;
        fs.writeFileSync(path.join(projectDir, 'docker-compose.yml'), composeContent);

        console.log(chalk.green(`\n✅ Project "${answers.name}" initialized successfully!`));
        console.log(chalk.white(`\n👉 Next steps:`));
        console.log(chalk.gray(`   1. cd ${answers.name}`));
        console.log(chalk.gray(`   2. npm install`));
        console.log(chalk.gray(`   3. bch-agent login`));
        console.log(chalk.gray(`   4. bch-agent wallet setup`));
        console.log(chalk.gray(`   5. bch-agent compile`));
        console.log(chalk.gray(`   6. bch-agent deploy ${answers.name}`));
        console.log(chalk.gray(`   7. bch-agent start ${answers.name} (7/24 loop)`));
    });


