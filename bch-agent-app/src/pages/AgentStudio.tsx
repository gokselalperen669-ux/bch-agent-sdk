import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Bot,
    Plus,
    Shield,
    Filter,
    Layers,
    Activity,
    Lock,
    Search
} from 'lucide-react';
import { getApiUrl } from '../config';
import { useAuth } from '../context/AuthContext';
import { type Agent, type Log } from '../types';

interface AgentNft {
    id: string;
    agentName: string;
    agentId: string;
    title: string;
    description: string;
    image: string;
    supply: number;
    price: string;
    status: 'listed' | 'minting' | 'sold';
    lastActivity: string;
}

const StudioCard = ({ nft, onNegotiate }: { nft: AgentNft, onNegotiate: (nft: AgentNft) => void }) => (
    <motion.div
        whileHover={{ y: -8 }}
        className="glass-panel overflow-hidden group border-white/5 hover:border-primary-color/30 transition-all duration-500 bg-black/20"
    >
        <div className="relative aspect-square overflow-hidden">
            <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
                <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-primary-color uppercase tracking-widest">
                    {nft.status}
                </div>
            </div>
        </div>

        <div className="p-5 space-y-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Bot size={12} className="text-primary-color" />
                    <span className="text-[9px] font-black text-text-tertiary uppercase tracking-[0.2em]">{nft.agentName}</span>
                </div>
                <h3 className="text-sm font-black text-white truncate italic uppercase">{nft.title}</h3>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div>
                    <p className="text-[9px] text-text-tertiary uppercase font-black tracking-widest mb-0.5">Commitment Val</p>
                    <p className="text-lg font-black text-white">{nft.price}</p>
                </div>
                <button
                    onClick={() => onNegotiate(nft)}
                    className="p-2.5 bg-primary-color/10 border border-primary-color/20 rounded-xl text-primary-color hover:bg-primary-color hover:text-black transition-all shadow-lg shadow-primary-color/5"
                >
                    <Zap size={16} />
                </button>
            </div>
        </div>
    </motion.div>
);

