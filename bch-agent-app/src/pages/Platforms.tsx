import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Wallet, MessageSquare, ShoppingBag, Layers, Terminal, Activity, Zap, Shield } from 'lucide-react';

interface Platform {
    id: string;
    name: string;
    type: 'defi' | 'wallet' | 'social' | 'payment';
    description: string;
    status: 'connected' | 'available' | 'maintenance';
}

const platforms: Platform[] = [
    { id: 'jedex', name: 'JEDEX', type: 'defi', description: 'Decentralized exchange for swapping CashTokens.', status: 'available' },
    { id: 'chainbased', name: 'Chainbased', type: 'defi', description: 'Lending and yield farming protocols.', status: 'maintenance' },
    { id: 'electron', name: 'Electron Cash', type: 'wallet', description: 'Advanced SPV wallet with CashFusion support.', status: 'connected' },
    { id: 'cashonize', name: 'Cashonize', type: 'wallet', description: 'Web-based wallet for CashTokens and DeFi.', status: 'available' },
    { id: 'memo', name: 'Memo.cash', type: 'social', description: 'On-chain social network for censorship-resistant content.', status: 'connected' },
    { id: 'noise', name: 'Noise.app', type: 'social', description: 'Micro-blogging platform engaging BCH users.', status: 'available' },
    { id: 'bitpay', name: 'BitPay', type: 'payment', description: 'Leading crypto payment processor integration.', status: 'available' },
];

const PlatformCard = ({ platform }: { platform: Platform }) => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'defi': return <Layers size={20} className="text-blue-400" />;
            case 'wallet': return <Wallet size={20} className="text-green-400" />;
            case 'social': return <MessageSquare size={20} className="text-purple-400" />;
            case 'payment': return <ShoppingBag size={20} className="text-orange-400" />;
            default: return <Globe size={20} />;
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-panel p-8 flex flex-col gap-6 relative overflow-hidden group border-white/5 hover:border-primary-color/30 transition-all duration-500 bg-black/40"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
                {getIcon(platform.type)}
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary-color/40 group-hover:bg-primary-color/5 transition-all shadow-inner">
                    {getIcon(platform.type)}
                </div>
                <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${platform.status === 'connected' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                    platform.status === 'maintenance' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-white/5 text-text-tertiary border-white/5'
                    }`}>
                    {platform.status}
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-black font-title tracking-tight text-white uppercase italic">{platform.name}</h3>
                <p className="text-xs text-text-tertiary font-medium mt-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{platform.description}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex gap-3 relative z-10">
                {platform.status === 'connected' ? (
                    <button className="flex-1 py-3.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20 transition-all shadow-lg shadow-green-500/5">
                        CONFIGURE HUB
                    </button>
                ) : (
                    <button className="flex-1 py-3.5 rounded-xl bg-white/5 hover:bg-primary-color hover:text-black text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all group-hover:shadow-xl group-hover:shadow-primary-color/20">
                        ESTABLISH LINK
                    </button>
                )}
                <button className="p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-text-tertiary hover:text-white transition-all">
                    <Terminal size={16} />
                </button>
            </div>
        </motion.div>
    );
};

const Platforms: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-fade-in text-white">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Shield size={18} />
                        </div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">External Integration Matrix</span>
                    </div>
                    <h1 className="text-5xl font-black font-title tracking-tighter text-white italic uppercase">PLATFORM HUB</h1>
                    <p className="text-text-tertiary text-sm max-w-2xl mt-2 font-medium">
                        Seamlessly interface your autonomous agents with the global Bitcoin Cash infrastructure.
                        Connect to high-liquidity DEXs, social protocols, and custody solutions.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Activity size={16} className="text-primary-color" />
                        Relay Status
                    </button>
                    <button className="px-8 py-3 bg-primary-color text-black font-black rounded-xl flex items-center gap-3 transition-all shadow-2xl shadow-primary-color/20 hover:scale-[1.05] text-[10px] uppercase tracking-widest">
                        <Zap size={16} />
                        <span>Force Scan</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {platforms.map(platform => (
                    <PlatformCard key={platform.id} platform={platform} />
                ))}

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-primary-color/40 bg-white/[0.01]"
                >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary-color/10 transition-all">
                        <Plus className="text-text-tertiary group-hover:text-primary-color" size={32} />
                    </div>
                    <h4 className="font-black text-text-tertiary text-[10px] uppercase tracking-[0.2em]">Request Protocol</h4>
                    <p className="text-[9px] text-text-tertiary mt-3 uppercase font-black italic opacity-40">Integration pipeline: ONLINE</p>
                </motion.div>
            </div>
        </div>
    );
};

const Plus = ({ size, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default Platforms;

