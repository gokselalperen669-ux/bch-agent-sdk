import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Wallet, Shield, Zap, Terminal, Key, Copy, Check, Box, TrendingUp } from 'lucide-react';
import { getApiUrl } from '../config';
import { type InventoryItem } from '../types';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({ agents: 0, wallets: 0, assets: 0 });
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const headers = { 'Authorization': `Bearer ${user.token}` };
                // Parallel fetching
                const [agentsRes, walletsRes, meRes] = await Promise.all([
                    fetch(getApiUrl('/agents'), { headers }),
                    fetch(getApiUrl('/wallets'), { headers }),
                    fetch(getApiUrl('/auth/me'), { headers })
                ]);

                if (agentsRes.ok && walletsRes.ok && meRes.ok) {
                    const agents = await agentsRes.json();
                    const wallets = await walletsRes.json();
                    const me = await meRes.json();

                    setInventory(me.inventory || []);
                    setStats({
                        agents: agents.length,
                        wallets: wallets.length,
                        assets: (me.inventory || []).length
                    });
                }
            } catch (e) {
                console.error('Error fetching profile stats:', e);
            }
        };
        fetchData();
    }, [user]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-fade-in text-white pb-20">
            {/* Header Profile Section */}
            <div className="glass-panel p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
                    <Shield size={200} className="text-primary-color" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-primary-color to-accent-color p-[2px] shadow-2xl shadow-primary-color/20">
                        <div className="w-full h-full rounded-3xl bg-black flex items-center justify-center overflow-hidden">
                            <img src={user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h2 className="text-4xl font-title font-extrabold tracking-tight">{user?.name}</h2>
                            <span className="px-3 py-1 rounded-full bg-primary-color/10 border border-primary-color/20 text-[10px] font-bold text-primary-color uppercase w-fit mx-auto md:mx-0 tracking-widest">
                                Authorized Operator
                            </span>
                        </div>
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-6 text-text-secondary opacity-80">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="font-mono text-xs">{user?.email}</p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-default group hover:border-primary-color/30 transition-all">
                                <Terminal size={14} className="text-text-secondary group-hover:text-primary-color transition-colors" />
                                <span className="text-xs font-mono text-text-secondary">Terminal ID: <span className="text-white font-bold">{user?.id}</span></span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(user?.token || '')}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 hover:border-primary-color/30 transition-all group"
                            >
                                <Key size={14} className="text-text-secondary group-hover:text-primary-color transition-colors" />
                                <span className="text-xs font-mono text-text-secondary">Sync Token</span>
                                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-text-secondary group-hover:text-white" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 flex items-center justify-between group hover:border-primary-color/30 transition-all">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Managed Agents</p>
                        <h3 className="text-4xl font-title font-extrabold">{stats.agents}</h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-primary-color/10 flex items-center justify-center border border-primary-color/20 group-hover:scale-110 transition-transform">
                        <Bot size={32} className="text-primary-color" />
                    </div>
                </div>

                <div className="glass-panel p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Stored Vaults</p>
                        <h3 className="text-4xl font-title font-extrabold">{stats.wallets}</h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <Wallet size={32} className="text-blue-500" />
                    </div>
                </div>

                <div className="glass-panel p-8 flex items-center justify-between group hover:border-purple-500/30 transition-all">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-1">Net Assets</p>
                        <h3 className="text-4xl font-title font-extrabold">{stats.assets}</h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                        <Box size={32} className="text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Inventory Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <Box size={20} className="text-purple-500" />
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">My Inventory</h3>
                </div>

                {inventory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inventory.map((item, idx) => (
                            <div key={idx} className="glass-panel p-6 group hover:border-purple-500/30 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-all">
                                    {item.type === 'nft' ? <Bot size={100} /> : <TrendingUp size={100} />}

                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${item.type === 'nft'
                                        ? 'bg-primary-color/10 border-primary-color/20 text-primary-color'
                                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                        }`}>
                                        {item.type === 'nft' ? 'STATE COMMITMENT' : 'LIQUIDITY POSITION'}
                                    </span>
                                    <span className="text-[9px] font-mono text-text-tertiary">{new Date(item.acquiredAt).toLocaleDateString()}</span>
                                </div>

                                <h4 className="font-bold text-white mb-1 truncate pr-4">{item.name}</h4>
                                <p className="text-xs text-text-secondary font-mono mb-6">{item.value}</p>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                                        View On-Chain
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel p-12 flex flex-col items-center justify-center text-center opacity-50 border-dashed border-white/10">
                        <Box size={48} className="text-text-tertiary mb-4" />
                        <h4 className="font-bold text-sm uppercase tracking-widest">No Assets Found</h4>
                        <p className="text-xs text-text-secondary mt-2 max-w-xs">Participate in the Token Exchange or Agent Studio to acquire network assets.</p>
                    </div>
                )}
            </div>

            {/* CLI Instruction Box */}
            <div className="glass-panel p-8 border-primary-color/20 bg-primary-color/[0.02] mt-10">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-color/10">
                        <Zap size={24} className="text-primary-color" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2">Connect your CLI tool</h4>
                        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                            Use your profile credentials to authorize the <code className="text-primary-color bg-black/40 px-2 py-0.5 rounded">bch-agent</code> CLI.
                            Once connected, all agents and wallets created via terminal will automatically sync here.
                        </p>
                        <div className="bg-black/60 rounded-xl p-5 font-mono text-sm border border-white/5 relative group hover:border-primary-color/30 transition-all">
                            <div className="flex items-center justify-between text-[10px] text-text-secondary mb-3 uppercase tracking-widest font-bold">
                                <span>Terminal Session</span>
                                <span className="text-green-500 animate-pulse">Secure Layer Active</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-primary-color/50">$</span>
                                <code className="text-white">bch-agent login</code>
                            </div>
                            <button
                                onClick={() => copyToClipboard('bch-agent login')}
                                className="absolute right-4 bottom-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/5 rounded-lg"
                            >
                                <Copy size={16} className="text-text-secondary hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
