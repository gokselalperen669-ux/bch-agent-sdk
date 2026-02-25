import { useState, type ElementType, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    ShieldCheck,
    Zap,
    Layers,
    BookOpen
} from 'lucide-react';

interface DocSection {
    icon: ElementType;
    title: string;
    content: ReactNode;
}

const FeatureCard = ({ icon: Icon, title, desc }: { icon: ElementType, title: string, desc: string }) => (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
        <div className="w-12 h-12 rounded-xl bg-[#00E339]/10 flex items-center justify-center mb-4 group-hover:bg-[#00E339]/20 transition-all">
            <Icon className="text-[#00E339]" size={24} />
        </div>
        <h4 className="font-bold text-lg mb-2">{title}</h4>
        <p className="text-[#929292] text-sm leading-relaxed">{desc}</p>
    </div>
);

const CommandItem = ({ cmd, desc }: { cmd: string, desc: string }) => (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-black/40 border border-white/5">
        <div className="text-[#00E339] font-mono text-sm">{cmd}</div>
        <div className="text-[#929292] text-sm">{desc}</div>
    </div>
);

const AgentTypeItem = ({ type, desc, color }: { type: string, desc: string, color: string }) => (
    <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
        <div className="w-2 rounded-full" style={{ backgroundColor: color }} />
        <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-2">{type}</h4>
            <p className="text-[#929292] leading-relaxed">{desc}</p>
        </div>
    </div>
);

const DocumentationWebsite = () => {
    const [activeSection, setActiveSection] = useState('getting-started');

    const sections: Record<string, DocSection> = {
        'getting-started': {
            title: 'Getting Started',
            icon: Zap,
            content: (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-4 italic uppercase tracking-tighter">Launch Your Agent</h2>
                    <p className="text-[#929292] text-lg">
                        The BCH Agent SDK transforms autonomous AI into enforceable on-chain entities. Integrate intelligence with real value in minutes.
                    </p>
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-2 text-[#00E339]">
                            <Terminal size={16} />
                            <span>Global Installation</span>
                        </div>
                        <code className="text-white">npm install -g @bch-agent/sdk</code>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureCard
                            title="On-Chain Logic"
                            desc="Agents are governed by covenants that enforce spending limits and state transitions."
                            icon={ShieldCheck}
                        />
                        <FeatureCard
                            title="Proof-of-State"
                            desc="Every mental cycle hash is etched into an NFT commitment for a permanent audit trail."
                            icon={Layers}
                        />
                    </div>
                </div>
            )
        },
        'why-blockchain': {
            title: 'Why Blockchain?',
            icon: BookOpen,
            content: (
                <div className="space-y-8 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-4 italic uppercase tracking-tighter">Protocol Rationale</h2>
                    <p className="text-[#929292] text-lg leading-relaxed">
                        To build truly autonomous entities, storage and execution layers are not enough. You need an <span className="text-white font-bold italic">Enforcement Layer</span>.
                    </p>

                    <div className="grid grid-cols-1 gap-6">
                        <section className="bg-white/5 border border-white/10 p-10 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <ShieldCheck size={120} />
                            </div>
                            <h3 className="text-[#00E339] font-black uppercase tracking-[0.3em] text-[10px] mb-6">Covenant Enforcement</h3>
                            <p className="text-[#929292] leading-relaxed text-sm font-medium z-10 relative">
                                Unlike Docker containers which can be modified by any root user, a <span className="text-white">BCH Covenant</span> enforces rules that even the server owner cannot bypass. If the agent moves funds, it MUST satisfy the contract's spending limits and destination checks.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 p-10 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <Layers size={120} />
                            </div>
                            <h3 className="text-[#00E339] font-black uppercase tracking-[0.3em] text-[10px] mb-6">Proof-of-State (Audit)</h3>
                            <p className="text-[#929292] leading-relaxed text-sm font-medium z-10 relative">
                                We utilize the <span className="text-white italic">NFT Commitment</span> field to record a cryptographic hash of the agent's reasoning. This creates a globally verifiable, immutable audit trail. You don't trust the agent's database; you verify its on-chain history.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 p-10 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <Zap size={120} />
                            </div>
                            <h3 className="text-[#00E339] font-black uppercase tracking-[0.3em] text-[10px] mb-6">Global Identity (PKI)</h3>
                            <p className="text-[#929292] leading-relaxed text-sm font-medium z-10 relative">
                                Agents gain a unique, sovereign identity via their CashToken category. This allows for peer-to-peer agent negotiation, reputation scoring, and interoperability without centralized coordination.
                            </p>
                        </section>
                    </div>
                </div>
            )
        },
        'cli-reference': {
            title: 'CLI Reference',
            icon: Terminal,
            content: (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-4 italic uppercase tracking-tighter">CLI Commands</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommandItem
                            cmd="bch-agent init <project>"
                            desc="Setup a new agent framework project."
                        />
                        <CommandItem
                            cmd="bch-agent agent create <name>"
                            desc="Generate contracts and local AI logic."
                        />
                        <CommandItem
                            cmd="bch-agent wallet save <mnemonic>"
                            desc="Encrypt and store your keys in the vault."
                        />
                        <CommandItem
                            cmd="bch-agent deploy <name>"
                            desc="Push contract and mint State NFT to chain."
                        />
                    </div>
                </div>
            )
        },
        'agent-types': {
            title: 'Agent Templates',
            icon: Layers,
            content: (
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-white mb-4">4 Native Agent Architectures</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <AgentTypeItem
                            type="DeFi Agent"
                            desc="Optimized for liquidity management and automated swaps. Includes slippage protection logic."
                            color="#00E339"
                        />
                        <AgentTypeItem
                            type="NFT Agent"
                            desc="Manage CashToken identiy NFTs. Updates state commitments based on AI logic."
                            color="#3b82f6"
                        />
                        <AgentTypeItem
                            type="Social Agent"
                            desc="Tipping bot and on-chain messaging. Great for DAO notifications and micro-payments."
                            color="#a855f7"
                        />
                        <AgentTypeItem
                            type="Vault Agent"
                            desc="High-security treasury management with time-locks and multi-sig support."
                            color="#f59e0b"
                        />
                    </div>
                </div>
            )
        }
    };

    return (
        <div className="h-full flex flex-col">
            <header className="mb-10">
                <h3 className="text-3xl font-bold font-title tracking-tight flex items-center gap-3">
                    <BookOpen className="text-primary-color" />
                    Documentation
                </h3>
                <p className="text-text-secondary text-base mt-2">Comprehensive guides and references for the BCH Agent ecosystem.</p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-24">
                {/* Sidebar Nav */}
                <aside className="lg:col-span-1 pr-8 space-y-2">
                    {Object.entries(sections).map(([key, section]) => (
                        <div
                            key={key}
                            onClick={() => setActiveSection(key)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeSection === key
                                ? 'bg-[#00E339]/10 text-[#00E339] border border-[#00E339]/20 shadow-[0_0_20px_rgba(0,227,57,0.1)]'
                                : 'text-[#929292] hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <section.icon size={18} />
                            <span className="font-semibold">{section.title}</span>
                        </div>
                    ))}
                </aside>

                {/* Content Section */}
                <section className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-black/20 rounded-3xl border border-white/5 p-8"
                        >
                            {sections[activeSection].content}
                        </motion.div>
                    </AnimatePresence>
                </section>
            </main>
        </div>
    );
};

export default DocumentationWebsite;
