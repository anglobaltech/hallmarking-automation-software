// server/index.js — Main entry point
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config.js';
import { checkDatabase, pool } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route modules
import jewellersRouter from './src/routes/jewellers.js';
import laserRouter from './src/routes/laser.js';
import xrfRouter from './src/routes/xrf.js';
import solderingRouter from './src/routes/soldering.js';
import fireRouter from './src/routes/fire.js';
import exchangeRouter from './src/routes/exchange.js';
import dashboardRouter from './src/routes/dashboard.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));

// Request logger (dev)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    const time = await checkDatabase();
    res.json({ ok: true, database: 'connected', serverTime: time });
  } catch (error) {
    res.json({ ok: true, database: 'unavailable', error: error.message });
  }
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/jewellers', jewellersRouter);
app.use('/api/laser-jobs', laserRouter);
app.use('/api/xrf-tests', xrfRouter);
app.use('/api/soldering-jobs', solderingRouter);
app.use('/api/fire-assays', fireRouter);
app.use('/api/gold-exchanges', exchangeRouter);
app.use('/api/dashboard', dashboardRouter);

// ─── Socket.IO ────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Export io so routes can emit events
export { io };

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    path: req.path,
  });
});

// ─── Start Server ─────────────────────────────────────────────
httpServer.listen(config.port, async () => {
  console.log(`\n🚀 Server running on http://localhost:${config.port}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   CRUD /api/jewellers`);
  console.log(`   CRUD /api/laser-jobs`);
  console.log(`   CRUD /api/xrf-tests`);
  console.log(`   CRUD /api/soldering-jobs`);
  console.log(`   CRUD /api/fire-assays`);
  console.log(`   CRUD /api/gold-exchanges`);
  console.log(`   GET  /api/dashboard/stats`);

  try {
    await checkDatabase();
    console.log(`✅ PGlite (WASM PostgreSQL) connected\n`);

    // Auto-migrate if empty
    const { rows } = await pool.query(`SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'`);
    if (parseInt(rows[0].count) === 0) {
      console.log('📦 Database is empty. Running migrations...');
      const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_init.sql'), 'utf-8');
      await pool.exec(sql);
      console.log('✅ Migrations applied successfully.\n');
    }
  } catch (err) {
    console.log(`⚠️  Database error: ${err.message}`);
  }
});