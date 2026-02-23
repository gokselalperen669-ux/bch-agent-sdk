import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Lock,
    Wallet as WalletIcon,
    Copy,
    Shield,
    Bot,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    X,
    ExternalLink,
    Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type Wallet, type Agent } from '../types';
import { supabase } from '../lib/supabase';

const Vault = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const [unlockedWallets, setUnlockedWallets] = useState<Set<string>>(new Set());
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [unlockMnemonic, setUnlockMnemonic] = useState('');
    const [viewMode, setViewMode] = useState<'all' | 'personal' | 'agent'>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Add Wallet Form
    const [newWalletName, setNewWalletName] = useState('');
    const [newWalletAddress, setNewWalletAddress] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchVaultData = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const [walletRes, agentRes] = await Promise.all([
                supabase.from('wallets').select('*').eq('userId', user.id),
                supabase.from('agents').select('*').eq('userId', user.id),
            ]);

            if (walletRes.data && agentRes.data) {
                const walletList: Wallet[] = walletRes.data;
                const agentList: Agent[] = agentRes.data;

                // Fetch REAL balances from Chipnet
                const enrichedWallets = await Promise.all(walletList.map(async (w) => {
                    try {
                        const explorerRes = await fetch(`https://chipnet.imaginary.cash/api/v1/address/${w.address}`);
                        if (explorerRes.ok) {
                            const data = await explorerRes.json();
                            const satoshis = (data.confirmed || 0) + (data.unconfirmed || 0);
                            return { ...w, balance: (satoshis / 100000000).toFixed(4) };
                        }
                    } catch {
                        console.warn(`Could not fetch balance for ${w.address}`);
                    }
                    return { ...w, balance: w.balance || '0.0000' };
                }));

                setWallets(enrichedWallets);
                setAgents(agentList);
            }
        } catch (err) {
            console.error("Vault fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchVaultData();
    }, [fetchVaultData]);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleAddWallet = async () => {
        if (!user?.id || !newWalletName || !newWalletAddress) return;
        setIsSaving(true);
        try {
            const { error } = await supabase.from('wallets').insert({
                name: newWalletName,
                address: newWalletAddress,
                userId: user.id,
                createdAt: new Date().toISOString()
            });

            if (!error) {
                setShowAddModal(false);
                setNewWalletName('');
                setNewWalletAddress('');
                fetchVaultData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const confirmUnlock = () => {
        if (unlockMnemonic.split(' ').length >= 12) {
            if (selectedWallet) {
                setUnlockedWallets(prev => new Set(prev).add(selectedWallet.id));
                setShowUnlockModal(false);
                setUnlockMnemonic('');
            }
        } else {
            alert("Minimum 12 words required");
        }
    };

    const filteredWallets = wallets.filter(w => {
        if (viewMode === 'personal') return !w.agentId;
        if (viewMode === 'agent') return !!w.agentId;
        return true;
    });

    return (
        <div className="space-y-8 pb-20 animate-fade-in text-white">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield size={16} className="text-primary-color" />
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.34em]">Nexus Asset Management</span>
                    </div>
                    <h3 className="text-4xl font-black font-title tracking-tighter uppercase italic">SECURE VAULT</h3>
                    <p className="text-text-tertiary text-sm max-w-xl font-medium">Manage on-chain assets for humans and autonomous entities on Chipnet.</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        {['all', 'personal', 'agent'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode as 'all' | 'personal' | 'agent')}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${viewMode === mode ? 'bg-primary-color text-black shadow-lg shadow-primary-color/20' : 'text-text-tertiary hover:text-white'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddModal(true)}
                        className="p-3.5 bg-primary-color text-black rounded-2xl shadow-xl shadow-primary-color/10 hover:bg-primary-color/90 transition-all"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </motion.button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <div className="w-12 h-12 border-2 border-primary-color/20 border-t-primary-color rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">Scanning Chain...</p>
                </div>
            ) : filteredWallets.length === 0 ? (
                <div className="glass-panel py-32 flex flex-col items-center justify-center text-center space-y-8 border-dashed border-white/10">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/5 opacity-40">
                        <WalletIcon size={48} className="text-text-tertiary" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">Vault Empty</h4>
                        <p className="text-text-tertiary max-w-sm mx-auto text-sm leading-relaxed font-medium">
                            No active wallets identified. Sync your CLI keys or add a watch-only address manually.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all font-title"
                    >
                        Connect New Asset
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredWallets.map((wallet) => {
                        const managingAgent = agents.find(a => a.id === wallet.agentId);
                        const isUnlocked = unlockedWallets.has(wallet.id);

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={wallet.id}
                                className={`glass-panel p-10 relative overflow-hidden transition-all duration-500 hover:border-primary-color/30 group ${wallet.agentId ? 'bg-blue-500/[0.01]' : 'bg-primary-color/[0.01]'}`}
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                                    {wallet.agentId ? <Bot size={200} /> : <Shield size={200} />}
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-10">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${wallet.agentId ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-primary-color/10 border-primary-color/20 text-primary-color'}`}>
                                                {wallet.agentId ? <Bot size={32} /> : <Shield size={32} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-2xl font-black tracking-tighter text-white uppercase italic">{wallet.name}</p>
                                                    {isUnlocked && <div className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[8px] font-black rounded uppercase tracking-widest border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]">Active</div>}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-white/5">
                                                    <p className="text-[11px] font-mono text-text-tertiary">
                                                        {wallet.address.slice(0, 15)}...{wallet.address.slice(-10)}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => copyToClipboard(wallet.address, wallet.id)}
                                                            className="text-text-tertiary hover:text-white transition-colors"
                                                        >
                                                            {copiedId === wallet.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                        </button>
                                                        <a
                                                            href={`https://chipnet.imaginary.cash/address/${wallet.address}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-text-tertiary hover:text-primary-color transition-colors"
                                                        >
                                                            <ExternalLink size={12} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[9px] text-text-tertiary uppercase font-black tracking-[0.2em] mb-1.5">Chipnet Balance</p>
                                            <p className="text-4xl font-black text-white italic">
                                                {wallet.balance || '0.0000'} <span className={`text-sm ${wallet.agentId ? 'text-blue-400' : 'text-primary-color'}`}>BCH</span>
                                            </p>
                                        </div>
                                    </div>

                                    {wallet.agentId && (
                                        <div className="mb-8 p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group/agent">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                    <Activity size={20} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-text-tertiary uppercase font-black tracking-widest">Autonomous Controller</p>
                                                    <p className="text-sm font-black text-white italic uppercase">{managingAgent?.name || 'SYNCING...'}</p>
                                                </div>
                                            </div>
                                            <button className="px-5 py-2.5 bg-blue-500/10 rounded-xl text-[9px] font-black border border-blue-500/20 text-blue-400 uppercase tracking-widest hover:bg-blue-500/20 transition-all">
                                                Audit Logic
                                            </button>
                                        </div>
                                    )}

                                    <div className="mt-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <ActionButton icon={ArrowDownLeft} label="Deposit" onClick={() => { }} bg="bg-white/5 hover:bg-white/10" />
                                        <ActionButton icon={ArrowUpRight} label="Withdraw" onClick={() => {
                                            if (!isUnlocked) {
                                                setSelectedWallet(wallet);
                                                setShowUnlockModal(true);
                                            } else {
                                                alert("Broadcasting withdrawal transaction...");
                                            }
                                        }} bg="bg-white/5 hover:bg-white/10" />
                                        <ActionButton icon={Activity} label="Activity" onClick={() => { }} bg="bg-white/5 hover:bg-white/10" />
                                        <ActionButton icon={Lock} label="Control" onClick={() => { }} bg="bg-white/5 hover:bg-white/10" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Unlock Modal */}
            <AnimatePresence>
                {showUnlockModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-panel w-full max-w-md p-10 border border-primary-color/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                <Lock size={160} className="text-primary-color" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-primary-color animate-pulse" />
                                    <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Vault Authorization Protocol</span>
                                </div>
                                <h3 className="text-3xl font-black mb-1 text-white uppercase italic tracking-tighter">Sign Certificate</h3>
                                <p className="text-sm text-text-tertiary mb-10 font-medium">Authorizing secure signing context for this browser session.</p>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase font-black text-text-tertiary tracking-[0.2em] block">Vault Mnemonic Key</label>
                                        <textarea
                                            value={unlockMnemonic}
                                            onChange={(e) => setUnlockMnemonic(e.target.value)}
                                            placeholder="enter 12 or 24 words..."
                                            className="w-full h-36 bg-black/60 border border-white/5 rounded-2xl p-6 text-xs font-mono focus:border-primary-color focus:bg-primary-color/[0.02] outline-none resize-none transition-all placeholder:text-white/5 leading-relaxed"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setShowUnlockModal(false);
                                                setUnlockMnemonic('');
                                            }}
                                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={confirmUnlock}
                                            className="flex-2 py-4 bg-primary-color text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-color/20 transition-all font-title"
                                        >
                                            Confirm Identity
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-center text-text-tertiary font-black uppercase tracking-[0.3em] opacity-30">
                                        AES-256 SANDBOXED • NO PERSISTENCE
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Wallet Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel w-full max-w-lg p-12 border border-blue-500/20 relative"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-8 right-8 text-text-tertiary hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="space-y-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Plus size={16} className="text-blue-400" />
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">New Nexus Integration</span>
                                    </div>
                                    <h3 className="text-3xl font-black italic uppercase italic tracking-tighter">Connect Asset</h3>
                                    <p className="text-sm text-text-tertiary font-medium">Sync an existing Chipnet address with your profile.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase font-black text-text-tertiary tracking-[0.2em]">Asset Label</label>
                                        <input
                                            type="text"
                                            value={newWalletName}
                                            onChange={(e) => setNewWalletName(e.target.value)}
                                            placeholder="e.g. TREASURY_COLD_VAULT"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 focus:border-blue-500/50 focus:bg-blue-500/[0.02] outline-none transition-all font-mono text-sm placeholder:text-white/5"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase font-black text-text-tertiary tracking-[0.2em]">Public Address (bchtest:)</label>
                                        <input
                                            type="text"
                                            value={newWalletAddress}
                                            onChange={(e) => setNewWalletAddress(e.target.value)}
                                            placeholder="bchtest:q..."
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 focus:border-blue-500/50 focus:bg-blue-500/[0.02] outline-none transition-all font-mono text-sm placeholder:text-white/5"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-title"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddWallet}
                                        disabled={isSaving || !newWalletName || !newWalletAddress}
                                        className="flex-2 py-5 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-blue-500/10 disabled:opacity-50 font-title"
                                    >
                                        {isSaving ? 'Synchronizing...' : 'Finalize Connection'}
                                    </button>
                                </div>
                                <div className="p-4 bg-orange-500/[0.03] border border-orange-500/10 rounded-2xl">
                                    <p className="text-[9px] text-orange-400 font-bold leading-relaxed uppercase tracking-widest text-center">
                                        Warning: This is a watch-only connection. Signing keys remain in your local CLI vault until specifically authorized.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label, onClick, bg }: { icon: React.ElementType, label: string, onClick: () => void, bg: string }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border border-white/5 transition-all group ${bg}`}
    >
        <Icon size={20} className="text-text-tertiary group-hover:text-white transition-all group-hover:scale-110" />
        <span className="text-[9px] font-black uppercase text-text-tertiary group-hover:text-white transition-colors tracking-tighter">{label}</span>
    </button>
);

export default Vault;
