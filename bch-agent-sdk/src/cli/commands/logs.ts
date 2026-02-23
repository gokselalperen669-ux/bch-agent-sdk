import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export const logsCommand = new Command('logs')
    .description('Stream or view autonomous agent logs')
    .argument('<agent-name>', 'Name of the agent')
    .option('-f, --follow', 'Follow log output', false)
    .option('-n, --lines <number>', 'Number of lines to show', '20')
    .action((agentName: string, options: any) => {
        const logFile = path.join(process.cwd(), '.logs', `${agentName}.log`);

        console.log(chalk.bold.cyan(`\n📑 Viewing Logs for Agent: ${agentName}`));
        console.log(chalk.gray(`Path: ${logFile}\n`));

        if (!fs.existsSync(logFile)) {
            console.log(chalk.yellow(`⚠️ No log file found for "${agentName}".`));
            console.log(chalk.gray(`💡 Logs are created when the agent runs its autonomous cycle (npm start).\n`));
            return;
        }

        const linesToShow = parseInt(options.lines);
        const content = fs.readFileSync(logFile, 'utf-8');
        const lines = content.trim().split('\n');
        const tail = lines.slice(-linesToShow);

        tail.forEach(line => {
            if (line.includes('[AI]')) console.log(chalk.magenta(line));
            else if (line.includes('[ERROR]')) console.log(chalk.red(line));
            else if (line.includes('[WARN]')) console.log(chalk.yellow(line));
            else console.log(chalk.gray(line));
        });

        if (options.follow) {
            console.log(chalk.blue('\n👀 Watching for new logs... (Ctrl+C to stop)'));
            fs.watchFile(logFile, (curr, prev) => {
                if (curr.mtime > prev.mtime) {
                    const updatedContent = fs.readFileSync(logFile, 'utf-8');
                    const updatedLines = updatedContent.trim().split('\n');
                    console.log(chalk.gray(updatedLines[updatedLines.length - 1]));
                }
            });
        }
    });
