require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';

const DATA_FILE = path.join(__dirname, 'mock_db.json');

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
let usersStore = initialData.users.length > 0 ? initialData.users : [
    { id: 'mock-user-id', email: 'demo@bch.network', name: 'Demo Agent', password: '', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo', inventory: [] }
];

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase keys missing. Falling back to MOCK MODE.');
    isMockMode = true;

    supabase = {
        from: (table) => ({
            select: (cols) => {
                const chain = {
                    eq: (col, val) => {
                        let data = [];
                        if (table === 'users') data = usersStore.filter(u => u[col] === val);
                        if (table === 'agents') data = agentsStore.filter(a => a[col] === val);
                        if (table === 'wallets') data = walletsStore.filter(w => w[col] === val);

                        return {
                            single: async () => ({ data: data[0] || null, error: data[0] ? null : { message: 'Not found' } })
                        };
                    },
                    order: (col, { ascending } = { ascending: true }) => ({
                        limit: async (n) => {
                            let results = table === 'logs' ? [...logsStore] :
                                table === 'agents' ? [...agentsStore] :
                                    table === 'wallets' ? [...walletsStore] : [];

                            results.sort((a, b) => {
                                if (a[col] < b[col]) return ascending ? -1 : 1;
                                if (a[col] > b[col]) return ascending ? 1 : -1;
                                return 0;
                            });

                            return {
                                data: results.slice(0, n),
                                error: null
                            };
                        }
                    }),
                    then: (resolve) => {
                        let data = [];
                        if (table === 'agents') data = agentsStore;
                        if (table === 'wallets') data = walletsStore;
                        return resolve({ data, error: null });
                    }
                };
                return chain;
            },
            insert: (items) => {
                if (table === 'agents') {
                    const newAgents = items.map(a => ({ ...a, id: `agent-${Date.now()}`, bonding_curve_progress: 0, holders: 0, created_at: new Date().toISOString() }));
                    agentsStore.push(...newAgents);
                    saveData({ agents: agentsStore, wallets: walletsStore, logs: logsStore, users: usersStore });
                    return { select: () => ({ single: async () => ({ data: newAgents[0], error: null }) }) };
                }
                if (table === 'wallets') {
                    const newWallets = items.map(w => ({ ...w, id: `wallet-${Date.now()}`, created_at: new Date().toISOString() }));
                    walletsStore.push(...newWallets);
                    saveData({ agents: agentsStore, wallets: walletsStore, logs: logsStore, users: usersStore });
                    return { select: () => ({ single: async () => ({ data: newWallets[0], error: null }) }) };
                }
                if (table === 'logs') {
                    logsStore.push(...items);
                    saveData({ agents: agentsStore, wallets: walletsStore, logs: logsStore, users: usersStore });
                    return { select: () => ({ single: async () => ({ data: items[0], error: null }) }) };
                }
                saveData({ agents: agentsStore, wallets: walletsStore, logs: logsStore, users: usersStore });
                return { select: () => ({ single: async () => ({ data: items[0], error: null }) }) };
            },
            update: (updates) => ({
                eq: (col, val) => {
                    if (table === 'agents') {
                        agentsStore = agentsStore.map(a => a[col] === val ? { ...a, ...updates } : a);
                    }
                    if (table === 'users') {
                        usersStore = usersStore.map(u => u[col] === val ? { ...u, ...updates } : u);
                    }
                    saveData({ agents: agentsStore, wallets: walletsStore, logs: logsStore, users: usersStore });
                    return { async: async () => ({ data: null, error: null }) };
                }
            })
        })
    };
}
else {
    supabase = createClient(supabaseUrl, supabaseKey);
}


app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Helper to map DB snake_case to Frontend camelCase
const mapAgent = (a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    type: a.type,
    ticker: a.ticker,
    bondingCurveProgress: a.bonding_curve_progress,
    holders: a.holders,
    status: a.status,
    userId: a.user_id,
    createdAt: a.created_at
});

