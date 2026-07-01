// server/src/routes/laser.js
import { Router } from 'express';
import { pool } from '../../db.js';

const router = Router();

// GET all laser jobs
router.get('/', async (req, res, next) => {
  try {
    const { search = '', status = 'All', date_from, date_to, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let idx = 1;
    let where = 'WHERE 1=1';

    if (status !== 'All') { where += ` AND status=$${idx++}`; params.push(status); }
    if (date_from) { where += ` AND job_date>=$${idx++}`; params.push(date_from); }
    if (date_to) { where += ` AND job_date<=$${idx++}`; params.push(date_to); }
    if (search) {
      where += ` AND (jeweller_name ILIKE $${idx} OR id ILIKE $${idx} OR huid ILIKE $${idx})`;
      params.push(`%${search}%`); idx++;
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM laser_jobs ${where}`, params);
    const result = await pool.query(
      `SELECT * FROM laser_jobs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    res.json({ data: result.rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) { next(err); }
});

// GET today's stats
router.get('/meta/stats', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE job_date = CURRENT_DATE) AS today_jobs,
        SUM(pieces) FILTER (WHERE job_date = CURRENT_DATE) AS today_pieces,
        COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
        COALESCE(SUM(charges) FILTER (WHERE job_date = CURRENT_DATE), 0) AS today_revenue
      FROM laser_jobs
    `);
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// GET single job
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM laser_jobs WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// POST create job
router.post('/', async (req, res, next) => {
  try {
    const {
      job_date, jeweller_name, jeweller_id, phone, article_type, material,
      pieces, weight, huid, start_huid, end_huid, description, operator,
      charges, payment_mode, status, remarks
    } = req.body;

    if (!jeweller_name || !article_type || !material) {
      return res.status(400).json({ error: 'jeweller_name, article_type and material are required' });
    }

    const result = await pool.query(
      `INSERT INTO laser_jobs
        (job_date, jeweller_name, jeweller_id, phone, article_type, material,
         pieces, weight, huid, start_huid, end_huid, description, operator,
         charges, payment_mode, status, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [job_date || 'NOW()', jeweller_name, jeweller_id || null, phone,
       article_type, material, pieces || 1, weight || null,
       huid, start_huid, end_huid, description, operator,
       charges || 0, payment_mode || 'Cash', status || 'Pending', remarks]
    );

    // Update jeweller huid_issued count if linked
    if (jeweller_id) {
      await pool.query(
        `UPDATE jewellers SET huid_issued = huid_issued + $1, updated_at=NOW() WHERE id=$2`,
        [parseInt(pieces) || 1, jeweller_id]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// PUT update job
router.put('/:id', async (req, res, next) => {
  try {
    const {
      job_date, jeweller_name, jeweller_id, phone, article_type, material,
      pieces, weight, huid, start_huid, end_huid, description, operator,
      charges, payment_mode, status, remarks
    } = req.body;

    const result = await pool.query(
      `UPDATE laser_jobs SET
        job_date=$1, jeweller_name=$2, jeweller_id=$3, phone=$4, article_type=$5, material=$6,
        pieces=$7, weight=$8, huid=$9, start_huid=$10, end_huid=$11, description=$12, operator=$13,
        charges=$14, payment_mode=$15, status=$16, remarks=$17, updated_at=NOW()
       WHERE id=$18 RETURNING *`,
      [job_date, jeweller_name, jeweller_id || null, phone, article_type, material,
       pieces, weight, huid, start_huid, end_huid, description, operator,
       charges, payment_mode, status, remarks, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// DELETE job
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM laser_jobs WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
