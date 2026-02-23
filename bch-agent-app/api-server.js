import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET || 'nexus_protocol_secure_layer_2026';

let isMockMode = false;
const DATA_FILE = path.join(__dirname, 'db.json');

const loadData = () => {
    if (fs.existsSync(DATA_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {
            return { agents: [], wallets: [], logs: [], users: [] };
        }
    }
    return { agents: [], wallets: [], logs: [], users: [] };
};

const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const initialData = loadData();
let agentsStore = initialData.agents || [];
let walletsStore = initialData.wallets || [];
let logsStore = initialData.logs || [];
let usersStore = initialData.users || [];

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
let supabase;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase keys missing. Falling back to SUSTAINABLE MOCK MODE.');
    isMockMode = true;

    const mockMethod = (table) => {
        return {
            select: (cols) => ({
                eq: (col, val) => ({
                    single: async () => {
                        let store = [];
                        if (table === 'users') store = usersStore;
                        else if (table === 'agents') store = agentsStore;
                        else if (table === 'wallets') store = walletsStore;
                        else if (table === 'logs') store = logsStore;
                        const data = store.find(u => u[col] === val);
                        return { data: data || null, error: data ? null : { message: 'Not found' } };
                    },
                    order: (col, { ascending } = { ascending: true }) => ({
                        limit: async (n) => {
                            let store = [];
                            if (table === 'logs') store = logsStore;
                            const filtered = store.filter(u => u[col] === val);
                            const sorted = [...filtered].sort((a, b) => (ascending ? (a[col] > b[col] ? 1 : -1) : (a[col] < b[col] ? 1 : -1)));
                            return { data: sorted.slice(0, n), error: null };
                        }
                    })
                }),
                then: (resolve) => {
                    let store = [];
                    if (table === 'agents') store = agentsStore;
                    else if (table === 'wallets') store = walletsStore;
                    else if (table === 'users') store = usersStore;
                    return resolve({ data: store, error: null });
                },
                order: (col, { ascending } = { ascending: true }) => ({
                    limit: async (n) => {
                        let store = [];
                        if (table === 'logs') store = logsStore;
                        else if (table === 'agents') store = agentsStore;
                        const sorted = [...store].sort((a, b) => (ascending ? (a[col] > b[col] ? 1 : -1) : (a[col] < b[col] ? 1 : -1)));
                        return { data: sorted.slice(0, n), error: null };
                    }
                })
            }),
            insert: (items) => ({
                select: () => ({
                    single: async () => {
                        const newItem = {
                            ...items[0],
                            id: items[0].id || `gen_${Math.random().toString(36).substr(2, 9)}`,
                            created_at: new Date().toISOString()
                        };
                        if (table === 'users') usersStore.push(newItem);
                        else if (table === 'agents') agentsStore.push(newItem);
                        else if (table === 'wallets') walletsStore.push(newItem);
                        else if (table === 'logs') logsStore.push(newItem);
                        saveData({ users: usersStore, agents: agentsStore, wallets: walletsStore, logs: logsStore });
                        return { data: newItem, error: null };
                    }
                })
            }),
            upsert: (item, { onConflict } = {}) => ({
                select: () => ({
                    single: async () => {
                        const col = onConflict || 'id';
                        let store = [];
                        if (table === 'users') store = usersStore;
                        else if (table === 'agents') store = agentsStore;
                        // Special handling for user_settings if needed, but here we use stores
                        const idx = store.findIndex(u => u[col] === item[col]);
                        if (idx > -1) {
                            store[idx] = { ...store[idx], ...item, updated_at: new Date().toISOString() };
                        } else {
                            store.push({ ...item, id: item.id || `gen_${Math.random().toString(36).substr(2, 9)}`, created_at: new Date().toISOString() });
                        }
                        saveData({ users: usersStore, agents: agentsStore, wallets: walletsStore, logs: logsStore });
                        return { data: item, error: null };
                    }
                })
            }),
            update: (updates) => ({
                eq: (col, val) => ({
                    async single() {
                        if (table === 'agents') agentsStore = agentsStore.map(a => a[col] === val ? { ...a, ...updates } : a);
                        else if (table === 'users') usersStore = usersStore.map(u => u[col] === val ? { ...u, ...updates } : u);
                        saveData({ users: usersStore, agents: agentsStore, wallets: walletsStore, logs: logsStore });
                        return { data: null, error: null };
                    }
                })
            }),
            delete: () => ({
                eq: (col, val) => ({
                    async single() {
                        if (table === 'agents') agentsStore = agentsStore.filter(a => a[col] !== val);
                        saveData({ users: usersStore, agents: agentsStore, wallets: walletsStore, logs: logsStore });
                        return { data: null, error: null };
                    }
                })
            })
        };
    };

    supabase = {
        from: mockMethod
    };
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString(), mode: isMockMode ? 'mock' : 'production' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Static files for SPA
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

// --- API ENDPOINTS ---

app.post('/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const { data: existing } = await supabase.from('users').select('*').eq('email', email).single();
        if (existing) return res.status(400).json({ error: 'Email already registered' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data: newUser, error } = await supabase.from('users').insert([{
            email, password: hashedPassword, name: name || email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, inventory: []
        }]).select().single();
        if (error) throw error;
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '24h' });
        const { password: _, ...userWithoutPass } = newUser;
        res.json({ ...userWithoutPass, token });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/auth/login', async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    email = email.toLowerCase().trim();
    console.log(`📡 [AUTH] Login attempt: ${email}`);

    try {
        // 1. Try Supabase
        let { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();

        // 2. Local Fallback (Guaranteed for dev)
        if (!user && isMockMode) {
            console.log(`🔍 [AUTH] User ${email} not in primary DB. Checking local store...`);
            user = usersStore.find(u => u.email.toLowerCase().trim() === email);
            if (user) console.log(`✅ [AUTH] User matched.`);
        }

        if (!user) {
            console.log(`❌ [AUTH] User ${email} not found.`);
            return res.status(404).json({ error: 'User not found. Please register.' });
        }

        // 3. Sustainable Password Verification
        let valid = false;

        // Use bcrypt for hashed passwords
        try {
            valid = await bcrypt.compare(password, user.password);
        } catch (e) {
            valid = false;
        }

        // Migration Fallback: If not valid via bcrypt, check if it's plaintext (non-production only)
        if (!valid && isMockMode && password === user.password) {
            valid = true;
            console.log(`⚠️  [AUTH] Plaintext Login: ${email}. Hashing password for future use...`);
            // Auto-migrate to hashed password
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            // Update in store/database
            await supabase.from('users').update({ password: hashedPassword }).eq('id', user.id).single();
        }

        if (!valid) {
            console.log(`❌ [AUTH] Password mismatch for ${email}`);
            return res.status(401).json({ error: 'Invalid access key (Password)' });
        }

        // 4. Success Response
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        const { password: _, ...userWithoutPass } = user;

        console.log(`🎉 [AUTH] Success: ${email}`);
        res.json({ ...userWithoutPass, token });
    } catch (e) {
        console.error(`🔥 [AUTH] Error:`, e.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/auth/me', authenticateToken, async (req, res) => {
    try {
        const { data: user, error } = await supabase.from('users').select('*').eq('id', req.user.id).single();
        if (error || !user) return res.status(404).json({ error: 'User not found' });
        const { password: _, ...userWithoutPass } = user;
        res.json(userWithoutPass);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const mapAgent = (a) => ({ id: a.id, name: a.name, description: a.description, type: a.type, ticker: a.ticker, bondingCurveProgress: a.bonding_curve_progress || a.bondingCurveProgress, holders: a.holders, status: a.status, userId: a.user_id || a.userId, createdAt: a.created_at || a.createdAt });

app.get('/public/agents', async (req, res) => {
    const { data: agents } = await supabase.from('agents').select('*');
    res.json((agents || []).map(mapAgent));
});

app.get('/public/logs', async (req, res) => {
    const { data: logs } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(20);
    res.json(logs || []);
});

app.get('/agents', authenticateToken, async (req, res) => {
    const { data: agents } = await supabase.from('agents').select('*').eq('user_id', req.user.id);
    res.json((agents || []).map(mapAgent));
});

app.post('/agents', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('agents').insert([{
        name: req.body.name, description: req.body.description || 'Autonomous BCH Agent',
        type: req.body.type || 'general', ticker: req.body.ticker || '', address: req.body.address,
        network: req.body.network || 'testnet4', status: req.body.status || 'online',
        agent_id: req.body.agentId, user_id: req.user.id
    }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(mapAgent(data));
});

app.get('/wallets', authenticateToken, async (req, res) => {
    const { data: wallets } = await supabase.from('wallets').select('*').eq('user_id', req.user.id);
    res.json(wallets || []);
});

app.post('/wallets', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('wallets').insert([{
        name: req.body.name, address: req.body.address, agent_id: req.body.agentId, user_id: req.user.id
    }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Market Interactions
app.post('/market/interact', authenticateToken, async (req, res) => {
    const { agentId, action, amount } = req.body;
    try {
        const { data: agent } = await supabase.from('agents').select('name').eq('id', agentId).single();
        const agentName = agent ? agent.name : 'Unknown Agent';

        const logEntry = {
            agent_id: agentId,
            agentName: agentName,
            action: `${action.toUpperCase()}: ${amount} BCH`,
            user_id: req.user.id,
            timestamp: new Date().toISOString()
        };

        await supabase.from('logs').insert([logEntry]);
        res.json({ success: true, message: `Action ${action} executed for ${agentName}` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// SPA catch-all
if (fs.existsSync(distPath)) {
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/auth') && !req.path.startsWith('/agents') && !req.path.startsWith('/wallets') && !req.path.startsWith('/public') && !req.path.startsWith('/health')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
}

// Check if we should start the standalone server (Docker/Local) or export for Serverless (Vercel)
const isVercel = process.env.VERCEL === '1';
if (!isVercel || process.env.RUN_LOCAL === 'true') {
    app.listen(PORT, () => console.log(`🚀 Nexus Engine on port ${PORT} [Mode: ${isMockMode ? 'Mock' : 'Production'}]`));
}

export default app;
