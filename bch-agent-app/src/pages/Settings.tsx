import React, { useState, useEffect } from 'react';
import { Key, Lock, Check, RefreshCw, Cpu, Share2, Zap, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        aiProvider: 'openai',
        aiModel: 'gpt-4o',
        aiApiKey: '',
        aiBaseUrl: '',
        connectors: {
            defi: { apiKey: '', baseUrl: '' },
            social: { discordWebhook: '', telegramToken: '' },
            nft: { storageApiKey: '', gatewayUrl: '' }
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user?.id) {
            supabase
                .from('user_settings')
                .select('*')
                .eq('userId', user.id)
                .single()
                .then(({ data, error }) => {
                    if (data && !error) {
                        setSettings(prev => ({ ...prev, ...data.settings }));
                    }
                    setIsLoading(false);
                });
        }
    }, [user?.id]);

    const handleSave = async () => {
        if (!user?.id) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    userId: user.id,
                    settings,
                    updatedAt: new Date().toISOString()
                }, { onConflict: 'userId' });

            if (!error) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <RefreshCw className="animate-spin text-primary-color" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in text-white">
            <header className="border-b border-white/5 pb-10">
                <div className="flex items-center gap-3 mb-2">
                    <Cpu size={18} className="text-primary-color" />
                    <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">System Configuration</span>
                </div>
                <h3 className="text-5xl font-black font-title tracking-tighter italic uppercase">SETTINGS</h3>
                <p className="text-text-tertiary text-sm mt-2 max-w-xl font-medium">Configure your autonomous agents' intelligence layers, specialized connectors, and node connectivity.</p>
            </header>

            <div className="grid grid-cols-1 gap-12">
                {/* AI Configuration */}
                <section className="glass-panel p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none text-primary-color">
                        <Cpu size={240} />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary-color flex items-center gap-3">
                            <Key size={16} />
                            Neural Intelligence Layer
                        </h4>
                        <span className="text-[9px] font-black text-text-tertiary uppercase bg-white/5 px-2 py-1 rounded">Global AI</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-text-tertiary tracking-widest block">AI Provider</label>
                            <select
                                value={settings.aiProvider}
                                onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                                className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-primary-color/50 appearance-none cursor-pointer transition-all hover:bg-black/80 font-bold"
                            >
                                <option value="openai">OpenAI (GPT series)</option>
                                <option value="anthropic">Anthropic (Claude series)</option>
                                <option value="deepseek">DeepSeek (Open Engine)</option>
                                <option value="local">Custom / Local (Ollama)</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-text-tertiary tracking-widest block">Model Sequence</label>
                            <input
                                type="text"
                                value={settings.aiModel}
                                onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                                placeholder="gpt-4o, claude-3-opus..."
                                className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-primary-color/50 transition-all font-mono text-xs placeholder:text-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 relative z-10">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black text-text-tertiary tracking-widest block">API Key Override</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={settings.aiApiKey}
                                    onChange={(e) => setSettings({ ...settings, aiApiKey: e.target.value })}
                                    placeholder="Enter your private API key..."
                                    className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-primary-color/50 font-mono text-sm pr-12 transition-all placeholder:text-white/5"
                                />
                                <Lock size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-text-tertiary opacity-40" />
                            </div>
                        </div>

                        {settings.aiProvider === 'local' && (
                            <div className="space-y-4 animate-slide-up">
                                <label className="text-[10px] uppercase font-black text-text-tertiary tracking-widest block">Custom Base URL</label>
                                <input
                                    type="text"
                                    value={settings.aiBaseUrl}
                                    onChange={(e) => setSettings({ ...settings, aiBaseUrl: e.target.value })}
                                    placeholder="http://localhost:11434/v1"
                                    className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-primary-color/50 font-mono text-sm transition-all placeholder:text-white/5"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* Expert Connectors */}
                <section className="glass-panel p-10 space-y-10 border-white/10">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-3">
                            <Share2 size={16} className="text-primary-color" />
                            Expert Connectors
                        </h4>
                        <span className="text-[9px] font-black text-text-tertiary uppercase bg-white/5 px-2 py-1 rounded">External Interop</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* DeFi / Market Connector */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Zap size={14} className="text-orange-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">DeFi & Market Aggregator</span>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={settings.connectors.defi.baseUrl}
                                    onChange={(e) => setSettings({ ...settings, connectors: { ...settings.connectors, defi: { ...settings.connectors.defi, baseUrl: e.target.value } } })}
                                    placeholder="Custom Market API URL"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-xs outline-none focus:border-orange-400/30 font-mono"
                                />
                                <input
                                    type="password"
                                    value={settings.connectors.defi.apiKey}
                                    onChange={(e) => setSettings({ ...settings, connectors: { ...settings.connectors, defi: { ...settings.connectors.defi, apiKey: e.target.value } } })}
                                    placeholder="DeFi API Key"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-xs outline-none focus:border-orange-400/30 font-mono"
                                />
                            </div>
                        </div>

                        {/* Social / Broadcast Connector */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Share2 size={14} className="text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Social Communication Bridge</span>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={settings.connectors.social.discordWebhook}
                                    onChange={(e) => setSettings({ ...settings, connectors: { ...settings.connectors, social: { ...settings.connectors.social, discordWebhook: e.target.value } } })}
                                    placeholder="Discord Webhook URL"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-xs outline-none focus:border-blue-400/30 font-mono"
                                />
                                <input
                                    type="text"
                                    value={settings.connectors.social.telegramToken}
                                    onChange={(e) => setSettings({ ...settings, connectors: { ...settings.connectors, social: { ...settings.connectors.social, telegramToken: e.target.value } } })}
                                    placeholder="Telegram Bot Token"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-xs outline-none focus:border-blue-400/30 font-mono"
                                />
                            </div>
                        </div>

                        {/* NFT / Storage Connector */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Palette size={14} className="text-purple-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">NFT Identity & Storage</span>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={settings.connectors.nft.storageApiKey}
                                    onChange={(e) => setSettings({ ...settings, connectors: { ...settings.connectors, nft: { ...settings.connectors.nft, storageApiKey: e.target.value } } })}
                                    placeholder="IPFS / Storage API Key"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-xs outline-none focus:border-purple-400/30 font-mono"
                                />
                                <input
                                    type="text"
                                    value={settings.connectors.nft.gatewayUrl}
                                    onChange={(e) => setSettings({ ...settings, connectors: { ...settings.connectors, nft: { ...settings.connectors.nft, gatewayUrl: e.target.value } } })}
                                    placeholder="Custom IPFS Gateway"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-xs outline-none focus:border-purple-400/30 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-4">
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-green-400"
                            >
                                <Check size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Global Preferences Updated</span>
                            </motion.div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Discard Changes</button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-12 py-4 bg-primary-color text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] active:scale-[0.98] transition-all shadow-2xl shadow-primary-color/20 flex items-center gap-3"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : 'Apply Sync'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