const AgentStudio = () => {
    const [selectedNft, setSelectedNft] = useState<AgentNft | null>(null);
    const [nfts, setNfts] = useState<AgentNft[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAcquiring, setIsAcquiring] = useState(false);
    const { user } = useAuth();

    const fetchStudioData = useCallback(async () => {
        try {
            const [agentsRes, logsRes] = await Promise.all([
                fetch(getApiUrl('/public/agents')),
                fetch(getApiUrl('/public/logs'))
            ]);

            const agentsData = await agentsRes.json();
            const logsData = await logsRes.json();

            setLogs(logsData.slice(0, 8));

            const mappedNfts = agentsData.map((a: Agent) => ({
                id: `nft-${a.id}`,
                agentName: a.name,
                agentId: a.agentId || a.id,
                title: `${a.name.split(' ')[0]} Proof-of-State`,
                description: a.description || `Autonomous state commitment hash recorded by ${a.name}.`,
                image: `https://api.dicebear.com/7.x/identicon/svg?seed=${a.name}&backgroundColor=000000`,
                supply: 1,
                price: '0.25 BCH',
                status: a.type === 'nft' ? 'minting' : 'listed',
                lastActivity: 'Stable'
            }));

            setNfts(mappedNfts);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudioData();
        const interval = setInterval(fetchStudioData, 10000);
        return () => clearInterval(interval);
    }, [fetchStudioData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 animate-fade-in text-white">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-color/20 rounded-lg">
                            <Layers size={18} className="text-primary-color" />
                        </div>
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Institutional Verification Layer</span>
                    </div>
                    <h1 className="text-4xl font-black font-title tracking-tighter text-white italic uppercase">NFT FORGE</h1>
                    <p className="text-text-tertiary text-sm max-w-xl font-medium">
                        Monitor and trade generative state commitments produced by autonomous agents on Chipnet.
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="SEARCH COMMITMENTS..."
                            className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-primary-color/40 w-56 uppercase placeholder:text-white/10"
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-white hover:bg-white/10 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {nfts.map(nft => (
                    <StudioCard key={nft.id} nft={nft} onNegotiate={setSelectedNft} />
                ))}

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center min-h-[300px] group cursor-pointer hover:border-primary-color/40 bg-white/[0.01]"
                >
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary-color/10 transition-all">
                        <Plus size={28} className="text-text-tertiary group-hover:text-primary-color" />
                    </div>
                    <h4 className="font-black text-text-tertiary text-[10px] uppercase tracking-[0.2em]">Deploy NFT Agent</h4>
                    <p className="text-[9px] text-text-tertiary mt-3 uppercase font-black italic opacity-40">CLI: bch-agent create --type nft</p>
                </motion.div>
            </div>

            {/* Live Feed Sidebar Style Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
                <div className="lg:col-span-2 glass-panel p-10 overflow-hidden relative border-blue-500/10 bg-blue-500/[0.01]">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none text-blue-500">
                        <Lock size={200} />
                    </div>
                    <h3 className="text-sm font-black italic uppercase mb-8 flex items-center gap-3">
                        <Shield size={20} className="text-blue-500" />
                        Security & Commitment Proofs
                    </h3>
                    <div className="space-y-4">
                        {logs.filter(l => l.action.includes('commitment') || l.action.includes('NFT')).slice(0, 5).map((log, i) => (
                            <div key={log.id || i} className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-blue-500/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] pointer-events-none" />
                                    <span className="text-xs font-mono text-text-tertiary">COMMIT: {log.action.split(': ')[1] || '0xDEFAULT'}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{log.agentName}</span>
                                    <span className="text-[9px] font-black text-green-500 uppercase px-2 py-0.5 bg-green-500/10 rounded border border-green-500/20">VERIFIED</span>
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && <p className="text-xs text-text-tertiary italic text-center py-10">Monitoring network for new commitments...</p>}
                    </div>
                </div>

                <div className="glass-panel p-10 border-primary-color/10 bg-primary-color/[0.01]">
                    <h3 className="text-sm font-black italic uppercase mb-8 flex items-center gap-3">
                        <Activity size={20} className="text-primary-color" /> Network Feed
                    </h3>
                    <div className="space-y-8">
                        {logs.length > 0 ? logs.map((log, i) => (
                            <div key={log.id || i} className="text-[11px] leading-relaxed relative pl-4 border-l border-white/10">
                                <span className="text-primary-color font-black italic uppercase tracking-tighter">{log.agentName}</span> <span className="text-text-tertiary font-medium">{log.action.toLowerCase()}</span>.
                                <p className="text-[9px] text-text-tertiary mt-2 font-mono uppercase tracking-widest opacity-50">{new Date(log.timestamp).toLocaleTimeString()} • Verified Node</p>
                            </div>
                        )) : (
                            <div className="py-20 flex flex-col items-center justify-center opacity-20">
                                <Activity size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest mt-4">No active broadcasts</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedNft && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel max-w-lg w-full p-10 border-primary-color/20 bg-black/40"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                        <img src={selectedNft.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{selectedNft.title}</h3>
                                        <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest mt-1">Controller: {selectedNft.agentName}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedNft(null)} className="text-text-tertiary hover:text-white p-2">✕</button>
                            </div>

                            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 mb-8">
                                <p className="text-xs text-text-secondary leading-relaxed italic font-medium">
                                    "{selectedNft.description}"
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={async () => {
                                        if (!user?.token || !selectedNft) return;
                                        setIsAcquiring(true);
                                        try {
                                            await fetch(getApiUrl('/market/interact'), {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${user.token}`
                                                },
                                                body: JSON.stringify({
                                                    agentId: selectedNft.agentId,
                                                    action: 'buy_nft',
                                                    amount: '0.25'
                                                })
                                            });
                                            alert(`Successfully acquired commitment from ${selectedNft.agentName}`);
                                            setSelectedNft(null);
                                            fetchStudioData(); // Refresh logs
                                        } catch (e) {
                                            console.error(e);
                                            alert("Transaction failed");
                                        } finally {
                                            setIsAcquiring(false);
                                        }
                                    }}
                                    disabled={isAcquiring}
                                    className="flex-3 py-4 bg-primary-color text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary-color/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isAcquiring ? 'Broadcasting...' : 'Acquire Commitment'}
                                </button>
                                <button onClick={() => setSelectedNft(null)} className="flex-1 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Close</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgentStudio;
