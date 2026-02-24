#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { compileCommand } from './commands/compile.js';
import { deployCommand } from './commands/deploy.js';
import { platform } from './commands/platform.js';
import { walletCommand } from './commands/wallet.js';
import { statusCommand } from './commands/status.js';
import { agentCommand } from './commands/agent.js';
import { configCommand } from './commands/config.js';
import { logsCommand } from './commands/logs.js';
import { testCommand } from './commands/test.js';
import { faucetCommand } from './commands/faucet.js';
import { exportCommand } from './commands/export.js';
import { doctorCommand } from './commands/doctor.js';
import { marketCommand } from './commands/market.js';
import { tokenCommand } from './commands/token.js';
import { loginCommand } from './commands/login.js';
import { logoutCommand } from './commands/logout.js';
import { startCommand } from './commands/start.js';
import { workflowCommand } from './commands/workflow.js';

const program = new Command();

program
    .name('bch-agent')
    .description('🛡️ BCH Agent Framework - Build autonomous on-chain AI agents')
    .version('1.0.0');

program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(initCommand);
program.addCommand(compileCommand);
program.addCommand(deployCommand);
program.addCommand(startCommand);
program.addCommand(workflowCommand);
program.addCommand(walletCommand);
program.addCommand(statusCommand);
program.addCommand(agentCommand);
program.addCommand(configCommand);
program.addCommand(logsCommand);
program.addCommand(testCommand);
program.addCommand(faucetCommand);
program.addCommand(exportCommand);
program.addCommand(doctorCommand);
program.addCommand(marketCommand);
program.addCommand(tokenCommand);
program.addCommand(platform);



// Tool Info Command
program
    .command('info')
    .description('Display framework information and system status')
    .action(() => {
        console.log('🛡️  BCH Agent Framework');
        console.log('   Version: 1.0.0');
        console.log('   Ecosystem: Bitcoin Cash (BCH)');
        console.log('   Tech: CashScript, CashTokens, LLM-DecisionEngine');
        console.log('   Status: Beta Development');
    });

program.parse(process.argv);
