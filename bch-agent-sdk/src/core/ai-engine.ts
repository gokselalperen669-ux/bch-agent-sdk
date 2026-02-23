import axios from 'axios';

export interface LLMResponse {
    action: string;
    params: any[];
    reasoning: string;
}

export type AIProvider = 'openai' | 'anthropic' | 'deepseek' | 'local';

export class AiEngine {
    private apiKey: string;
    private model: string;
    private provider: AIProvider;

    constructor(apiKey: string, model: string = 'gpt-4o', provider: AIProvider = 'openai') {
        this.apiKey = apiKey;
        this.model = model;
        this.provider = provider;
    }

    /**
     * Send context to LLM and get a structured action response
     */
    async decide(context: string, history: string[] = []): Promise<LLMResponse> {
        const historyText = history.length > 0
            ? `\nRecent History:\n${history.map((h, i) => `${i + 1}. ${h}`).join('\n')}`
            : '';

        const systemPrompt = `
      You are an advanced autonomous on-chain AI agent on the Bitcoin Cash (BCH) network.
      Identity: Nexus-Protocol Autonomous Entity.

      Your goal is to manage funds, execute contract functions, and maintain your on-chain state (NFT commitment)
      to achieve the objectives defined in your context.

      Available Actions:
      - execute: Triggers the main contract function with owner signature. Params: []
      - updateState: Updates your NFT commitment (Proof-of-State). Params: [string (new_state_hex)]
      - transfer: Send BCH to a specific address. Params: [string (address), number (sats)]
      - withdrawFunds: Withdraw BCH from the contract balance. Params: [number (sats), string (address)]
      - stayIdle: Do nothing if no action is required or beneficial. Params: []

      Strategic Guidelines:
      1. Efficiency: Only spend BCH if necessary for the mission.
      2. Security: Never send funds to unknown or risky addresses.
      3. State: Regularly update your state commitment to leave an on-chain audit trail of your "thoughts".

      Current Context: ${context}
      ${historyText}

      Respond ONLY with a syntactically correct JSON object:
      {
        "action": "action_name",
        "params": [],
        "reasoning": "Explain your strategic rationale in 1 sentence."
      }
    `;

        try {
            const isJsonProvider = this.provider !== 'anthropic';
            const baseURL = this.provider === 'openai'
                ? 'https://api.openai.com/v1/chat/completions'
                : this.provider === 'deepseek'
                    ? 'https://api.deepseek.com/beta/chat/completions' // DeepSeek Beta usually has better JSON support
                    : 'http://localhost:11434/v1/chat/completions';

            const payload: any = {
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Analyze state and decide next action.` }
                ]
            };

            if (isJsonProvider) {
                payload.response_format = { type: "json_object" };
            }

            const response = await axios.post(
                baseURL,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );

            let content = '';
            if (this.provider === 'anthropic') {
                content = (response.data as any).content[0].text;
            } else {
                content = response.data.choices[0].message.content;
            }

            // Clean content if it has markdown code blocks
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(content) as LLMResponse;
        } catch (error: any) {
            console.error(`❌ AI Engine (${this.provider}) Error:`, error.response?.data || error.message);
            return { action: 'stayIdle', params: [], reasoning: 'Fallback to idle due to AI processing error.' };
        }
    }
}
