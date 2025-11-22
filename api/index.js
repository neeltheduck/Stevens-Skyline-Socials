const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { events: [], users: [], sessions: {}, registrations: [] };
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

// Seed initial data if empty
function ensureSeed() {
  const db = readDB();
  if (!db.events || db.events.length === 0) {
    db.events = [
      {
        id: '1',
        name: 'Tech Talk: AI & ML',
        date: '2025-11-05',
        time: '18:00',
        category: 'Academic',
        attendees: 0,
        manager: 'Computer Science Society',
        createdBy: 'org-cs',
        description: 'Join us for an exciting evening exploring the latest developments in artificial intelligence and machine learning. Industry professionals will share insights on current trends and future opportunities in the field.'
      },
      {
        id: '2',
        name: 'Basketball Tournament',
        date: '2025-11-08',
        time: '15:00',
        category: 'Sports',
        attendees: 0,
        manager: 'Athletics Club',
        createdBy: 'org-athletics',
        description: 'Annual inter-department basketball tournament. Form your teams and compete for the championship trophy. All skill levels welcome!'
      }
    ];
    db.users = db.users || [];
    db.registrations = db.registrations || [];
    db.sessions = db.sessions || {};
    // seed a demo user
    if (!db.users.find(u => u.email === 'demo@example.com')) {
      const demoId = 'user-demo';
      db.users.push({ id: demoId, email: 'demo@example.com', firstName: 'Demo', lastName: 'User', passwordHash: bcrypt.hashSync('password', 8) });
    }
    writeDB(db);
  }
}

ensureSeed();

const app = express();
app.use(cors());
app.use(express.json());

function getUserFromToken(req) {
  const auth = req.headers['authorization'];
  if (!auth) return null;
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return null;
  const token = parts[1];
  const db = readDB();
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find(u => u.id === userId) || null;
}

app.post('/api/register', (req, res) => {
  const { email, firstName, lastName, password } = req.body || {};
  if (!email || !firstName || !lastName || !password) return res.status(400).json({ error: 'Missing fields' });
  const db = readDB();
  if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
  const id = 'user-' + Date.now();
  const passwordHash = bcrypt.hashSync(password, 8);
  const user = { id, email, firstName, lastName, passwordHash };
  db.users.push(user);
  writeDB(db);
  res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = 'tkn-' + Date.now() + '-' + Math.round(Math.random() * 100000);
  db.sessions = db.sessions || {};
  db.sessions[token] = user.id;
  writeDB(db);
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
});

app.get('/api/me', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
});

// events
app.get('/api/events', (req, res) => {
  const db = readDB();
  // compute attendees from registrations
  const events = (db.events || []).map(ev => {
    const count = (db.registrations || []).filter(r => r.eventId === ev.id).length;
    return { ...ev, attendees: count };
  });
  res.json(events || []);
});

app.post('/api/events', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const db = readDB();
  const payload = req.body;
  const id = String(Date.now());
  const newEvent = {
    id,
    name: payload.name || 'Untitled',
    date: payload.date || '',
    time: payload.time || '',
    category: payload.category || 'Academic',
    attendees: 0,
    manager: payload.manager || user.email,
    createdBy: user.id,
    description: payload.description || ''
  };
  db.events = db.events || [];
  db.events.push(newEvent);
  writeDB(db);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const id = req.params.id;
  const db = readDB();
  const idx = (db.events || []).findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const existing = db.events[idx];
  if (existing.createdBy !== user.id) return res.status(403).json({ error: 'Forbidden' });
  const updated = { ...existing, ...req.body, id };
  db.events[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete('/api/events/:id', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const id = req.params.id;
  const db = readDB();
  const idx = (db.events || []).findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const existing = db.events[idx];
  if (existing.createdBy !== user.id) return res.status(403).json({ error: 'Forbidden' });
  db.events = (db.events || []).filter(e => e.id !== id);
  db.registrations = (db.registrations || []).filter(r => r.eventId !== id);
  writeDB(db);
  res.status(204).end();
});

// registrations
app.post('/api/events/:id/register', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const eventId = req.params.id;
  const db = readDB();
  db.registrations = db.registrations || [];
  if (!db.registrations.find(r => r.eventId === eventId && r.userId === user.id)) {
    db.registrations.push({ eventId, userId: user.id });
    writeDB(db);
  }
  const count = db.registrations.filter(r => r.eventId === eventId).length;
  res.json({ eventId, attendees: count });
});

app.delete('/api/events/:id/register', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const eventId = req.params.id;
  const db = readDB();
  db.registrations = (db.registrations || []).filter(r => !(r.eventId === eventId && r.userId === user.id));
  writeDB(db);
  const count = db.registrations.filter(r => r.eventId === eventId).length;
  res.json({ eventId, attendees: count });
});

app.get('/api/registrations', (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const db = readDB();
  const regs = (db.registrations || []).filter(r => r.userId === user.id).map(r => r.eventId);
  res.json(regs);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
