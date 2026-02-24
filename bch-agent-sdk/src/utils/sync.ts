import axios from 'axios';
import { getAuth } from './auth.js';

const API_URL = process.env.AGENT_API_URL || 'http://localhost:4000';

export class SyncService {
    static async syncAgent(name: string, type: string, description: string = '', address: string = '', network: string = '', agentId: string = '') {
        const auth = getAuth();
        if (!auth.user || !auth.user.token) return;

        try {
            await axios.post(`${API_URL}/agents`, {
                name,
                type,
                description,
                address,
                network,
                agentId,
                status: 'online',
                createdAt: new Date().toISOString()
            }, {
                headers: { 'Authorization': `Bearer ${auth.user.token}` }
            });
        } catch (e) {
            // Log error for debugging if needed
            // console.error('Sync error:', e.message);
        }
    }

    static async syncWallet(name: string, address: string, agentId?: string) {
        const auth = getAuth();
        if (!auth.user || !auth.user.token) return;

        try {
            await axios.post(`${API_URL}/wallets`, {
                name,
                address,
                agentId,
                createdAt: new Date().toISOString()
            }, {
                headers: { 'Authorization': `Bearer ${auth.user.token}` }
            });
        } catch (e) {
            // Ignore sync errors
        }
    }

    static async syncLog(agentName: string, level: string, message: string) {
        const auth = getAuth();
        if (!auth.user || !auth.user.token) return;

        try {
            await axios.post(`${API_URL}/agents/logs`, {
                agentName,
                level,
                message,
                timestamp: new Date().toISOString()
            }, {
                headers: { 'Authorization': `Bearer ${auth.user.token}` }
            });
        } catch (e) {
            // Silence sync errors to avoid crashing the runner
        }
    }

    static async syncStatus(name: string, status: 'online' | 'offline' | 'error') {
        const auth = getAuth();
        if (!auth.user || !auth.user.token) return;

        try {
            await axios.patch(`${API_URL}/agents/status`, {
                name,
                status
            }, {
                headers: { 'Authorization': `Bearer ${auth.user.token}` }
            });
        } catch (e) { }
    }
}
