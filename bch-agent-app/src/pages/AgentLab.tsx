import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Plus, Activity, Shield, Database, Settings as SettingsIcon, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type Agent } from '../types';
import { getApiUrl } from '../config';

const TriggerBadge = ({ label, active, onClick }: { label: string, active?: boolean, onClick?: () => void }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all cursor-pointer ${active
            ? 'bg-primary-color/10 border-primary-color/40 text-primary-color'
            : 'bg-white/5 border-white/5 text-text-secondary hover:border-white/20'
            }`} style={active ? { backgroundColor: 'rgba(0, 227, 57, 0.1)', borderColor: 'rgba(0, 227, 57, 0.4)', color: 'var(--primary-color)' } : {}}>
        {label}
    </motion.div>
);

const ProtocolItem = ({ label, description, active, onChange }: { label: string, description: string, active?: boolean, onChange?: () => void }) => (
    <div className="flex items-center justify-between group">
        <div>
            <p className="text-sm font-bold tracking-tight">{label}</p>
            <p className="text-[10px] text-text-secondary mt-1 max-w-[200px] leading-relaxed">{description}</p>
        </div>
        <div
            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${active ? 'bg-primary-color' : 'bg-white/10'}`}
            style={active ? { backgroundColor: 'var(--primary-color)' } : {}}
            onClick={onChange}
        >
            <motion.div
                animate={{ x: active ? 24 : 0 }}
                className="w-4 h-4 rounded-full bg-white shadow-lg"
            ></motion.div>
        </div>
    </div>
);

