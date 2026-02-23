import { BchAgent, AgentConfig, AgentState } from './agent.js';
import { Contract, SignatureTemplate } from 'cashscript';
import { AiEngine, AIProvider } from './ai-engine.js';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import * as crypto from 'crypto';

export interface AutonomousAgentConfig extends AgentConfig {
    artifactPath: string;
    agentId?: string;
    llmApiKey?: string;
    model?: string;
    aiProvider?: AIProvider;
}

export class AutonomousAgent extends BchAgent {
    protected artifactPath: string;
    protected aiEngine?: AiEngine;
    protected agentId: Buffer;

    constructor(config: AutonomousAgentConfig) {
        super(config);
        this.artifactPath = config.artifactPath;

        // Derive or use provided Agent ID
        if (config.agentId) {
            this.agentId = Buffer.from(config.agentId, 'hex');
        } else {
            // Default derivation fallback
            this.agentId = crypto.createHash('sha256').update(config.name).digest().slice(0, 20);
        }

        if (config.llmApiKey) {
            this.aiEngine = new AiEngine(config.llmApiKey, config.model, config.aiProvider || 'openai');
        }
    }

    async initialize(): Promise<void> {
        if (!fs.existsSync(this.artifactPath)) {
            throw new Error(`Artifact not found at ${this.artifactPath}. Run compile first.`);
        }

        const artifact = JSON.parse(fs.readFileSync(this.artifactPath, 'utf-8'));
        const ownerPubKey = Buffer.from(this.ownerPrivKey.publicKey);

        this.contract = new Contract(artifact, [ownerPubKey, this.agentId], { provider: this.provider });
    }


    /**
     * Universal Withdrawal Method
     */
    async withdrawFunds(amount: number, toAddress: string): Promise<string> {
        if (!this.contract) throw new Error('Agent not initialized');
        const signer = new SignatureTemplate(this.ownerPrivKey.privateKey!);

        // @ts-ignore
        const tx = await this.contract.functions.withdraw(signer, BigInt(amount))
            .to(toAddress, BigInt(amount))
            .send();

        return tx.txid;
    }

    /**
     * Transfer funds to another address or agent
     */
    async transfer(to: string, amount: number): Promise<string> {
        console.log(`💸 Agent transferring ${amount} satoshis to ${to}...`);
        return this.withdrawFunds(amount, to);
    }


    async executeAction(actionName: string, params: any[]): Promise<string> {
        if (!this.contract) throw new Error('Agent not initialized');

        console.log(chalk.yellow(`⚙️ Executing Action: ${actionName}...`));

        // 1. Check if it's an internal SDK method (like transfer)
        if (typeof (this as any)[actionName] === 'function') {
            return await (this as any)[actionName](...params);
        }

        // 2. Otherwise, treat it as a contract function
        const signer = new SignatureTemplate(this.ownerPrivKey.privateKey!);
        const processedParams = params.map(p => typeof p === 'number' ? BigInt(p) : p);

        try {
            // @ts-ignore
            const tx = await this.contract.functions[actionName](signer, ...processedParams).send();
            return tx.txid;
        } catch (e: any) {
            throw new Error(`Contract function execution failed: ${e.message}`);
        }
    }

    async syncState(): Promise<AgentState> {
        if (!this.contract) throw new Error('Agent not initialized');
        const balance = await this.contract.getBalance();
        const utxos = await this.provider.getUtxos(this.contract.address);
        const agentUtxo = utxos.find(u => u.token?.nft);
        const commitment = agentUtxo?.token?.nft?.commitment || '';

        return {
            agentId: 'todo',
            commitment: Buffer.from(commitment).toString('hex'),
            balance: Number(balance)
        };
    }

    protected log(message: string, level: 'info' | 'warn' | 'error' | 'ai' = 'info') {
        const logDir = path.join(process.cwd(), '.logs');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        const logFile = path.join(logDir, `${this.name}.log`);
        const timestamp = new Date().toISOString();
        const line = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        fs.appendFileSync(logFile, line);

        // Also stdout with colors
        const color = level === 'error' ? chalk.red : level === 'ai' ? chalk.magenta : level === 'warn' ? chalk.yellow : chalk.gray;
        console.log(color(line.trim()));
    }

    async runAutonomousCycle(triggerContext: string): Promise<void> {
        this.log(`Mental cycle triggered by: ${triggerContext}`, 'info');
        if (!this.aiEngine) {
            this.log('AI Engine not configured.', 'error');
            return;
        }

        try {
            // Load Memory
            const memoryPath = path.join(process.cwd(), '.vault', `${this.name}.memory.json`);
            let history: string[] = [];
            if (fs.existsSync(memoryPath)) {
                try {
                    history = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
                } catch (e) { }
            }

            const state = await this.syncState();
            const context = `
                Agent: ${this.name}
                Address: ${this.getAddress()}
                Current Balance: ${state.balance} satoshis
                Current State (Commitment): ${state.commitment || 'None'}
                Trigger: ${triggerContext}
            `;

            const decision = await this.aiEngine.decide(context, history);

            this.log(`Reasoning: ${decision.reasoning}`, 'ai');
            this.log(`Decision: ${decision.action}(${JSON.stringify(decision.params)})`, 'ai');

            if (decision.action !== 'stayIdle') {
                const txid = await this.executeAction(decision.action, decision.params);
                this.log(`Transaction successful: ${txid}`, 'info');

                // Update History
                history.push(`${decision.action} - ${decision.reasoning} (TX: ${txid.substring(0, 8)})`);
            } else {
                this.log('Agent decided to stay idle.', 'info');
                history.push(`stayIdle - ${decision.reasoning}`);
            }

            // Save Memory (Keep last 10)
            const updatedHistory = history.slice(-10);
            if (!fs.existsSync(path.dirname(memoryPath))) fs.mkdirSync(path.dirname(memoryPath), { recursive: true });
            fs.writeFileSync(memoryPath, JSON.stringify(updatedHistory, null, 2));

        } catch (e: any) {
            this.log(`Cycle Error: ${e.message}`, 'error');
        }
    }
}
