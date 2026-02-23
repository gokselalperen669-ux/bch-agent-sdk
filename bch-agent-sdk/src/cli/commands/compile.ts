import { Command } from 'commander';
import { compileFile } from 'cashc';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

export const compileCommand = new Command('compile')
    .description('Compile CashScript contracts')
    .option('-p, --path <path>', 'Contract file path', './contracts')
    .action(async (options) => {
        const contractsDir = path.isAbsolute(options.path)
            ? options.path
            : path.join(process.cwd(), options.path);

        if (!fs.existsSync(contractsDir)) {
            console.error(chalk.red(`❌ Error: Contracts directory not found at ${contractsDir}`));
            return;
        }

        const files = fs.readdirSync(contractsDir).filter(f => f.endsWith('.cash'));

        console.log(chalk.yellow(`🔨 Compiling ${files.length} contracts...`));

        for (const file of files) {
            const filePath = path.join(contractsDir, file);
            try {
                const artifact = compileFile(filePath);
                const artifactPath = path.join(contractsDir, file.replace('.cash', '.json'));
                fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
                console.log(chalk.green(`✅ Compiled: ${chalk.bold(file)} -> ${path.basename(artifactPath)}`));
            } catch (e: any) {
                console.error(chalk.red(`❌ Failed to compile ${file}:`), e.message);
            }
        }
    });

