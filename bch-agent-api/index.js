require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
        users: [],
        agents: [],
        wallets: [],
        logs: []
    }, null, 2));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Autonomous Simulation Engine
setInterval(() => {
    const db = getDB();
    if (db.agents && db.agents.length > 0) {
        const agent = db.agents[Math.floor(Math.random() * db.agents.length)];
        let action = '';

        if (agent.type === 'nft') action = `Minted new state commitment: 0x${Math.random().toString(16).substring(2, 10)}`;
        else if (agent.type === 'defi') action = `Rebalanced liquidity pool for ${agent.ticker || 'AGNT'}`;
        else if (agent.type === 'social') action = `Broadcasted autonomous update to Memo.cash`;
        else action = `Security heartbeat: All UTXOs verified`;

        const newLog = {
            id: Date.now().toString(),
            agentId: agent.id,
            agentName: agent.name,
            action,
            timestamp: new Date().toISOString()
        };

        db.logs = [newLog, ...(db.logs || [])].slice(0, 50);
        saveDB(db);
    }
}, 30000);

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

// Routes

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const db = getDB();
    let user = db.users.find(u => u.email === email);

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            name: email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            createdAt: new Date().toISOString(),
            inventory: []
        };
        db.users.push(user);
        saveDB(db);
    } else {
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(403).json({ error: 'Invalid credentials' });
        if (!user.inventory) user.inventory = []; // Ensure inventory exists
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    const { password: _, ...userWithoutPass } = user;
    res.json({ ...userWithoutPass, token });
});

app.get('/auth/me', authenticateToken, (req, res) => {
    const db = getDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.sendStatus(404);
    const { password, ...userWithoutPass } = user;
    if (!userWithoutPass.inventory) userWithoutPass.inventory = [];
    res.json(userWithoutPass);
});

app.get('/public/logs', (req, res) => {
    const db = getDB();
    res.json(db.logs || []);
});

app.get('/public/agents', (req, res) => {
    const db = getDB();
    const publicAgents = db.agents.filter(a => a.userId === 'system' || a.ticker || a.type === 'nft');
    res.json(publicAgents);
});

app.get('/agents', authenticateToken, (req, res) => {
    const db = getDB();
    const userAgents = db.agents.filter(a => a.userId === req.user.id);
    res.json(userAgents);
});

app.post('/agents', authenticateToken, (req, res) => {
    const db = getDB();
    const newAgent = {
        ...req.body,
        id: Date.now().toString(),
        userId: req.user.id
    };
    db.agents.push(newAgent);
    saveDB(db);
    res.json(newAgent);
});

app.get('/wallets', authenticateToken, (req, res) => {
    const db = getDB();
    const userWallets = db.wallets.filter(w => w.userId === req.user.id);
    res.json(userWallets);
});

app.post('/wallets', authenticateToken, (req, res) => {
    const db = getDB();
    const newWallet = {
        ...req.body,
        id: Date.now().toString(),
        userId: req.user.id
    };
    db.wallets.push(newWallet);
    saveDB(db);
    res.json(newWallet);
});

app.post('/market/interact', authenticateToken, (req, res) => {
    const { agentId, action, amount } = req.body;
    const db = getDB();
    const agent = db.agents.find(a => a.id === agentId);
    const userIndex = db.users.findIndex(u => u.id === req.user.id);

    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    const user = db.users[userIndex];
    if (!user.inventory) user.inventory = [];

    // Simulate On-Chain Interaction
    let logMessage = '';

    if (action === 'buy_nft') {
        logMessage = `User ${user.name} acquired commitment from ${agent.name}`;
        if (!agent.holders) agent.holders = 0;
        agent.holders += 1;

        user.inventory.push({
            id: `asset-${Date.now()}`,
            agentId: agent.id,
            name: `${agent.name} State Commit`,
            type: 'nft',
            value: amount || '0.25 BCH',
            acquiredAt: new Date().toISOString()
        });
    } else if (action === 'inject_liquidity') {
        logMessage = `User ${user.name} injected ${amount} BCH liquidity into ${agent.ticker || agent.name}`;
        if (!agent.bondingCurveProgress) agent.bondingCurveProgress = 0;
        agent.bondingCurveProgress = Math.min(100, agent.bondingCurveProgress + 5);

        user.inventory.push({
            id: `lp-${Date.now()}`,
            agentId: agent.id,
            name: `${agent.ticker || agent.name} LP Position`,
            type: 'lp_token',
            value: `${amount} BCH`,
            acquiredAt: new Date().toISOString()
        });
    } else {
        logMessage = `User ${user.name} interacted with ${agent.name}: ${action}`;
    }

    const newLog = {
        id: Date.now().toString(),
        agentId: agent.id,
        agentName: agent.name,
        action: logMessage,
        timestamp: new Date().toISOString()
    };

    db.logs = [newLog, ...(db.logs || [])].slice(0, 50);

    // Update DB
    const agentIndex = db.agents.findIndex(a => a.id === agentId);
    db.agents[agentIndex] = agent;
    db.users[userIndex] = user;

    saveDB(db);

    res.json({ success: true, message: logMessage, newLevel: agent.bondingCurveProgress });
});

app.listen(PORT, () => {
    console.log(`🔒 Secure BCH Agent API running on http://localhost:${PORT}`);
});
