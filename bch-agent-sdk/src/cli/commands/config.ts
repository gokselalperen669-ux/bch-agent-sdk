import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export const configCommand = new Command('config')
    .description('Configure framework settings and API keys');

configCommand
    .command('set-ai')
    .description('Set current LLM configuration')
    .argument('<api-key>', 'Your API key')
    .option('-p, --provider <provider>', 'AI Provider (openai, anthropic, deepseek, local)', 'openai')
    .option('-m, --model <model>', 'Model to use', 'gpt-4o')
    .action(async (apiKey: string, options: any) => {
        const { Vault } = await import('../../utils/vault.js');
        const inquirer = (await import('inquirer')).default;

        const configPath = path.join(process.cwd(), 'agent.config.json');
        let config: any = {};

        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        }

        console.log(chalk.yellow('\n🔐 For maximum security, AI keys are stored encrypted.'));
        const { password } = await inquirer.prompt([{
            type: 'password',
            name: 'password',
            message: 'Set/Enter a password to encrypt this key:',
            default: 'default'
        }]);

        const encrypted = Vault.encrypt(apiKey, password);

        config.ai = {
            provider: options.provider,
            model: options.model,
            encryptedKey: encrypted
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(chalk.bold.green(`\n✅ AI Configuration saved (Encrypted)!`));
        console.log(`${chalk.white('   Provider:')} ${chalk.bold(options.provider)}`);
        console.log(`${chalk.white('   Model:')}    ${chalk.bold(options.model)}\n`);
    });

configCommand
    .command('show')
    .description('Show current project configuration')
    .action(() => {
        const configPath = path.join(process.cwd(), 'agent.config.json');
        if (!fs.existsSync(configPath)) {
            console.log(chalk.red('\n❌ No configuration file (agent.config.json) found.\n'));
            return;
        }
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        console.log(chalk.bold.cyan('\n🛡️  Current Project Configuration:\n'));
        console.log(chalk.white(JSON.stringify(config, null, 2)));
        console.log('');
    });