const AgentLab = () => {
    const { user } = useAuth();
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);

    // User Inputs
    const [agentName, setAgentName] = useState('');
    const [agentDescription, setAgentDescription] = useState('');
    const [agentType, setAgentType] = useState('vault');
    const [protocols, setProtocols] = useState({
        transfers: true,
        refilling: true,
        manual: false
    });

    const [aiConfig, setAiConfig] = useState({
        provider: 'openai',
        model: 'gpt-4o',
        apiKey: '',
        baseUrl: ''
    });

    useEffect(() => {
        const fetchAgents = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch(getApiUrl('/agents'), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) setAgents(await res.json());
            } catch (e) { console.error(e); }
        };
        fetchAgents();
    }, [user]);

    const handleDeploy = async () => {
        if (!user || !user.token) return;
        if (!agentName) {
            alert("Agent name is required.");
            return;
        }

        setIsDeploying(true);

        try {
            // Simulated heavy work (contract compilation)
            await new Promise(resolve => setTimeout(resolve, 2500));

            const res = await fetch(getApiUrl('/agents'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    name: agentName,
                    description: agentDescription,
                    type: agentType,
                    protocols,
                    settings: {
                        aiProvider: aiConfig.provider,
                        aiModel: aiConfig.model,
                        aiApiKey: aiConfig.apiKey,
                        aiBaseUrl: aiConfig.baseUrl
                    },
                    createdAt: new Date().toISOString(),
                    status: 'active'
                })
            });

            if (res.ok) {
                setDeployed(true);
                setTimeout(() => setDeployed(false), 5000);

                // Clear form
                setAgentName('');
                setAgentDescription('');

                // Refresh list
                const agentsRes = await fetch(getApiUrl('/agents'), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (agentsRes.ok) setAgents(await agentsRes.json());
            }
        } catch (e) {
            console.error(e);
            alert("Deployment failed.");
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-8 pb-20 animate-fade-in text-white">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu size={16} className="text-primary-color" />
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Agentic Engineering Suite</span>
                    </div>
                    <h3 className="text-4xl font-black font-title tracking-tighter uppercase italic">AGENT LABORATORY</h3>
                    <p className="text-text-tertiary text-base max-w-xl mt-1">Design and instantiate autonomous entities with native Bitcoin Cash logic.</p>
                </div>
                <div className="flex items-center gap-4">
                    {agents.length > 0 && (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                            <Database size={16} className="text-primary-color" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">{agents.length} Synced</span>
                        </div>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className={`px-10 py-4 bg-primary-color text-black font-black rounded-2xl flex items-center gap-3 shadow-2xl transition-all ${isDeploying ? 'opacity-50 cursor-wait' : 'shadow-primary-color/20'}`}
                    >
                        {isDeploying ? (
                            <>
                                <Activity size={18} className="animate-spin" />
                                <span className="text-xs uppercase tracking-widest">Compiling...</span>
                            </>
                        ) : deployed ? (
                            <>
                                <Shield size={18} />
                                <span className="text-xs uppercase tracking-widest">Agent Logic Deployed</span>
                            </>
                        ) : (
                            <>
                                <Plus size={18} strokeWidth={3} />
                                <span className="text-xs uppercase tracking-widest">Initialize Node</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* CONFIGURATION COLUMN */}
                <div className="lg:col-span-2 glass-panel p-10 space-y-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h4 className="font-black italic flex items-center gap-3 text-white uppercase tracking-widest text-sm">
                            <Cpu size={20} className="text-primary-color" />
                            Identity & Purpose
                        </h4>
                        <span className="text-[10px] font-black text-text-tertiary italic uppercase tracking-widest">v{agents.length + 1}.0.4 Draft</span>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-text-tertiary tracking-[0.2em] block">Agent Designation</label>
                                <input
                                    type="text"
                                    value={agentName}
                                    onChange={(e) => setAgentName(e.target.value)}
                                    placeholder="e.g. ALPHA_LIQUIDITY_BOT"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-primary-color focus:bg-primary-color/[0.02] outline-none transition-all font-mono text-sm placeholder:text-white/5"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-text-tertiary tracking-[0.2em] block">Entity Classification</label>
                                <div className="flex gap-2">
                                    {['vault', 'defi', 'nft', 'social'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setAgentType(t)}
                                            className={`flex-1 py-4 rounded-xl border text-[10px] font-black uppercase transition-all ${agentType === t ? 'bg-primary-color/10 border-primary-color/40 text-primary-color' : 'bg-white/5 border-white/5 text-text-tertiary'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-black text-text-tertiary tracking-[0.2em] block">Narrative Directives (LLM Layer)</label>
                            <textarea
                                value={agentDescription}
                                onChange={(e) => setAgentDescription(e.target.value)}
                                placeholder="Assign instructions: 'Act as a secure oracle for the NFT studio. Sign commit hashes only if...'"
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 focus:border-primary-color focus:bg-primary-color/[0.02] outline-none transition-all h-40 resize-none font-medium text-sm leading-relaxed placeholder:text-white/5"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-text-tertiary tracking-[0.2em] block">On-Chain Activation Triggers</label>
                            <div className="flex flex-wrap gap-3">
                                <TriggerBadge label="CashToken Activity" active />
                                <TriggerBadge label="Block Height" />
                                <TriggerBadge label="Oracle Feed" />
                                <TriggerBadge label="Memo.cash Event" />
                                <div className="p-2.5 border border-dashed border-white/10 rounded-xl text-text-tertiary hover:border-white/30 cursor-pointer transition-all">
                                    <Plus size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROTOCOLS COLUMN */}
                <div className="space-y-8">
                    <div className="glass-panel p-8 relative overflow-hidden group border-primary-color/20 bg-primary-color/[0.01]">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Cpu size={160} />
                        </div>
                        <h4 className="font-black flex items-center gap-3 mb-8 uppercase tracking-widest text-xs text-primary-color italic">
                            <Activity size={20} />
                            Neural Intelligence Link
                        </h4>

                        <div className="space-y-6 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase text-text-tertiary tracking-widest">Provider</label>
                                    <select
                                        value={aiConfig.provider}
                                        onChange={(e) => setAiConfig({ ...aiConfig, provider: e.target.value })}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none focus:border-primary-color"
                                    >
                                        <option value="openai">OpenAI</option>
                                        <option value="deepseek">DeepSeek</option>
                                        <option value="anthropic">Anthropic</option>
                                        <option value="custom">Custom (GPT-5/Other)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase text-text-tertiary tracking-widest">Model Link</label>
                                    <input
                                        type="text"
                                        value={aiConfig.model}
                                        onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                                        placeholder="gpt-4o"
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none focus:border-primary-color"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase text-text-tertiary tracking-widest">Secret API Key (Bridge)</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={aiConfig.apiKey}
                                        onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                                        placeholder="sk-••••••••••••••••"
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none focus:border-primary-color pr-10"
                                    />
                                    <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
                                </div>
                            </div>

                            {aiConfig.provider === 'custom' && (
                                <div className="space-y-2">
                                    <label className="text-[8px] font-black uppercase text-text-tertiary tracking-widest">Endpoint URL</label>
                                    <input
                                        type="text"
                                        value={aiConfig.baseUrl}
                                        onChange={(e) => setAiConfig({ ...aiConfig, baseUrl: e.target.value })}
                                        placeholder="https://api.your-model.com/v1"
                                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white outline-none focus:border-primary-color"
                                    />
                                </div>
                            )}

                            <p className="text-[9px] text-text-tertiary italic flex items-center gap-2">
                                <Shield size={10} className="text-secondary-color" />
                                Credentials are encrypted on the Nexus Relay.
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel p-8 space-y-8 border-blue-500/20 bg-blue-500/[0.01]">
                        <h4 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs text-blue-400 italic">
                            <SettingsIcon size={20} />
                            Behavioral Protocols
                        </h4>
                        <div className="space-y-8">
                            <ProtocolItem
                                label="Autonomous Transfers"
                                description="Enable signing of token transactions without human confirmation."
                                active={protocols.transfers}
                                onChange={() => setProtocols(p => ({ ...p, transfers: !p.transfers }))}
                            />
                            <ProtocolItem
                                label="Gas Auto-Refill"
                                description="Refill agent liquidity automatically from vault if below threshold."
                                active={protocols.refilling}
                                onChange={() => setProtocols(p => ({ ...p, refilling: !p.refilling }))}
                            />
                            <ProtocolItem
                                label="Multi-Sig Escalation"
                                description="Require user multi-sig for transactions exceeding 1.0 BCH."
                                active={protocols.manual}
                                onChange={() => setProtocols(p => ({ ...p, manual: !p.manual }))}
                            />
                        </div>

                        <div className="pt-8 border-t border-white/5 flex gap-4">
                            <button className="flex-1 py-4 bg-white/5 border border-white/5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Reset</button>
                            <button
                                onClick={handleDeploy}
                                className="flex-2 py-4 bg-primary-color text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-color/10 transition-all font-title"
                            >
                                Persist Schema
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentLab;
