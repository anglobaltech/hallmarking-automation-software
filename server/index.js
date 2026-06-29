// server/src/index.js
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { z } from 'zod';
import { config } from './config.js';
import { checkDatabase, pool } from './db.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Schemas
const huidAssignSchema = z.object({
  articleId: z.string(),
  huidNumber: z.string(),
  hallmarkYear: z.string().optional(),
  assayOffice: z.string().optional(),
  certifiedPurity: z.string().optional(),
});

// Routes
app.get('/health', async (_req, res) => {
  try {
    await checkDatabase();
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    res.json({ ok: true, database: 'unavailable' });
  }
});

// Fetch Pending HUID
app.get('/api/huid/pending', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id, 
        a.article_type, 
        a.declared_purity, 
        a.gross_weight,
        c.full_name as customer_name
      FROM articles a
      JOIN customers c ON a.customer_id = c.id
      LEFT JOIN huid_records h ON a.id = h.article_id
      WHERE h.article_id IS NULL 
        AND a.status = 'intake_complete'
      ORDER BY a.created_at DESC
      LIMIT 50
    `);
    res.json({ pending: result.rows });
  } catch (error) {
    next(error);
  }
});

// Assign HUID
app.post('/api/huid/assign', async (req, res, next) => {
  try {
    const parsed = huidAssignSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });

    const { articleId, huidNumber } = parsed.data;

    await pool.query('BEGIN');

    await pool.query(`
      INSERT INTO huid_records (article_id, huid_code, assigned_by)
      VALUES ($1, $2, NULL)
    `, [articleId, huidNumber]);

    await pool.query(`
      UPDATE articles 
      SET status = 'huid_stamped', updated_at = NOW()
      WHERE id = $1
    `, [articleId]);

    await pool.query('COMMIT');

    io.emit('huid_assigned', { articleId, huidNumber });

    res.json({ success: true });
  } catch (error) {
    await pool.query('ROLLBACK');
    next(error);
  }
});

// Socket
io.on('connection', () => console.log('Client connected'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

httpServer.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});