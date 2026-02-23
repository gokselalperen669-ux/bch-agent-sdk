import { useState, type ElementType, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    ShieldCheck,
    Zap,
    Layers,
    Workflow,
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
                    <h2 className="text-3xl font-bold text-white mb-4">Launch Your First Agent</h2>
                    <p className="text-[#929292] text-lg">
                        The BCH Agent Framework is designed to help you build, deploy, and manage autonomous AI agents on the Bitcoin Cash network in minutes.
                    </p>
                    <div className="bg-black/40 border border-white/10 rounded-xl p-6 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-2 text-[#00E339]">
                            <Terminal size={16} />
                            <span>Installation</span>
                        </div>
                        <code className="text-white">npm install -g @bch-agent/sdk</code>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureCard
                            title="Autonomous"
                            desc="Agents run independent loops, monitoring the chain and acting based on LLM decisions."
                            icon={Workflow}
                        />
                        <FeatureCard
                            title="Secure"
                            desc="Built on CashScript covenants. Only the agent logic can move funds under owner constraints."
                            icon={ShieldCheck}
                        />
                    </div>
                </div>
            )
        },
        'cli-reference': {
            title: 'CLI Reference',
            icon: Terminal,
            content: (
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white mb-4">Command Line Interface</h2>
                    <div className="space-y-4">
                        <CommandItem
                            cmd="bch-agent init <project>"
                            desc="Create a new framework environment with local logic and contracts."
                        />
                        <CommandItem
                            cmd="bch-agent agent create <name> --type <type>"
                            desc="Generate a pre-built agent. Types: defi, nft, social, vault."
                        />
                        <CommandItem
                            cmd="bch-agent wallet save <mnemonic>"
                            desc="Securely encrypt and store your seed phrase in the local vault."
                        />
                        <CommandItem
                            cmd="bch-agent deploy <name>"
                            desc="Instantiate your agent on-chain and get its unique CashAddr."
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
