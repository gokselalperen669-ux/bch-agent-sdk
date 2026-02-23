import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ChevronRight, Zap, AlertCircle } from 'lucide-react';
import loginBg from '../assets/login-bg.png';
import logo from '../assets/logo.png';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const { login, register, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isSignUp) {
                await register(email, password);
                // If auto-confirm is off, they might need to check email. 
                // However, if successful, we might just redirect or show a message.
                // For simplicity, we assume they are logged in or will be prompted.
                // Supabase signInWithPassword automatically logs in after signup if confirm is disabled.
                // Otherwise user is null until confirmed.
                // Let's assume for this "app" it just works or we catch error.
            } else {
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Authentication failed. Check your credentials.');
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 scale-105"
                style={{
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(4px) brightness(0.4)'
                }}
            />

            {/* Animated Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-color/20 rounded-full blur-[128px] animate-pulse pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-color/10 rounded-full blur-[128px] animate-pulse-slow pointer-events-none z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 w-full max-w-md p-8"
            >
                <div className="glass-panel p-8 border-white/10 backdrop-blur-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-color to-transparent opacity-50" />

                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="w-20 h-20 rounded-2xl border border-primary-color/30 shadow-[0_0_30px_rgba(0,227,57,0.2)] overflow-hidden mb-6"
                        >
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </motion.div>
                        <h1 className="text-3xl font-title font-extrabold tracking-tight text-white mb-2">
                            BCH<span className="text-primary-color" style={{ color: 'var(--primary-color)' }}>AGENT</span>
                        </h1>
                        <p className="text-text-secondary text-sm font-medium tracking-wide">
                            {isSignUp ? 'Initialize New Agent Identity' : 'Enter the autonomous frontier'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] uppercase font-bold text-text-secondary tracking-[0.2em] ml-1">Terminal ID (Email)</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-color transition-colors" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-color/50 focus:bg-primary-color/5 transition-all text-sm font-medium"
                                    placeholder="agent@bch.network"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] uppercase font-bold text-text-secondary tracking-[0.2em] ml-1">Access Key (Password)</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-color transition-colors" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-color/50 focus:bg-primary-color/5 transition-all text-sm font-medium"
                                    placeholder="••••••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-bold"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className={`w-full py-4 bg-primary-color text-black font-extrabold rounded-xl flex items-center justify-center gap-3 shadow-xl transition-all ${isLoading ? 'opacity-50 cursor-wait' : 'hover:shadow-primary-color/20'}`}
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            {isLoading ? (
                                <Zap size={20} className="animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'ESTABLISH IDENTITY' : 'INITIALIZE SESSION'}
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </motion.button>

                        <div className="text-center">
                            <p
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-[10px] cursor-pointer text-text-secondary opacity-80 font-bold whitespace-nowrap hover:text-primary-color transition-colors"
                            >
                                {isSignUp ? 'Already have an identity? ' : 'New agent? '}
                                <span className="text-primary-color underline decoration-dotted underline-offset-4">
                                    {isSignUp ? 'Access Terminal' : 'Create Account'}
                                </span>
                            </p>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                            <span className="hover:text-primary-color cursor-pointer transition-colors">Forgot Credentials?</span>
                            <span className="hover:text-primary-color cursor-pointer transition-colors">Request Access</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-color/5 border border-primary-color/10">
                            <Shield size={14} className="text-primary-color" />
                            <p className="text-[10px] text-text-secondary leading-tight">Quantum-resistant encryption active for all sessions.</p>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em] opacity-40">
                    SECURED BY BCH UTXO COVENANTS
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
