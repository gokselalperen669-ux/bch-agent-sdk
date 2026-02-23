import React, { useState, useEffect, useRef } from 'react';
import { Share2, Zap, Shield, Terminal, RefreshCw, Layers, Activity, Check, Cpu, Wifi, Eye, Info, Lock, Send, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config';

interface ConnectorConfig {
    aiProvider: string;
    aiModel: string;
    aiApiKey: string;
    aiBaseUrl: string;
    connectors: {
        defi: { apiKey: string, baseUrl: string },
        social: { discordWebhook: string, telegramToken: string },
        nft: { storageApiKey: string, gatewayUrl: string },
        vault: { sentinelId: string, securityEmail: string, vectorUrl?: string },
        custom?: Array<{ name: string, url: string, method: string }>
    }
}

interface LogEntry {
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    module: string;
}

const ConnectorsHub: React.FC = () => {
    const { user } = useAuth();
    const [config, setConfig] = useState<ConnectorConfig>({
        aiProvider: 'openai',
        aiModel: 'gpt-4o',
        aiApiKey: '',
        aiBaseUrl: '',
        connectors: {
            defi: { apiKey: '', baseUrl: '' },
            social: { discordWebhook: '', telegramToken: '' },
            nft: { storageApiKey: '', gatewayUrl: '' },
            vault: { sentinelId: '', securityEmail: '' }
        }
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [testingId, setTestingId] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [metrics, setMetrics] = useState({
        requests: 0,
        avgLatency: 0,
        uptime: 99.9,
        activeNodes: 4
    });

    const logEndRef = useRef<HTMLDivElement>(null);

    const addLog = (message: string, module: string, type: LogEntry['type'] = 'info') => {
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message,
            module,
            type
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
    };

    useEffect(() => {
        if (user?.token) {
            fetch(getApiUrl('/user/settings'), {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setConfig(prev => ({
                        ...prev,
                        ...data,
                        connectors: {
                            ...prev.connectors,
                            ...(data.connectors || {})
                        }
                    }));
                    setIsLoading(false);
                    addLog('Relay matrix synchronized with cloud core', 'SYSTEM', 'success');
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                    addLog('Synchronization failure: Connection timed out', 'SYSTEM', 'error');
                });
        }

        // Simulate some real-time metrics
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                requests: prev.requests + Math.floor(Math.random() * 5),
                avgLatency: 20 + Math.floor(Math.random() * 80)
            }));

            if (Math.random() > 0.8) {
                const modules = ['NEURAL', 'DEFI', 'SOCIAL', 'NFT', 'VAULT'];
                const mod = modules[Math.floor(Math.random() * modules.length)];
                addLog(`Background ping to ${mod} successful (latency: ${Math.floor(Math.random() * 100)}ms)`, mod, 'info');
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [user]);

    const handleSave = async () => {
        if (!user?.token) return;
        setIsSaving(true);
        addLog('Initiating hub matrix deployment...', 'SYSTEM');
        try {
            const res = await fetch(getApiUrl('/user/settings'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                setShowSuccess(true);
                addLog('Hub matrix applied successfully', 'SYSTEM', 'success');
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                addLog('Failed to apply hub matrix: Server rejected configuration', 'SYSTEM', 'error');
            }
        } catch (err) {
            console.error(err);
            addLog('Critical error during deployment sequence', 'SYSTEM', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const testConnection = async (id: string) => {
        if (!user?.token) return;
        setTestingId(id);
        const moduleName = id.toUpperCase();
        addLog(`Pinging ${moduleName} relay endpoint...`, moduleName);

        try {
            const res = await fetch(getApiUrl('/user/test-connector'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ id })
            });

            const data = await res.json();
            if (res.ok) {
                addLog(data.message || `Handshake established with ${moduleName} (latency: ${data.latency}ms)`, moduleName, 'success');
            } else {
                addLog(`Connection failed: ${data.error || 'Unknown error'}`, moduleName, 'error');
            }
        } catch (err) {
            console.error(err);
            addLog(`Critical link failure to ${moduleName}`, moduleName, 'error');
        } finally {
            setTestingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <RefreshCw className="animate-spin text-primary-color" size={40} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Synchronizing Relay Matrix...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in text-white">
            <header className="border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-primary-color" />
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Nexus Connectors Hub</span>
                    </div>
                    <h3 className="text-6xl font-black font-title tracking-tighter italic uppercase">RELAY CENTER</h3>
                    <p className="text-text-tertiary text-sm max-w-xl font-medium">Configure neural pathways to external intelligence, market nodes, and social networks.</p>
                </div>

                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-xl shadow-lg shadow-green-500/5"
                            >
                                <Check size={14} className="text-green-500" />
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none italic">Sync Successful</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-primary-color text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl shadow-primary-color/20 flex items-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Layers size={14} className="fill-black" />}
                        Apply Hub Matrix
                    </button>
                </div>
            </header>

            {/* Real-time Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard icon={<Activity size={14} />} label="Total Requests" value={metrics.requests.toLocaleString()} />
                <MetricCard icon={<Wifi size={14} />} label="Avg Latency" value={`${metrics.avgLatency}ms`} color="text-orange-400" />
                <MetricCard icon={<Shield size={14} />} label="Hub Uptime" value={`${metrics.uptime}%`} color="text-primary-color" />
                <MetricCard icon={<Eye size={14} />} label="Active Nodes" value={metrics.activeNodes.toString()} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Configuration (2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* AI Master Engine */}
                    <section className="glass-panel p-8 relative overflow-hidden group border-primary-color/20 bg-primary-color/[0.02] box-shadow-glow">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-primary-color">
                            <Cpu size={180} />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <Cpu size={14} className="text-primary-color" />
                                    <span className="text-[9px] font-black text-primary-color uppercase tracking-[0.2em]">Neural Engine</span>
                                </div>
                                <h4 className="text-2xl font-black italic uppercase">Master AI Core</h4>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-color/10 border border-primary-color/20">
                                <div className="h-2 w-2 rounded-full bg-primary-color animate-pulse" />
                                <span className="text-[9px] font-black text-primary-color uppercase tracking-tighter">Primary Logic Layer</span>
                            </div>
                            <button
                                onClick={() => testConnection('ai')}
                                disabled={testingId === 'ai'}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${testingId === 'ai'
                                    ? 'bg-primary-color border-transparent text-black'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                                    }`}
                            >
                                {testingId === 'ai' ? <RefreshCw size={10} className="animate-spin" /> : <Send size={10} />}
                                <span className="text-[8px] font-black uppercase tracking-widest">{testingId === 'ai' ? 'Testing' : 'Test AI Link'}</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black text-text-tertiary tracking-widest flex items-center gap-2">
                                    Provider <Info size={10} className="opacity-40" />
                                </label>
                                <select
                                    value={config.aiProvider}
                                    onChange={(e) => setConfig({ ...config, aiProvider: e.target.value })}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:border-primary-color/50 transition-all cursor-pointer ring-primary-color/20 focus:ring-4"
                                >
                                    <option value="openai">OpenAI (SOTA)</option>
                                    <option value="anthropic">Anthropic (Claude)</option>
                                    <option value="deepseek">DeepSeek (Open)</option>
                                    <option value="local">Ollama (Local Node)</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black text-text-tertiary tracking-widest">Model Sequence</label>
                                <input
                                    type="text"
                                    value={config.aiModel}
                                    onChange={(e) => setConfig({ ...config, aiModel: e.target.value })}
                                    placeholder="gpt-4o, claude-3-5..."
                                    className="input-field py-3.5 font-mono text-xs"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase font-black text-text-tertiary tracking-widest">Private API Key</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={config.aiApiKey}
                                        onChange={(e) => setConfig({ ...config, aiApiKey: e.target.value })}
                                        placeholder="••••••••••••••••"
                                        className="input-field py-3.5 font-mono text-xs pr-10"
                                    />
                                    <Lock size={12} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {config.aiProvider === 'local' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="pt-6 mt-6 border-t border-white/5"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase font-black text-text-tertiary tracking-widest">Local Node Endpoint</label>
                                        <input
                                            type="text"
                                            value={config.aiBaseUrl}
                                            onChange={(e) => setConfig({ ...config, aiBaseUrl: e.target.value })}
                                            placeholder="http://localhost:11434/v1"
                                            className="input-field py-3.5 font-mono text-xs"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* Connector Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        <ConnectorCard
                            title="DeFi & Market Relay"
                            icon={<Zap size={18} className="text-orange-400" />}
                            description="Real-time market depth via CoinGecko and JEDEX pools."
                            fields={[
                                { label: 'Oracle Endpoint', value: config.connectors.defi.baseUrl, key: 'baseUrl' },
                                { label: 'Auth Token', value: config.connectors.defi.apiKey, key: 'apiKey', isPassword: true }
                            ]}
                            onChange={(key, val) => setConfig({ ...config, connectors: { ...config.connectors, defi: { ...config.connectors.defi, [key]: val } } })}
                            onTest={() => testConnection('defi')}
                            isTesting={testingId === 'defi'}
                        />

                        <ConnectorCard
                            title="Neural Knowledge Hub"
                            icon={<Layers size={18} className="text-secondary-color" />}
                            description="Retrieval Augmented Generation via Neural Vault API."
                            fields={[
                                { label: 'Vector DB URL', value: config.connectors.vault.vectorUrl || 'http://vault.nexus.io', key: 'vectorUrl' },
                                { label: 'Model Weight', value: '1.2x (Semantic)', key: 'weight', disabled: true }
                            ]}
                            onChange={(key, val) => setConfig({ ...config, connectors: { ...config.connectors, vault: { ...config.connectors.vault, [key]: val } } })}
                            onTest={() => testConnection('vault')}
                            isTesting={testingId === 'vault'}
                        />

                        <ConnectorCard
                            title="Social Signal Bridge"
                            icon={<Share2 size={18} className="text-blue-400" />}
                            description="Discord, Telegram and Twitter automated broadcasting."
                            fields={[
                                { label: 'Telegram Token', value: config.connectors.social.telegramToken, key: 'telegramToken', isPassword: true },
                                { label: 'Discord Webhook', value: config.connectors.social.discordWebhook, key: 'discordWebhook' }
                            ]}
                            onChange={(key, val) => setConfig({ ...config, connectors: { ...config.connectors, social: { ...config.connectors.social, [key]: val } } })}
                            onTest={() => testConnection('social')}
                            isTesting={testingId === 'social'}
                        />

                        <ConnectorCard
                            title="Global Action Relays"
                            icon={<ExternalLink size={18} className="text-primary-color" />}
                            description="Trigger generic generic webhooks for off-chain automation."
                            fields={[
                                { label: 'Primary Webhook', value: config.connectors.custom?.[0]?.url || '', key: 'webhookUrl' },
                                { label: 'Action Tag', value: 'MISSION_CONTROL', key: 'tag', disabled: true }
                            ]}
                            onChange={(_, val) => setConfig({ ...config, connectors: { ...config.connectors, custom: [{ name: 'primary', url: val, method: 'POST' }] } })}
                            onTest={() => testConnection('custom')}
                            isTesting={testingId === 'custom'}
                        />
                    </div>
                </div>

                {/* Side Panel: Real-time Activity Log */}
                <div className="space-y-6">
                    <div className="glass-panel h-full flex flex-col min-h-[500px] border-white/5">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-color animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-color">Live Console</span>
                            </div>
                            <Activity size={12} className="text-white/20" />
                        </div>

                        <div className="flex-1 p-5 overflow-y-auto custom-scroll font-mono text-[10px] space-y-3 bg-black/20">
                            <AnimatePresence initial={false}>
                                {logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3 leading-relaxed border-l border-white/5 pl-3"
                                    >
                                        <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
                                        <span className="text-white/40 shrink-0 font-bold">[{log.module}]</span>
                                        <span className={`
                                            ${log.type === 'success' ? 'text-primary-color' : ''}
                                            ${log.type === 'error' ? 'text-danger-color' : ''}
                                            ${log.type === 'warning' ? 'text-orange-400' : ''}
                                            ${log.type === 'info' ? 'text-white/80' : ''}
                                        `}>
                                            {log.message}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={logEndRef} />
                        </div>

                        <div className="p-4 bg-black/40 border-t border-white/5">
                            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-tighter text-white/30">
                                <span>Buffer: 50 ENTRIES</span>
                                <span>Status: ONLINE</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
                        <div className="flex items-center gap-3 mb-4">
                            <Info size={14} className="text-blue-400" />
                            <h6 className="text-[10px] font-black uppercase tracking-widest">Connectivity Guide</h6>
                        </div>
                        <p className="text-[11px] text-text-tertiary leading-relaxed mb-4">
                            Connectors act as the eyes and ears for your agents. Once configured, you can use these relays in the <strong>Agent Studio</strong> to create autonomous workflows.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <span className="block text-[8px] font-black text-white/20 mb-1 uppercase">Latency Score</span>
                                <span className="text-xs font-bold font-mono">A+ EXCELLENT</span>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <span className="block text-[8px] font-black text-white/20 mb-1 uppercase">Reliability</span>
                                <span className="text-xs font-bold font-mono">99.99%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color?: string }> = ({ icon, label, value, color = "text-white" }) => (
    <div className="glass-panel p-4 border-white/5 bg-white/[0.01] flex items-center gap-4 group hover:bg-white/[0.03]">
        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary-color transition-colors">
            {icon}
        </div>
        <div>
            <span className="block text-[8px] font-black text-text-tertiary uppercase tracking-widest leading-none mb-1">{label}</span>
            <span className={`text-lg font-black font-title tracking-tight ${color}`}>{value}</span>
        </div>
    </div>
);

const ConnectorCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    description: string;
    fields: { label: string, value: string, key: string, isPassword?: boolean, disabled?: boolean }[];
    onChange: (key: string, val: string) => void;
    onTest: () => void;
    isTesting: boolean;
}> = ({ title, icon, description, fields, onChange, onTest, isTesting }) => (
    <div className="glass-panel p-6 border-white/5 space-y-4 group/card hover:border-white/20 transition-all relative overflow-hidden">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover/card:scale-110 group-hover/card:bg-white/10">
                    {icon}
                </div>
                <div>
                    <h5 className="text-sm font-black uppercase tracking-tight">{title}</h5>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-primary-color" />
                        <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Active Relay</span>
                    </div>
                </div>
            </div>
            <button
                onClick={onTest}
                disabled={isTesting}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isTesting
                    ? 'bg-primary-color border-transparent text-black'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white'
                    }`}
            >
                {isTesting ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{isTesting ? 'Pinging' : 'Test'}</span>
            </button>
        </div>

        <p className="text-[11px] text-text-tertiary font-medium line-clamp-2">{description}</p>

        <div className="space-y-3 pt-4 border-t border-white/5">
            {fields.map(field => (
                <div key={field.key} className="space-y-1.5">
                    <label className="text-[8px] uppercase font-black text-text-tertiary tracking-widest">{field.label}</label>
                    <input
                        type={field.isPassword ? 'password' : 'text'}
                        value={field.value}
                        disabled={field.disabled}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        placeholder={`...`}
                        className={`w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-[11px] outline-none focus:border-white/20 transition-all font-mono placeholder:text-white/5 font-bold ${field.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                    />
                </div>
            ))}
        </div>

        {/* Dynamic scan line effect when testing */}
        <AnimatePresence>
            {isTesting && (
                <motion.div
                    initial={{ top: '-100%' }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-primary-color/5 to-transparent pointer-events-none"
                />
            )}
        </AnimatePresence>
    </div>
);

export default ConnectorsHub;

