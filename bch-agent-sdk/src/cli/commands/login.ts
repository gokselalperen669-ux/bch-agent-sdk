import { Command } from 'commander';
import { saveAuth } from '../../utils/auth.js';
import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';

export const loginCommand = new Command('login')
    .description('Login to your BCH Agent account')
    .action(async () => {
        console.log(chalk.green('\n🛡️  BCH Agent Portal Access\n'));
        console.log(chalk.gray('   This CLI connects to the Nexus Protocol.'));
        console.log(chalk.gray('   New accounts are auto-initialized if not found.\n'));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'apiUrl',
                message: 'Enter your Nexus Portal URL:',
                default: process.env.AGENT_API_URL || 'http://localhost:4000',
                when: !process.env.AGENT_API_URL
            },
            {
                type: 'input',
                name: 'email',
                message: 'Enter your email:',
                validate: (input) => input.includes('@') || 'Please enter a valid email'
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your access key (Password):',
                mask: '*'
            }
        ]);

        const API_URL = process.env.AGENT_API_URL || answers.apiUrl || 'http://localhost:4000';

        try {
            console.log(chalk.cyan('🚀 Connecting to Nexus Protocol...'));

            let response;
            try {
                // Try Login
                response = await axios.post(`${API_URL}/auth/login`, {
                    email: answers.email,
                    password: answers.password
                });
            } catch (loginError: any) {
                // If user not found, try Register
                if (loginError.response?.status === 404) {
                    console.log(chalk.yellow('ℹ️  Identity not found. Initializing new account...'));
                    response = await axios.post(`${API_URL}/auth/register`, {
                        email: answers.email,
                        password: answers.password,
                        name: answers.email.split('@')[0]
                    });
                } else {
                    throw loginError;
                }
            }

            const user = response.data;
            saveAuth({ user, apiUrl: API_URL });

            console.log(chalk.green('\n✅ Access Granted!'));
            console.log(chalk.white(`   Identity: ${chalk.bold(user.name)}`));
            console.log(chalk.white(`   Email:    ${user.email}`));
            console.log(chalk.gray(`   Session:  ${user.token.substring(0, 15)}...`));
            console.log(chalk.gray('\nYou are now authenticated for CLI operations.'));

        } catch (error: any) {
            if (error.response?.status === 401) {
                console.log(chalk.red('\n❌ Invalid access key (Password).'));
            } else if (error.response?.status === 400) {
                console.log(chalk.red(`\n❌ Registration failed: ${error.response.data.error}`));
            } else {
                console.error(chalk.red('\n❌ Connection failed. Check your internet or API status.'));
                console.error(chalk.red(`   Target: ${API_URL}`));
            }
        }
    });
