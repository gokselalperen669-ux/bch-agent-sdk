import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export const doctorCommand = new Command('doctor')
    .description('Check system for BCH Agent Framework requirements')
    .action(async () => {
        console.log(chalk.bold.cyan('\n🩺 BCH Agent System Health Check\n'));

        const checks = [
            {
                name: 'Node.js Version',
                check: async () => {
                    const version = process.version;
                    const major = parseInt(version.slice(1).split('.')[0]);
                    return { ok: major >= 18, message: version };
                }
            },
            {
                name: 'Environment Config',
                check: async () => {
                    const exists = fs.existsSync(path.join(process.cwd(), 'agent.config.json'));
                    return { ok: exists, message: exists ? 'Found' : 'Missing (Run init)' };
                }
            },
            {
                name: 'Vault Directory',
                check: async () => {
                    const exists = fs.existsSync(path.join(process.cwd(), '.vault'));
                    return { ok: exists, message: exists ? 'Found' : 'Missing (Run wallet setup)' };
                }
            },
            {
                name: 'Git Installation',
                check: async () => {
                    try {
                        execSync('git --version', { stdio: 'ignore' });
                        return { ok: true, message: 'Installed' };
                    } catch {
                        return { ok: false, message: 'Not found' };
                    }
                }
            },
            {
                name: 'AI Configuration',
                check: async () => {
                    const configPath = path.join(process.cwd(), 'agent.config.json');
                    if (!fs.existsSync(configPath)) return { ok: false, message: 'N/A' };
                    try {
                        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                        const hasAi = !!config.ai?.apiKey;
                        const provider = config.ai?.provider || 'Unknown';
                        return { ok: hasAi, message: hasAi ? `${provider} set` : 'API Key Missing' };
                    } catch {
                        return { ok: false, message: 'Config Corrupt' };
                    }
                }
            },
            {
                name: 'API Connectivity',
                check: async () => {
                    try {
                        const API_URL = process.env.AGENT_API_URL || 'http://localhost:4000';
                        const res = await fetch(`${API_URL}/health`);
                        if (res.ok) return { ok: true, message: 'Connected' };
                        return { ok: false, message: `Error: ${res.status}` };
                    } catch {
                        return { ok: false, message: `Backend Offline (Target: ${process.env.AGENT_API_URL || 'http://localhost:4000'})` };
                    }
                }
            },
            {
                name: 'Network Status',
                check: async () => {
                    try {
                        const res = await fetch('https://chipnet.imaginary.cash/api/v1/status');
                        const data = await res.json();
                        return { ok: !!data.height, message: data.height ? `Synced (Height: ${data.height})` : 'Syncing...' };
                    } catch {
                        return { ok: false, message: 'BCH Node Unreachable' };
                    }
                }
            }
        ];

        let allOk = true;
        for (const c of checks) {
            const res = await c.check();
            if (!res.ok) allOk = false;
            const icon = res.ok ? chalk.green('✓') : chalk.red('✗');
            console.log(`${icon} ${chalk.white(c.name.padEnd(20))} : ${res.ok ? chalk.green(res.message) : chalk.red(res.message)}`);
        }

        if (allOk) {
            console.log(chalk.bold.green('\n✨ Everything looks great! Your environment is ready.\n'));
        } else {
            console.log(chalk.bold.yellow('\n⚠️  Some issues were found. Please fix them for optimal performance.\n'));
        }
    });
