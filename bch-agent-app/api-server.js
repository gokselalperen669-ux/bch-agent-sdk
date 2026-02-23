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
    console.warn('⚠️  Supabase keys missing. Falling back to MOCK MODE.');
    isMockMode = true;
    supabase = {
        from: (table) => ({
            select: (cols) => ({
                eq: (col, val) => ({
                    single: async () => {
                        let data = [];
                        if (table === 'users') data = usersStore.filter(u => u[col] === val);
                        if (table === 'agents') data = agentsStore.filter(a => a[col] === val);
                        return { data: data[0] || null, error: data[0] ? null : { message: 'Not found' } };
                    }
                }),
                order: (col, { ascending } = { ascending: true }) => ({
                    limit: async (n) => {
                        let results = table === 'logs' ? [...logsStore] : table === 'agents' ? [...agentsStore] : [];
                        results.sort((a, b) => (ascending ? (a[col] > b[col] ? 1 : -1) : (a[col] < b[col] ? 1 : -1)));
                        return { data: results.slice(0, n), error: null };
                    }
                }),
                then: (resolve) => {
                    let data = table === 'agents' ? agentsStore : table === 'wallets' ? walletsStore : [];
                    return resolve({ data, error: null });
                }
            }),
            insert: (items) => {
                const itemsWithIds = items.map(i => ({ ...i, id: i.id || (Math.random() * 1000000).toFixed(0) }));
                if (table === 'agents') agentsStore.push(...itemsWithIds);
                if (table === 'users') usersStore.push(...itemsWithIds);
                if (table === 'logs') logsStore.push(...itemsWithIds);
                if (table === 'wallets') walletsStore.push(...itemsWithIds);
                saveData({ agents: agentsStore, wallets: walletsStore, logs: logsStore, users: usersStore });
                return { select: () => ({ single: async () => ({ data: itemsWithIds[0], error: null }) }) };
            },
            update: (updates) => ({
                eq: (col, val) => {
                    if (table === 'agents') agentsStore = agentsStore.map(a => a[col] === val ? { ...a, ...updates } : a);
                    if (table === 'users') usersStore = usersStore.map(u => u[col] === val ? { ...u, ...updates } : u);
                    saveData({ agents: agentsStore, wallets: walletsStore, logs: logsStore, users: usersStore });
                    return { async: async () => ({ data: null, error: null }) };
                }
            })
        })
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
    const { email, password } = req.body;
    try {
        const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
        if (error || !user) return res.status(404).json({ error: 'User not found. Please register.' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid access key (Password)' });
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        const { password: _, ...userWithoutPass } = user;
        res.json({ ...userWithoutPass, token });
    } catch (e) { res.status(500).json({ error: e.message }); }
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
