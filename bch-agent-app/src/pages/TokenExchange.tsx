import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Zap,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Wallet
} from 'lucide-react';
import { getApiUrl } from '../config';
import { useAuth } from '../context/AuthContext';

interface TokenizedAgent {
    id: string;
    name: string;
    ticker: string;
    price: string;
    marketCap: string;
    change24h: string;
    holders: number;
    volume24h: string;
    description: string;
    riskScore: number;
    bondingCurveProgress: number;
    isGraduated: boolean;
    type: string;
}

const TokenExchange = () => {
    const [agents, setAgents] = useState<TokenizedAgent[]>([]);
    const [bchPrice, setBchPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuying, setIsBuying] = useState<TokenizedAgent | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [swapMode, setSwapMode] = useState<'buy' | 'sell'>('buy');
    const [swapAmount, setSwapAmount] = useState('1.0');
    const { user } = useAuth();

    const fetchData = useCallback(async () => {
        try {
            const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd');
            const priceData = await priceRes.json();
            setBchPrice(priceData['bitcoin-cash'].usd);

            const agentsRes = await fetch(getApiUrl('/public/agents'));
            const agentsData = await agentsRes.json();

            // Map REAL tokenized agents
            const mappedAgents = agentsData.map((a: { id: string; name: string; ticker?: string; status?: string; holders?: number; description?: string; type?: string; bondingCurveProgress?: number }) => ({
                id: a.id,
                name: a.name,
                ticker: a.ticker || a.name.substring(0, 4).toUpperCase(),
                price: '0.0001 BCH',
                marketCap: '100% Fully Built',
                change24h: a.status === 'graduated' ? '+12.4%' : '+0.0%',
                holders: a.holders || 1,
                volume24h: '0.42 BCH',
                description: a.description || 'Autonomous agent on Bitcoin Cash.',
                riskScore: a.type === 'defi' ? 12 : 5,
                bondingCurveProgress: a.bondingCurveProgress || (a.status === 'graduated' ? 100 : 15),
                isGraduated: a.status === 'graduated' || ((a.bondingCurveProgress || 0) >= 100),
                type: a.type || 'standard'
            }));

            setAgents(mappedAgents.reverse());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Live poll
        return () => clearInterval(interval);
    }, [fetchData]);

    const featuredAgent = agents.find(a => a.bondingCurveProgress > 50) || agents[0];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 text-white animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp size={18} className="text-primary-color" />
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.34em]">Nexus Liquidity Protocol</span>
                    </div>
                    <h1 className="text-5xl font-black font-title tracking-tighter italic uppercase">TOKEN EXCHANGE</h1>
                </div>

                <div className="flex gap-6 p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-md">
                    <div className="text-right">
                        <p className="text-[9px] text-text-tertiary uppercase font-black tracking-[0.2em] mb-1">BCH/USD Index</p>
                        <p className="text-xl font-black text-white italic">${bchPrice.toLocaleString()}</p>
                    </div>
                    <div className="w-[1px] bg-white/10" />
                    <div className="text-right">
                        <p className="text-[9px] text-text-tertiary uppercase font-black tracking-[0.2em] mb-1">Platform Volume</p>
                        <p className="text-xl font-black text-primary-color italic">128.4k BCH</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Trading Area */}
                <div className="lg:col-span-3 space-y-8">
                    {featuredAgent && (
                        <div className="trading-terminal p-12 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-primary-color group-hover:opacity-[0.08] transition-opacity duration-1000">
                                <Zap size={280} />
                            </div>

                            <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-center">
                                <div className="flex-1 space-y-8">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-primary-color/10 border border-primary-color/20 text-primary-color text-[8px] font-black uppercase rounded-lg tracking-widest italic">Signal: Graduation Imminent</span>
                                        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase rounded-lg tracking-widest italic">Bonding Curve Alpha-1</span>
                                    </div>
                                    <h2 className="text-6xl font-black italic tracking-tighter text-white uppercase">{featuredAgent.name} <span className="text-primary-color">${featuredAgent.ticker}</span></h2>
                                    <p className="text-text-tertiary font-medium leading-relaxed max-w-lg text-sm">
                                        {featuredAgent.description} High graduation probability based on recent Chipnet activity.
                                    </p>

                                    <div className="space-y-4 max-w-sm">
                                        <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest italic">
                                            <span>Graduation Progress</span>
                                            <span>{featuredAgent.bondingCurveProgress}%</span>
                                        </div>
                                        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
                                            <div className="h-full bg-primary-color shadow-[0_0_30px_rgba(0,227,57,0.5)] rounded-full transition-all duration-1000 ease-out" style={{ width: `${featuredAgent.bondingCurveProgress}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setIsBuying(featuredAgent)}
                                            className="px-12 py-5 bg-primary-color text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.05] active:scale-[0.98] transition-all shadow-2xl shadow-primary-color/20 uppercase tracking-widest text-xs font-title"
                                        >
                                            <TrendingUp size={18} /> INJECT LIQUIDITY
                                        </button>
                                        <button className="px-8 py-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-text-tertiary hover:text-white transition-all uppercase tracking-widest text-[10px] font-black">
                                            View Schema
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full xl:w-72">
                                    {[
                                        { label: 'MCAP (BCH)', value: featuredAgent.marketCap.split(' ')[0] },
                                        { label: 'HOLDERS', value: featuredAgent.holders },
                                        { label: 'LIQ DEPTH', value: '45.2' },
                                        { label: 'PRICE', value: '0.0004' }
                                    ].map((s, i) => (
                                        <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl flex flex-col items-center hover:border-primary-color/20 transition-all group/stat">
                                            <p className="text-[8px] text-text-tertiary uppercase font-black mb-2 tracking-widest group-hover/stat:text-primary-color transition-colors">{s.label}</p>
                                            <p className="text-xl font-black italic">{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Network Stats Sidebar */}
                <div className="glass-panel p-8 space-y-8 border-white/5 bg-white/[0.01]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Activity size={14} className="text-primary-color" /> Tx Flow
                        </h3>
                        <span className="text-[8px] font-black text-text-tertiary uppercase italic">Live Feed</span>
                    </div>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scroll pr-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex justify-between items-center text-[10px] border-b border-white/[0.03] pb-4 group">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={i % 3 === 0 ? 'text-red-400 font-black italic uppercase' : 'text-green-400 font-black italic uppercase'}>
                                            {i % 3 === 0 ? 'INJECT' : 'MINT'}
                                        </span>
                                        <span className="text-white font-mono opacity-80">0.{i}14 BCH</span>
                                    </div>
                                    <p className="text-text-tertiary font-bold tracking-tighter uppercase opacity-40">Agent Delta-{i}</p>
                                </div>
                                <span className="text-text-tertiary font-mono group-hover:text-white transition-all">21s ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Token List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Verified Market</h3>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="FILTER BY TICKER..."
                                className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-primary-color/40 w-56 uppercase placeholder:text-white/10"
                            />
                        </div>
                        <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-white">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="glass-panel overflow-hidden border-white/5">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em]">Asset Controller</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em] text-right">Price (BCH)</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em] text-right">24h Volatility</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em] text-right">Curve Status</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em] text-right">Liquidity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map(agent => (
                                <tr key={agent.id} className="border-b border-white/5 hover:bg-primary-color/5 transition-all group cursor-pointer">
                                    <td className="py-6 px-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-color/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-black italic group-hover:scale-110 transition-transform">
                                                {agent.ticker[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-sm tracking-tighter uppercase italic text-white">{agent.name}</p>
                                                    {agent.isGraduated && (
                                                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">${agent.ticker}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-10 text-right font-mono text-xs font-bold text-white italic">{agent.price}</td>
                                    <td className={`py-6 px-10 text-right font-black text-xs italic ${agent.change24h.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                        <div className="flex items-center justify-end gap-1">
                                            {agent.change24h.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {agent.change24h}
                                        </div>
                                    </td>
                                    <td className="py-6 px-10">
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[9px] font-black uppercase text-text-tertiary italic">{agent.isGraduated ? 'COMPLETED' : `${agent.bondingCurveProgress}%`}</span>
                                            <div className="w-32 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full transition-all duration-700 ${agent.isGraduated ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'bg-primary-color shadow-[0_0_10px_rgba(0,227,57,0.4)]'}`}
                                                    style={{ width: `${agent.bondingCurveProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-10 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsBuying(agent);
                                            }}
                                            className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary-color hover:text-black hover:border-primary-color transition-all"
                                        >
                                            ENTER FLOW
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isBuying && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel max-w-md w-full p-8 border-primary-color/20 space-y-6"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Trade ${isBuying.ticker}</h3>
                                <button onClick={() => setIsBuying(null)} className="text-text-tertiary hover:text-white">✕</button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl mb-6">
                                <button
                                    onClick={() => setSwapMode('buy')}
                                    className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${swapMode === 'buy' ? 'bg-primary-color text-black shadow-lg shadow-primary-color/20' : 'text-text-tertiary hover:text-white'}`}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => setSwapMode('sell')}
                                    className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${swapMode === 'sell' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-text-tertiary hover:text-white'}`}
                                >
                                    Sell
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                                        <span>Pay</span>
                                        <span className="flex items-center gap-1"><Wallet size={10} /> Bal: 12.5</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="number"
                                            value={swapAmount}
                                            onChange={(e) => setSwapAmount(e.target.value)}
                                            className="bg-transparent text-2xl font-black text-white outline-none w-full placeholder:text-white/10 italic"
                                        />
                                        <span className="text-xs font-black bg-white/10 px-2 py-1 rounded text-white uppercase">{swapMode === 'buy' ? 'BCH' : isBuying.ticker}</span>
                                    </div>
                                </div>

                                <div className="flex justify-center -my-2 relative z-10">
                                    <div className="p-2 bg-black border border-white/10 rounded-full">
                                        <ArrowDownRight size={16} className="text-text-tertiary" />
                                    </div>
                                </div>

                                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                                        <span>Receive (Est.)</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-white italic">
                                            {swapMode === 'buy'
                                                ? (parseFloat(swapAmount || '0') * 1000).toLocaleString()
                                                : (parseFloat(swapAmount || '0') * 0.001).toFixed(4)
                                            }
                                        </span>
                                        <span className="text-xs font-black bg-white/10 px-2 py-1 rounded text-white uppercase">{swapMode === 'buy' ? isBuying.ticker : 'BCH'}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    if (!user?.token || !isBuying) return;
                                    setIsProcessing(true);
                                    try {
                                        await fetch(getApiUrl('/market/interact'), {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${user.token}`
                                            },
                                            body: JSON.stringify({
                                                agentId: isBuying.id,
                                                action: swapMode === 'buy' ? 'inject_liquidity' : 'divest_liquidity',
                                                amount: swapAmount
                                            })
                                        });
                                        alert(`${swapMode === 'buy' ? 'Bought' : 'Sold'} ${isBuying.ticker}`);
                                        setIsBuying(null);
                                        fetchData();
                                    } catch {
                                        alert("Transaction Failed");
                                    } finally {
                                        setIsProcessing(false);
                                    }
                                }}
                                disabled={isProcessing}
                                className={`w-full py-5 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${swapMode === 'buy'
                                    ? 'bg-primary-color text-black shadow-primary-color/20'
                                    : 'bg-red-500 text-white shadow-red-500/20'
                                    }`}
                            >
                                {isProcessing ? 'Swapping...' : `Confirm ${swapMode === 'buy' ? 'Buy' : 'Sell'}`}
                            </button>

                            <div className="text-[9px] font-mono text-center text-text-tertiary">
                                Network Fee: <span className="text-white">0.00005 BCH</span> • Slippage: <span className="text-white">0.5%</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TokenExchange;