const mapWallet = (w) => ({
    id: w.id,
    name: w.name,
    address: w.address,
    agentId: w.agent_id,
    userId: w.user_id,
    createdAt: w.created_at
});

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

// Simulation Engine
setInterval(async () => {
    if (isMockMode) return;
    try {
        const { data: agents } = await supabase.from('agents').select('*');
        if (agents && agents.length > 0) {
            const agent = agents[Math.floor(Math.random() * agents.length)];
            let action = '';
            if (agent.type === 'nft') action = `Minted new state commitment: 0x${Math.random().toString(16).substring(2, 10)}`;
            else if (agent.type === 'defi') action = `Rebalanced liquidity pool for ${agent.ticker || 'AGNT'}`;
            else action = `Security heartbeat: All UTXOs verified`;

            await supabase.from('logs').insert([{
                agent_id: agent.id,
                agent_name: agent.name,
                action,
                timestamp: new Date().toISOString()
            }]);
        }
    } catch (e) { }
}, 60000);

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (isMockMode && email === 'demo@bch.network') {
        const user = { id: 'mock-user-id', email: 'demo@bch.network', name: 'Demo Agent', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo', inventory: [] };
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        return res.json({ ...user, token });
    }
    try {
        const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const { data: newUser } = await supabase.from('users').insert([{
                email, password: hashedPassword, name: email.split('@')[0],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                inventory: []
            }]).select().single();
            const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '24h' });
            return res.json({ ...newUser, token });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(403).json({ error: 'Invalid credentials' });
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

app.get('/public/logs', async (req, res) => {
    const { data: logs } = await supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(50);
    res.json(logs || []);
});

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
        name: req.body.name,
        description: req.body.description || 'Autonomous BCH Agent',
        type: req.body.type || 'general',
        ticker: req.body.ticker || '',
        address: req.body.address,
        network: req.body.network || 'testnet4',
        status: req.body.status || 'online',
        agent_id: req.body.agentId,
        user_id: req.user.id
    }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(mapAgent(data));
});

app.get('/wallets', authenticateToken, async (req, res) => {
    const { data: wallets } = await supabase.from('wallets').select('*').eq('user_id', req.user.id);
    res.json((wallets || []).map(mapWallet));
});

app.post('/wallets', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('wallets').insert([{
        name: req.body.name,
        address: req.body.address,
        agent_id: req.body.agentId,
        user_id: req.user.id
    }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(mapWallet(data));
});

app.post('/market/interact', authenticateToken, async (req, res) => {
    const { agentId, action, amount } = req.body;
    try {
        const { data: agent } = await supabase.from('agents').select('*').eq('id', agentId).single();
        const { data: user } = await supabase.from('users').select('*').eq('id', req.user.id).single();
        if (!agent || !user) return res.status(404).json({ error: 'Not found' });

        let logMessage = '';
        let updateData = {};
        const inventory = user.inventory || [];

        if (action === 'buy_nft') {
            logMessage = `User ${user.name} acquired commitment from ${agent.name}`;
            updateData = { holders: (agent.holders || 0) + 1 };
            inventory.push({ id: `asset-${Date.now()}`, agentId, name: `${agent.name} State Commit`, type: 'nft', value: amount || '0.25 BCH' });
        } else if (action === 'inject_liquidity') {
            logMessage = `User ${user.name} injected ${amount} BCH liquidity into ${agent.ticker || agent.name}`;
            updateData = { bonding_curve_progress: Math.min(100, (agent.bonding_curve_progress || 0) + 5) };
            inventory.push({ id: `lp-${Date.now()}`, agentId, name: `${agent.ticker || agent.name} LP Position`, type: 'lp_token', value: `${amount} BCH` });
        }

        await Promise.all([
            supabase.from('agents').update(updateData).eq('id', agentId),
            supabase.from('users').update({ inventory }).eq('id', user.id),
            supabase.from('logs').insert([{ agent_id: agentId, agent_name: agent.name, action: logMessage }])
        ]);
        res.json({ success: true, message: logMessage });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`🔒 Community API on ${PORT}`));
