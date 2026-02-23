import React, { useState } from 'react';
import { Database, Plus, Search, FileText, Globe, Link2, RefreshCw, Check, AlertCircle, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Dataset {
    id: string;
    name: string;
    type: 'file' | 'web' | 'api';
    status: 'synced' | 'syncing' | 'error';
    size: string;
    lastSynced: string;
    vectors: number;
}

const KnowledgeBase: React.FC = () => {
    const [datasets] = useState<Dataset[]>([
        { id: '1', name: 'BCH Technical Specs', type: 'file', status: 'synced', size: '2.4 MB', lastSynced: '2h ago', vectors: 1240 },
        { id: '2', name: 'Market Sentiment Feed', type: 'api', status: 'syncing', size: 'Live', lastSynced: 'Now', vectors: 8520 },
        { id: '3', name: 'Whitepaper Archive', type: 'file', status: 'synced', size: '15.8 MB', lastSynced: '1d ago', vectors: 42000 },
    ]);

    const dots = React.useMemo(() => {
        // Use a simple pseudo-random generator with a seed for purity
        let seed = 123;
        const pseudoRandom = () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
        return Array.from({ length: 150 }).map(() => ({
            duration: pseudoRandom() * 3 + 2,
            delay: pseudoRandom() * 2
        }));
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-fade-in text-white">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Database size={18} className="text-secondary-color" />
                        <span className="text-[10px] font-black text-secondary-color uppercase tracking-[0.3em]">Knowledge Synchronization</span>
                    </div>
                    <h3 className="text-6xl font-black font-title tracking-tighter italic uppercase">NEURAL VAULT</h3>
                    <p className="text-text-tertiary text-sm max-w-xl font-medium">Manage the datasets that feed your agent's intelligence. Connect PDFs, websites, or real-time APIs to the vector engine.</p>
                </div>

                <button
                    onClick={() => console.log('Integrate Data triggered')}
                    className="px-8 py-3 bg-secondary-color text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl shadow-secondary-color/10 flex items-center gap-3"
                >
                    <Plus size={14} strokeWidth={3} />
                    Integrate Data
                </button>
            </header>

            {/* Vector DB Visualization */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 relative overflow-hidden group border-secondary-color/20 bg-secondary-color/[0.01]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h4 className="text-xl font-black italic uppercase">Vector Space Density</h4>
                            <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest mt-1">Live Embedding Matrix</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[9px] text-text-tertiary uppercase font-black tracking-widest">Total Vectors</p>
                                <p className="text-xl font-black text-secondary-color font-mono">51,760</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 w-full bg-black/40 rounded-2xl relative overflow-hidden border border-white/5 p-4 flex flex-wrap gap-2 content-start">
                        {dots.map((dot, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0.1, scale: 0.5 }}
                                animate={{
                                    opacity: [0.1, 0.4, 0.1],
                                    scale: [0.5, 1, 0.5],
                                    backgroundColor: i % 15 === 0 ? '#58a6ff' : '#1a1a1e'
                                }}
                                transition={{
                                    duration: dot.duration,
                                    repeat: Infinity,
                                    delay: dot.delay
                                }}
                                className="w-2 h-2 rounded-full"
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 rounded-lg border border-white/10">
                                <Activity size={10} className="text-secondary-color" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Processing Batch #842</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8 space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">Search Latency</span>
                            <span className="text-xs font-mono font-bold">12ms</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">Consistency</span>
                            <span className="text-xs font-mono font-bold">99.9%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">Engine</span>
                            <span className="text-xs font-mono font-bold text-secondary-color">PINE_V4</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-secondary-color/5 border border-secondary-color/20 space-y-3">
                        <h5 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle size={14} className="text-secondary-color" />
                            Storage Optimization
                        </h5>
                        <p className="text-[10px] text-text-tertiary leading-relaxed">Your vector database is running at 12% capacity. You can safely add up to 500k additional embeddings.</p>
                    </div>
                </div>
            </section>

            {/* Datasets Table */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-black italic uppercase tracking-tighter">Active Sync Pathways</h4>
                    <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="FILTER DATA..."
                            className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-secondary-color/40 w-64 uppercase"
                        />
                    </div>
                </div>

                <div className="glass-panel overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em]">Source Entity</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em]">Type</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em] text-right">Size / Vectors</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em] text-right">Status</th>
                                <th className="py-6 px-10 text-[10px] text-text-tertiary uppercase font-black tracking-[0.2em] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datasets.map(ds => (
                                <tr key={ds.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-6 px-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-secondary-color/30 transition-colors">
                                                {ds.type === 'file' ? <FileText size={18} /> : ds.type === 'web' ? <Globe size={18} /> : <Link2 size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{ds.name}</p>
                                                <p className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mt-0.5">Updated {ds.lastSynced}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-10">
                                        <span className="text-[10px] font-black uppercase px-3 py-1 bg-white/5 rounded-full text-text-tertiary">{ds.type}</span>
                                    </td>
                                    <td className="py-6 px-10 text-right">
                                        <p className="text-xs font-bold">{ds.size}</p>
                                        <p className="text-[9px] text-text-tertiary font-black uppercase">{ds.vectors.toLocaleString()} vectors</p>
                                    </td>
                                    <td className="py-6 px-10 text-right">
                                        <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-widest">
                                            {ds.status === 'synced' ? (
                                                <>
                                                    <Check size={12} className="text-secondary-color" />
                                                    <span className="text-secondary-color">Synced</span>
                                                </>
                                            ) : ds.status === 'syncing' ? (
                                                <>
                                                    <RefreshCw size={12} className="animate-spin text-orange-400" />
                                                    <span className="text-orange-400">Syncing</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle size={12} className="text-red-500" />
                                                    <span className="text-red-500">Error</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-6 px-10 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                            <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-all">
                                                <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

interface Activity { size?: number, className?: string }
const Activity: React.FC<Activity> = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

export default KnowledgeBase;

