import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User } from '../types';
import { getApiUrl } from '../config';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('nexus_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                if (parsed && typeof parsed === 'object' && parsed.token) {
                    setUser(parsed);
                } else {
                    localStorage.removeItem('nexus_user');
                }
            } catch {
                localStorage.removeItem('nexus_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(getApiUrl('/auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Authentication failed');
            }

            const userData = await response.json();
            const user: User = {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar,
                token: userData.token,
                inventory: userData.inventory || []
            };

            setUser(user);
            localStorage.setItem('nexus_user', JSON.stringify(user));
        } catch (error: any) {
            console.error('Login Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(getApiUrl('/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name: email.split('@')[0] })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Registration failed');
            }

            const userData = await response.json();
            const user: User = {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar,
                token: userData.token,
                inventory: []
            };

            setUser(user);
            localStorage.setItem('nexus_user', JSON.stringify(user));
        } catch (error: any) {
            console.error('Registration Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nexus_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
