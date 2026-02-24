import { useState, useEffect, type ElementType, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Activity, Globe, Terminal, Wallet, Shield, TrendingUp, Layers, BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw, Box, Plus, Minus, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type Agent, type Log } from '../types';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';

const StatsCard = ({ icon: Icon, label, value, delta }: { icon: ElementType, label: string, value: string, delta: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel p-6 glass-panel-hover"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <Icon size={20} className="text-primary-color" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${(delta && typeof delta === 'string' && delta.startsWith('+')) ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-text-secondary'}`}>
                {delta || '---'}
            </span>
        </div>
        <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">{label}</p>
            <h3 className="text-2xl font-black font-title tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [activities, setActivities] = useState<Agent[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [stats, setStats] = useState({ agents: '0', txs: '0', value: '0.00' });
    const [market, setMarket] = useState({ price: '---', change: '---', height: '---' });
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [commandInput, setCommandInput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [liqModal, setLiqModal] = useState<{ show: boolean, type: 'add' | 'remove', amount: string }>({ show: false, type: 'add', amount: '' });

    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchDashboardData = useCallback(async () => {
        // External market data
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd&include_24hr_change=true')
            .then(res => res.json())
            .then(data => {
                const bch = data['bitcoin-cash'];
                if (bch) {
                    setMarket(prev => ({
                        ...prev,
                        price: bch.usd.toFixed(2),
                        change: (bch.usd_24h_change >= 0 ? '+' : '') + bch.usd_24h_change.toFixed(2) + '%'
                    }));
                }
            }).catch(() => { });

        fetch('https://chipnet.imaginary.cash/api/v1/status')
            .then(res => res.json())
            .then(data => {
                if (data && data.height) {
                    setMarket(prev => ({ ...prev, height: data.height.toLocaleString() }));
                }
            }).catch(() => { });

        // Fetch logs and agents from API
        if (!user || !user.token) {
            setIsDataLoading(false);
            return;
        }

        try {
            const [logsRes, agentsRes, walletsRes] = await Promise.all([
                fetch(getApiUrl('/public/logs')),
                fetch(getApiUrl('/agents'), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }),
                fetch(getApiUrl('/wallets'), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
            ]);

            if (logsRes.ok) {
                const logData = await logsRes.json();
                setLogs(Array.isArray(logData) ? logData : []);
            }

            if (agentsRes.ok) {
                const agents = await agentsRes.json();
                const agentsArray = Array.isArray(agents) ? agents : [];
                setActivities(agentsArray);
                setStats(prev => ({ ...prev, agents: agentsArray.length.toString() }));

                if (selectedAgent) {
                    const updated = agentsArray.find((a: Agent) => a.id === selectedAgent.id);
                    if (updated) setSelectedAgent(updated);
                }
            }

            if (walletsRes.ok) {
                const wallets = await walletsRes.json();
                const walletsArray = Array.isArray(wallets) ? wallets : [];
                const totalBalance = walletsArray.reduce((acc: number, w: { balance?: string }) => acc + parseFloat(w.balance || '0'), 0);
                setStats(prev => ({ ...prev, value: totalBalance.toFixed(2) }));
            }
        } catch (err) {
            console.error('Fetch Dashboard Error:', err);
        } finally {
            setIsDataLoading(false);
        }
    }, [user?.token, selectedAgent]);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 10000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    const sendCommand = async () => {
        if (!selectedAgent || !commandInput || !user) return;
        setIsExecuting(true);

        try {
            await fetch(getApiUrl('/market/interact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    agentId: selectedAgent.id,
                    action: 'command',
                    amount: commandInput
                })
            });

            setTimeout(() => {
                setIsExecuting(false);
                setCommandInput('');
                fetchDashboardData();
            }, 800);
        } catch (err) {
            console.error('Command Error:', err);
            setIsExecuting(false);
        }
    };

    const handleLiquidity = async () => {
        if (!selectedAgent || !liqModal.amount || !user) return;
        setIsExecuting(true);
        try {
            await fetch(getApiUrl('/market/interact'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    agentId: selectedAgent.id,
                    action: liqModal.type === 'add' ? 'inject_liquidity' : 'divest_liquidity',
                    amount: liqModal.amount
                })
            });

            setLiqModal({ ...liqModal, show: false, amount: '' });
            fetchDashboardData();
        } catch (err) {
            console.error('Liquidity Error:', err);
        } finally {
            setIsExecuting(false);
        }
    };

    if (isDataLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in text-white pb-20 relative">
            {/* Liquidity Modal */}
            <AnimatePresence>
                {liqModal.show && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel p-8 w-full max-w-md border-primary-color/20"
                        >
                            <h3 className="text-2xl font-black italic uppercase mb-2">Liquidity {liqModal.type === 'add' ? 'Injection' : 'Withdrawal'}</h3>
                            <p className="text-text-secondary text-xs mb-6 uppercase tracking-widest font-bold">Target: {selectedAgent?.name}</p>

                            <div className="space-y-4 mb-8">
                                <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">Amount (BCH)</label>
                                <input
                                    type="number"
                                    value={liqModal.amount}
                                    onChange={(e) => setLiqModal({ ...liqModal, amount: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xl font-bold outline-none focus:border-primary-color/50 transition-all"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setLiqModal({ ...liqModal, show: false })}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLiquidity}
                                    disabled={!liqModal.amount || isExecuting}
                                    className={`flex-1 py-4 ${liqModal.type === 'add' ? 'bg-primary-color text-black' : 'bg-red-500 text-white'} font-black rounded-xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-50`}
                                >
                                    {isExecuting ? 'Processing...' : `Confirm ${liqModal.type === 'add' ? 'Inject' : 'Withdraw'}`}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard icon={Globe} label="BCH Price" value={`$${market.price}`} delta={market.change} />
                <StatsCard icon={Bot} label="Active Agents" value={stats.agents} delta="+24h" />
                <StatsCard icon={Wallet} label="Total Assets" value={`${stats.value} BCH`} delta="Syncing" />
                <StatsCard icon={Terminal} label="Net Health" value={market.height} delta="Stable" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Selection Node</h4>
                        <RefreshCw size={14} className="text-text-tertiary cursor-pointer hover:text-primary-color transition-colors" onClick={fetchDashboardData} />
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[700px] custom-scroll pr-2">
                        {activities.length > 0 ? activities.map(agent => (
                            <div
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer group/item relative overflow-hidden ${selectedAgent?.agentId === agent.agentId ? 'bg-primary-color/10 border-primary-color shadow-[0_0_20px_rgba(0,227,57,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${agent.ticker ? 'bg-blue-500/10 text-blue-400' : 'bg-primary-color/10 text-primary-color'}`}>
                                        {agent.ticker ? <TrendingUp size={20} /> : <Layers size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-title font-bold text-sm uppercase tracking-tight truncate">{agent.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[8px] text-text-tertiary font-black uppercase tracking-widest">{agent.ticker ? 'Market-Maker' : 'Logic-Agent'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-10 text-center glass-panel border-dashed border-white/5 opacity-40">
                                <p className="text-[10px] font-black text-text-tertiary uppercase">No Nodes Found</p>
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedAgent ? (
                        <motion.div
                            key={selectedAgent.agentId}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="lg:col-span-3 space-y-8"
                        >
                            {/* Header Panel */}
                            <div className="glass-panel p-8 border-primary-color/20 bg-primary-color/[0.01] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none transform rotate-12 scale-150">
                                    {selectedAgent.ticker ? <TrendingUp size={200} /> : <Bot size={200} />}
                                </div>

                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 rounded-3xl bg-black border border-primary-color/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,227,57,0.15)] glow-text-primary">
                                            {selectedAgent.ticker ? <TrendingUp size={36} className="text-primary-color" /> : <Bot size={36} className="text-primary-color" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-4xl font-black font-title tracking-tighter italic uppercase text-white">{selectedAgent.name}</h3>
                                                {selectedAgent.ticker && (
                                                    <span className="px-3 py-1 bg-primary-color text-black text-[10px] font-black rounded-lg uppercase tracking-widest">
                                                        ${selectedAgent.ticker}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Protocol: {selectedAgent.type.toUpperCase()}</span>
                                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">LIQUIDITY: {selectedAgent.liquidity || '0.0000'} BCH</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => setLiqModal({ show: true, type: 'add', amount: '' })} className="px-6 py-3 bg-primary-color/10 border border-primary-color/30 text-primary-color text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-color hover:text-black transition-all flex items-center gap-2">
                                            <Plus size={14} /> Inject
                                        </button>
                                        <button onClick={() => setLiqModal({ show: true, type: 'remove', amount: '' })} className="px-6 py-3 bg-white/5 border border-white/10 text-text-secondary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                                            <Minus size={14} /> Withdraw
                                        </button>
                                        <button onClick={() => navigate('/vault')} className="btn-secondary text-[10px] font-black uppercase tracking-widest px-8">
                                            Vault
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {/* Specialized UI based on Type */}
                                {selectedAgent.ticker ? (
                                    <div className="glass-panel p-8 space-y-6 bg-blue-500/[0.01] border-blue-500/10">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                                                <TrendingUp size={16} /> Order-Flow Matrix
                                            </h4>
                                            <span className="text-[10px] font-mono text-text-tertiary">Real-time Trading Matrix</span>
                                        </div>

                                        <div className="h-48 flex items-end gap-1.5 px-2 relative group">
                                            {[40, 60, 45, 80, 95, 70, 85, 60, 40, 50, 65, 80, 75, 90, 85, 70, 60, 55, 40, 60].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-t-[4px] transition-all hover:opacity-100 opacity-60 ${i > 15 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
                                                    style={{ height: `${h}%` }}
                                                />
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <TradeStat label="Buy Wall" value="1.24 BCH" icon={ArrowUpRight} color="text-green-400" />
                                            <TradeStat label="Sell Wall" value="0.88 BCH" icon={ArrowDownRight} color="text-red-400" />
                                        </div>

                                        <div className="space-y-3">
                                            <h5 className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">Recent Executions</h5>
                                            <div className="space-y-2">
                                                <TradeItem type="buy" amount="0.05" asset="NEXUS" time="2m ago" />
                                                <TradeItem type="sell" amount="0.02" asset="NEXUS" time="14m ago" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="glass-panel p-8 space-y-6">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-primary-color flex items-center gap-2">
                                                <Box size={16} /> Entity Knowledge Base
                                            </h4>
                                            <BarChart3 size={16} className="text-text-tertiary" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary-color/30 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black uppercase text-text-tertiary">Reasoning Depth</p>
                                                    <span className="text-xs font-black italic">ULTRA</span>
                                                </div>
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-primary-color" />
                                                </div>
                                                <p className="text-[9px] text-text-tertiary leading-relaxed">Cross-referencing Testnet history with current mempool state for optimal timing.</p>
                                            </div>
                                            <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-400/30 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black uppercase text-text-tertiary">Moral Bounds</p>
                                                    <span className="text-xs font-black italic">SECURE</span>
                                                </div>
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-blue-400" />
                                                </div>
                                                <p className="text-[9px] text-text-tertiary leading-relaxed">Agent will strictly follow the CashScript constraints defined in the contract.</p>
                                            </div>
                                        </div>

                                        <div className="p-8 rounded-3xl bg-black/40 border border-white/5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Shield size={18} className="text-primary-color" />
                                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">Autonomous Authorization</h5>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-[10px] text-text-secondary font-medium uppercase">Spend Limit (24h)</span>
                                                    <span className="text-[10px] text-white font-black italic">1.50 BCH</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-[10px] text-text-secondary font-medium uppercase">Automation Level</span>
                                                    <span className="text-[10px] text-primary-color font-black italic">LEVEL 4 - FULL</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Terminal Console (Common) */}
                                <div className="glass-panel p-8 flex flex-col h-full bg-black/40 border-white/5">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary-color flex items-center gap-2">
                                            <Terminal size={16} /> Active Directives
                                        </h4>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-primary-color transition-all" title="Quick Action: Auto-Trade">
                                                <Zap size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-black rounded-2xl p-6 font-mono text-[11px] h-64 border border-white/5 relative overflow-hidden mb-6 group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary-color/[0.03] to-transparent pointer-events-none" />
                                        <div className="relative space-y-2 overflow-y-auto h-full custom-scroll pr-2 scroll-smooth">
                                            <p className="text-primary-color opacity-30">[{new Date().toLocaleTimeString()}] Secure TCP/IP Link established.</p>
                                            {logs.filter(l => l.agentName === selectedAgent.name).map((l, i) => (
                                                <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="text-green-400 flex gap-3">
                                                    <span className="opacity-40 whitespace-nowrap">[{new Date(l.timestamp || Date.now()).toLocaleTimeString()}]</span>
                                                    <span className="glow-text-primary">{l.action}</span>
                                                </motion.p>
                                            ))}
                                            <div className="h-2 w-1 bg-primary-color animate-pulse inline-block align-middle ml-1" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            disabled={isExecuting}
                                            value={commandInput}
                                            onChange={(e) => setCommandInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendCommand()}
                                            placeholder={selectedAgent.ticker ? "Inject trade command (e.g. 'SELL ALL')..." : "Enter logic directive (e.g. 'REBALANCE')..."}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs outline-none focus:border-primary-color/50 placeholder:text-white/10 transition-all font-mono"
                                        />
                                        <button
                                            onClick={sendCommand}
                                            disabled={isExecuting || !commandInput}
                                            className="px-8 bg-primary-color text-black font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary-color/20 transition-all disabled:opacity-50"
                                        >
                                            {isExecuting ? '...' : 'Transmit'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-8 bg-white/[0.01] overflow-hidden">
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-text-tertiary">Real-time Data Uplink</h4>
                                    <span className="text-[10px] font-bold text-primary-color uppercase tracking-widest">Active Sync: Optimistic</span>
                                </div>
                                <div className="flex items-center gap-12 overflow-x-auto pb-4 custom-scroll scroll-smooth">
                                    <UplinkNode label="Nexus API" status="online" />
                                    <UplinkLine active />
                                    <UplinkNode label="Chipnet Node" status="online" />
                                    <UplinkLine active />
                                    <UplinkNode label="CLI Vault" status="standby" />
                                    <UplinkLine active />
                                    <UplinkNode label="DEX Engine" status="online" />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="lg:col-span-3 glass-panel h-[800px] flex flex-col items-center justify-center text-center space-y-10 group">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="w-32 h-32 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center shadow-2xl relative"
                            >
                                <div className="absolute inset-0 bg-primary-color/5 rounded-[2.5rem] blur-2xl transition-colors" />
                                <Bot size={56} className="text-text-tertiary group-hover:text-primary-color transition-colors relative z-10" />
                            </motion.div>
                            <div className="space-y-4 max-w-sm">
                                <h4 className="text-3xl font-black uppercase italic tracking-tighter">Fleet Link Required</h4>
                                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                                    Your autonomous fleet is currently idling on the network. Select a node from the selection matrix to initialize the command interface.
                                </p>
                            </div>
                            <button className="btn-primary text-[10px] font-black uppercase tracking-widest px-8" onClick={() => navigate('/vault')}>Open Vault</button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TradeStat = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: ElementType, color: string }) => (
    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
        <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] font-black uppercase text-text-tertiary tracking-widest">{label}</p>
            <Icon size={14} className={color} />
        </div>
        <h4 className="text-xl font-black italic tracking-tighter">{value}</h4>
    </div>
);

const TradeItem = ({ type, amount, asset, time }: { type: 'buy' | 'sell', amount: string, asset: string, time: string }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${type === 'buy' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                {type === 'buy' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-tight">Market {type.toUpperCase()}</p>
                <p className="text-[9px] text-text-tertiary font-bold">{time}</p>
            </div>
        </div>
        <p className={`text-xs font-black italic ${type === 'buy' ? 'text-green-400' : 'text-red-500'}`}>
            {type === 'buy' ? '+' : '-'}{amount} <span className="text-[8px] opacity-60">{asset}</span>
        </p>
    </div>
);

const UplinkNode = ({ label, status }: { label: string, status: 'online' | 'offline' | 'standby' }) => (
    <div className="flex flex-col items-center gap-3 min-w-fit">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${status === 'online' ? 'bg-primary-color/10 border-primary-color/30 text-primary-color shadow-[0_0_15px_rgba(0,227,57,0.1)]' : 'bg-white/5 border-white/5 text-text-tertiary'}`}>
            <Activity size={20} />
        </div>
        <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-white truncate w-20">{label}</p>
            <p className={`text-[7px] font-black uppercase mt-0.5 ${status === 'online' ? 'text-primary-color' : 'text-text-tertiary'}`}>{status}</p>
        </div>
    </div>
);

const UplinkLine = ({ active }: { active?: boolean }) => (
    <div className="flex-1 min-w-[60px] h-[1px] relative">
        <div className={`absolute inset-0 ${active ? 'bg-primary-color/30' : 'bg-white/5'}`} />
        {active && (
            <motion.div
                animate={{ x: ['-20%', '120%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary-color shadow-[0_0_10px_#00E339]"
            />
        )}
    </div>
);

export default Dashboard;
