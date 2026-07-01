// server/src/routes/soldering.js
import { Router } from 'express';
import { pool } from '../../db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', status = 'All', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let idx = 1;
    let where = 'WHERE 1=1';

    if (status !== 'All') { where += ` AND status=$${idx++}`; params.push(status); }
    if (search) {
      where += ` AND (jeweller_name ILIKE $${idx} OR id ILIKE $${idx})`;
      params.push(`%${search}%`); idx++;
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM soldering_jobs ${where}`, params);
    const dataRes = await pool.query(
      `SELECT * FROM soldering_jobs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    res.json({ data: dataRes.rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) { next(err); }
});

router.get('/meta/stats', async (_req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'In Progress') AS active,
        COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'Completed' AND job_date = CURRENT_DATE) AS completed_today,
        COALESCE(SUM(charges) FILTER (WHERE job_date = CURRENT_DATE), 0) AS today_revenue
      FROM soldering_jobs
    `);
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await pool.query('SELECT * FROM soldering_jobs WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      job_date, jeweller_name, jeweller_id, phone, article_type, material,
      weight, huid, pieces, issue, issue_desc, solder_type, solder_weight,
      estimated_time, operator, delivery_date, status, charges, payment_mode, remarks
    } = req.body;

    if (!jeweller_name || !article_type) {
      return res.status(400).json({ error: 'jeweller_name and article_type are required' });
    }

    const r = await pool.query(
      `INSERT INTO soldering_jobs
        (job_date, jeweller_name, jeweller_id, phone, article_type, material,
         weight, huid, pieces, issue, issue_desc, solder_type, solder_weight,
         estimated_time, operator, delivery_date, status, charges, payment_mode, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       RETURNING *`,
      [job_date || new Date().toISOString().split('T')[0],
       jeweller_name, jeweller_id || null, phone, article_type, material,
       weight || null, huid, pieces || 1, issue, issue_desc, solder_type || 'Easy',
       solder_weight || null, estimated_time || null, operator, delivery_date || null,
       status || 'Pending', charges || 0, payment_mode || 'Cash', remarks]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      job_date, jeweller_name, jeweller_id, phone, article_type, material,
      weight, huid, pieces, issue, issue_desc, solder_type, solder_weight,
      estimated_time, operator, delivery_date, status, charges, payment_mode, remarks
    } = req.body;

    const r = await pool.query(
      `UPDATE soldering_jobs SET
        job_date=$1, jeweller_name=$2, jeweller_id=$3, phone=$4, article_type=$5, material=$6,
        weight=$7, huid=$8, pieces=$9, issue=$10, issue_desc=$11, solder_type=$12,
        solder_weight=$13, estimated_time=$14, operator=$15, delivery_date=$16,
        status=$17, charges=$18, payment_mode=$19, remarks=$20, updated_at=NOW()
       WHERE id=$21 RETURNING *`,
      [job_date, jeweller_name, jeweller_id || null, phone, article_type, material,
       weight, huid, pieces, issue, issue_desc, solder_type,
       solder_weight, estimated_time, operator, delivery_date || null,
       status, charges, payment_mode, remarks, req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const r = await pool.query('DELETE FROM soldering_jobs WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
