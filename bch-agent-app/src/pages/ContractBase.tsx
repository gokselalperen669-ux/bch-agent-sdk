import React, { useState } from 'react';
import { Shield, Plus, Code, FileCode, CheckCircle2, Download, Copy, Zap } from 'lucide-react';

interface ContractTemplate {
    id: string;
    name: string;
    description: string;
    type: 'Vault' | 'DeFi' | 'Social' | 'NFT';
    status: 'Ready' | 'Deprecated';
    code: string;
}

const ContractBase: React.FC = () => {
    const [templates] = useState<ContractTemplate[]>([
        {
            id: '1',
            name: 'AgentBase.cash',
            description: 'Core security covenant with multi-sig escalation and vault protection.',
            type: 'Vault',
            status: 'Ready',
            code: 'pragma cashscript ^0.12.0;\n\ncontract AgentBase(pubkey ownerPk, bytes20 agentId) {\n    function execute(sig ownerSig) {\n        require(checkSig(ownerSig, ownerPk));\n    }\n}'
        },
        {
            id: '2',
            name: 'DeFiAlpha.cash',
            description: 'Optimized for DEX interactions and automated liquidity provision.',
            type: 'DeFi',
            status: 'Ready',
            code: 'pragma cashscript ^0.12.0;\n\ncontract DeFiAlpha(pubkey ownerPk, bytes20 agentId) {\n    function swap(sig ownerSig) {\n        require(checkSig(ownerSig, ownerPk));\n    }\n}'
        },
        {
            id: '3',
            name: 'SocialRelay.cash',
            description: 'Handles Memo.cash OP_RETURN outputs and metadata commits.',
            type: 'Social',
            status: 'Ready',
            code: 'pragma cashscript ^0.12.0;\n\ncontract SocialRelay(pubkey ownerPk) {\n    function push(sig ownerSig) {\n        require(checkSig(ownerSig, ownerPk));\n    }\n}'
        }
    ]);

    const [selectedContract, setSelectedContract] = useState<ContractTemplate | null>(templates[0]);

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-fade-in text-white">
            <header className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-color/20 rounded-lg text-primary-color">
                            <Shield size={18} />
                        </div>
                        <span className="text-[10px] font-black text-primary-color uppercase tracking-[0.3em]">Covenant Registry</span>
                    </div>
                    <h3 className="text-6xl font-black font-title tracking-tighter italic uppercase">CONTRACT BASE</h3>
                    <p className="text-text-tertiary text-sm max-w-xl font-medium">Verified smart contract templates audit-ready for Bitcoin Cash. Deploy these schemas directly to the network.</p>
                </div>

                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Audit History</button>
                    <button className="px-10 py-3 bg-primary-color text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all shadow-xl shadow-primary-color/20 flex items-center gap-3">
                        <Plus size={14} strokeWidth={3} />
                        New Schema
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Column */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-text-tertiary tracking-widest mb-6">Verified Templates</h4>
                    {templates.map(contract => (
                        <div
                            key={contract.id}
                            onClick={() => setSelectedContract(contract)}
                            className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${selectedContract?.id === contract.id ? 'bg-primary-color/10 border-primary-color shadow-[0_0_20px_rgba(0,227,57,0.05)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${selectedContract?.id === contract.id ? 'bg-primary-color/20 text-primary-color' : 'bg-white/5 text-text-tertiary'}`}>
                                        <FileCode size={16} />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">{contract.name}</span>
                                </div>
                                {contract.status === 'Ready' && (
                                    <CheckCircle2 size={14} className="text-primary-color" />
                                )}
                            </div>
                            <p className="text-[10px] text-text-tertiary leading-relaxed mb-4">{contract.description}</p>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-black text-text-tertiary uppercase">{contract.type}</span>
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[8px] font-black text-text-tertiary uppercase">BCH-0.12.x</span>
                            </div>
                        </div>
                    ))}

                    <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary-color/30 transition-all opacity-40 hover:opacity-100">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary-color/10">
                            <Plus size={20} className="text-text-tertiary group-hover:text-primary-color" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Import Custom Cash</span>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-8 min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-primary-color/10 border border-primary-color/20 rounded-xl flex items-center justify-center text-primary-color">
                                    <Code size={20} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black italic uppercase text-white tracking-tight">{selectedContract?.name}</h4>
                                    <p className="text-[9px] text-text-tertiary uppercase font-black tracking-widest mt-1">Ready for Compilation</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white/5 rounded-xl text-text-secondary hover:text-white transition-all"><Copy size={16} /></button>
                                <button className="p-3 bg-white/5 rounded-xl text-text-secondary hover:text-white transition-all"><Download size={16} /></button>
                                <button className="px-6 py-3 bg-primary-color text-black font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all">
                                    <Zap size={14} /> Deploy Now
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-black/40 rounded-2xl p-8 font-mono text-xs border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-4 right-4 text-[9px] font-black text-text-tertiary uppercase bg-black/60 px-2 py-1 rounded-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">cashscript</div>
                            <pre className="text-primary-color/80 leading-relaxed overflow-x-auto selection:bg-primary-color/20">
                                {selectedContract?.code}
                                <span className="animate-pulse inline-block w-1 h-3 bg-primary-color ml-1 align-middle" />
                            </pre>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <DetailItem label="Compiler Version" value="^0.12.0" />
                            <DetailItem label="Security Audit" value="PASSED" />
                            <DetailItem label="Network Compatibility" value="TESTNET4 / MAIN" />
                            <DetailItem label="License" value="MIT-OPEN" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="space-y-1">
        <p className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">{label}</p>
        <p className="text-[10px] font-bold text-white uppercase">{value}</p>
    </div>
);

export default ContractBase;

