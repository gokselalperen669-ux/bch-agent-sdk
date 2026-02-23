import { Command } from 'commander';
import { clearAuth } from '../../utils/auth.js';
import chalk from 'chalk';

export const logoutCommand = new Command('logout')
    .description('Logout from your BCH Agent account')
    .action(() => {
        clearAuth();
        console.log(chalk.green('\n✅ Successfully logged out.'));
        console.log(chalk.gray('   Local session cleared.\n'));
    });
