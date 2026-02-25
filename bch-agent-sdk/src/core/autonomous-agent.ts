import { BchAgent, AgentConfig, AgentState } from './agent.js';
import { Contract, SignatureTemplate } from 'cashscript';
import { AiEngine, AIProvider } from './ai-engine.js';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import * as crypto from 'crypto';
import { SyncService } from '../utils/sync.js';

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
     * Autonomous Execution with Proof-of-State
     */
    async executeAutonomousAction(amount: number, recipient: string, reasoning: string): Promise<string> {
        if (!this.contract) throw new Error('Agent not initialized');

        // 1. Generate State Commitment (Proof of Reasoning)
        const stateHash = crypto.createHash('sha256')
            .update(`${reasoning}:${Date.now()}`)
            .digest()
            .slice(0, 20); // bytes20 for contract compatibility

        console.log(chalk.cyan(`📝 Etching Proof-of-State on-chain: ${stateHash.toString('hex')}`));

        // 2. Build Transaction according to v2 Covenant rules
        const utxos = await this.provider.getUtxos(this.contract.address);
        const nftUtxo = utxos.find(u => u.token?.nft);

        if (!nftUtxo) {
            throw new Error('State NFT not found in contract. Autonomous execution requires a persistent State NFT.');
        }

        // recipient address to bytes20 (mocking for now, in real we need to decode address)
        // for simplicity in this SDK version, we expect a hex for recipient in the param or use a helper
        const recipientBytes = Buffer.alloc(20, 0); // Placeholder

        try {
            // @ts-ignore
            const tx = await this.contract.functions.executeAction(
                BigInt(amount),
                recipientBytes,
                stateHash
            )
                .from(utxos)
                .to(this.contract.address, 1000n, { token: { ...nftUtxo.token, nft: { ...nftUtxo.token!.nft!, commitment: stateHash } } })
                .to(recipient, BigInt(amount))
                .send();

            return tx.txid;
        } catch (e: any) {
            throw new Error(`On-chain enforcement rejected action: ${e.message}`);
        }
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

        const color = level === 'error' ? chalk.red : level === 'ai' ? chalk.magenta : level === 'warn' ? chalk.yellow : chalk.gray;
        console.log(color(line.trim()));

        SyncService.syncLog(this.name, level, message);
    }

    async runAutonomousCycle(triggerContext: string): Promise<void> {
        this.log(`Mental cycle triggered by: ${triggerContext}`, 'info');
        if (!this.aiEngine) {
            this.log('AI Engine not configured.', 'error');
            return;
        }

        try {
            const memoryPath = path.join(process.cwd(), '.vault', `${this.name}.memory.json`);
            let history: string[] = [];
            if (fs.existsSync(memoryPath)) {
                try { history = JSON.parse(fs.readFileSync(memoryPath, 'utf8')); } catch (e) { }
            }

            const state = await this.syncState();
            const context = `
                Agent: ${this.name}
                Address: ${this.getAddress()}
                Current Balance: ${state.balance} satoshis
                On-Chain State Commitment: ${state.commitment || 'None'}
                Trigger: ${triggerContext}
                Contract Rules: Max Spend 500,000 sats, Must update commitment.
            `;

            const decision = await this.aiEngine.decide(context, history);

            this.log(`Reasoning: ${decision.reasoning}`, 'ai');

            if (decision.action === 'transfer' || decision.action === 'withdrawFunds') {
                const amount = decision.params[1] || decision.params[0];
                const recipient = decision.params[0] || decision.params[1];

                this.log(`Protocol Check: Enforcing on-chain settlement for ${amount} sats to ${recipient}`, 'info');
                const txid = await this.executeAutonomousAction(Number(amount), String(recipient), decision.reasoning);
                this.log(`Proof-of-State recorded in TX: ${txid}`, 'info');

                history.push(`${decision.action} - ${decision.reasoning} (On-chain Proof: ${txid.substring(0, 8)})`);
            } else if (decision.action !== 'stayIdle') {
                // Generic action handler
                const txid = await this.executeAction(decision.action, decision.params);
                this.log(`Transaction successful: ${txid}`, 'info');
                history.push(`${decision.action} - ${decision.reasoning} (TX: ${txid.substring(0, 8)})`);
            } else {
                this.log('Agent decided to stay idle.', 'info');
                history.push(`stayIdle - ${decision.reasoning}`);
            }

            // Save Memory
            const updatedHistory = history.slice(-10);
            if (!fs.existsSync(path.dirname(memoryPath))) fs.mkdirSync(path.dirname(memoryPath), { recursive: true });
            fs.writeFileSync(memoryPath, JSON.stringify(updatedHistory, null, 2));

        } catch (e: any) {
            this.log(`Cycle Execution Failed (Protocol Violation?): ${e.message}`, 'error');
        }
    }
}
