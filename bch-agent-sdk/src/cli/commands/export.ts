import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export const exportCommand = new Command('export')
    .description('Export an agent project for standalone deployment')
    .argument('<agent-name>', 'Name of the agent to export')
    .option('-o, --output <dir>', 'Output directory', './dist-agent')
    .action(async (agentName: string, options: any) => {
        console.log(chalk.bold.cyan(`\n📦 Exporting Agent: ${agentName}...\n`));

        const outputDir = path.resolve(process.cwd(), options.output);
        const contractsDir = path.join(process.cwd(), 'contracts');
        const srcDir = path.join(process.cwd(), 'src');
        const configPath = path.join(process.cwd(), 'agent.config.json');

        try {
            // 1. Validation
            const artifactPath = path.join(contractsDir, `${agentName}.json`);
            const logicPath = path.join(srcDir, `${agentName}.ts`);

            if (!fs.existsSync(artifactPath)) {
                throw new Error(`Artifact ${agentName}.json not found. Did you compile?`);
            }
            if (!fs.existsSync(logicPath)) {
                throw new Error(`Logic src/${agentName}.ts not found.`);
            }

            // 2. Setup Output Dir
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // 3. Copy Assets
            fs.copyFileSync(artifactPath, path.join(outputDir, 'artifact.json'));
            fs.copyFileSync(logicPath, path.join(outputDir, 'agent.ts'));

            // 4. Generate package.json
            const pkg = {
                name: `agent-${agentName.toLowerCase()}`,
                version: "1.0.0",
                type: "module",
                scripts: {
                    "start": "node index.js"
                },
                dependencies: {
                    "@bch-agent/sdk": "^1.0.0",
                    "dotenv": "^16.0.0",
                    "chalk": "^5.0.0"
                }
            };
            fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify(pkg, null, 2));

            // 5. Generate index.js (bootstrap)
            const bootstrap = `import './agent.js';\n// Entry point for the agent logic`;
            fs.writeFileSync(path.join(outputDir, 'index.js'), bootstrap);

            // 6. Generate Dockerfile
            const dockerfile = `FROM node:20-slim\nWORKDIR /app\nCOPY package.json ./\nRUN npm install\nCOPY . .\nCMD ["npm", "start"]`;
            fs.writeFileSync(path.join(outputDir, 'Dockerfile'), dockerfile);

            // 7. Generate .env.example
            const envExample = `BCH_NETWORK=testnet4\nAI_API_KEY=your_key_here\nAI_PROVIDER=openai\nAI_MODEL=gpt-4o\nMNEMONIC="your twelve words here"`;
            fs.writeFileSync(path.join(outputDir, '.env.example'), envExample);

            console.log(chalk.green(`✅ Agent exported successfully to: ${outputDir}`));
            console.log(chalk.white('\nNext steps:'));
            console.log(chalk.gray(`  1. cd ${options.output}`));
            console.log(chalk.gray('  2. npm install'));
            console.log(chalk.gray('  3. Configure .env'));
            console.log(chalk.gray('  4. node index.js\n'));

        } catch (e: any) {
            console.error(chalk.red(`❌ Export failed: ${e.message}`));
        }
    });
