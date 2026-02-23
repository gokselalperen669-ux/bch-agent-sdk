import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    Wallet,
    Settings as SettingsIcon,
    Share2,
    Activity,
    Database,
    Code,
    BookOpen,
    LogOut,
    Menu,
    X,
    LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navigationGroups = [
        {
            title: 'Core',
            items: [
                { icon: Activity, label: 'Command Center', path: '/dashboard' },
                { icon: Share2, label: 'API Connectors', path: '/connectors' },
                { icon: Bot, label: 'Agent Lab', path: '/lab' },
            ]
        },
        {
            title: 'Ecosystem',
            items: [
                { icon: LayoutGrid, label: 'NFT Studio', path: '/studio' },
                { icon: Database, label: 'Token Exchange', path: '/exchange' },
                { icon: Wallet, label: 'Vault', path: '/wallet' },
            ]
        },
        {
            title: 'Development',
            items: [
                { icon: Code, label: 'Contract Base', path: '/contracts' },
                { icon: BookOpen, label: 'Documentation', path: '/docs' },
            ]
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#0a0a0b] text-text-primary overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="relative z-40 flex flex-col border-r border-white/5 bg-[#0d0d0f]/80 backdrop-blur-xl"
            >
                <div className="flex h-20 items-center justify-between px-6">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-color text-black shadow-lg shadow-primary-color/20">
                                <Bot size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-black tracking-tighter font-title uppercase">BCH<span className="text-primary-color">NEXUS</span></span>
                        </div>
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-color text-black">
                            <Bot size={24} strokeWidth={2.5} />
                        </div>
                    )}
                </div>

                <nav className="flex-1 space-y-8 px-3 py-4 overflow-y-auto custom-scroll">
                    {navigationGroups.map((group) => (
                        <div key={group.title} className="space-y-1">
                            {isSidebarOpen && (
                                <h5 className="px-4 text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-2">
                                    {group.title}
                                </h5>
                            )}
                            {group.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 group ${isActive
                                            ? 'bg-primary-color/10 text-primary-color border border-primary-color/20'
                                            : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={22} className={isActive ? 'text-primary-color' : 'group-hover:text-white transition-colors'} />
                                        {isSidebarOpen && (
                                            <span className="text-sm font-bold tracking-tight uppercase">{item.label}</span>
                                        )}
                                        {isActive && isSidebarOpen && (
                                            <div className="ml-auto h-1 w-1 rounded-full bg-primary-color shadow-[0_0_10px_rgba(0,227,57,0.5)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-4">
                    <button
                        onClick={() => navigate('/settings')}
                        className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-text-secondary hover:bg-white/5 hover:text-white transition-all ${location.pathname === '/settings' ? 'bg-white/5 text-white' : ''
                            }`}
                    >
                        <SettingsIcon size={22} />
                        {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-tight">Settings</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold"
                    >
                        <LogOut size={22} />
                        {isSidebarOpen && <span className="text-sm uppercase tracking-tight">Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background Glows (Moved to bottom of stack) */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-color/5 blur-[120px] rounded-full pointer-events-none z-0" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 z-30 border-b border-white/5 bg-[#0a0a0b]/40 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-white transition-all"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest leading-none">Status</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-xs font-black text-white uppercase tracking-tighter">BCH Network Live</span>
                            </div>
                        </div>

                        <div className="h-10 w-[1px] bg-white/5" />

                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all group">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{user?.name || 'Authorized'}</span>
                                <span className="text-[11px] font-black text-white group-hover:text-primary-color transition-colors">ACCOUNT-ACTIVE</span>
                            </div>
                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary-color/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                                <Bot size={18} className="text-primary-color" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto custom-scroll p-8 relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
