// server/src/routes/fire.js
import { Router } from 'express';
import { pool } from '../../db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', result: filterResult = 'All', page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let idx = 1;
    let where = 'WHERE 1=1';

    if (filterResult !== 'All') { where += ` AND result=$${idx++}`; params.push(filterResult); }
    if (search) {
      where += ` AND (jeweller_name ILIKE $${idx} OR sample_id ILIKE $${idx} OR id ILIKE $${idx})`;
      params.push(`%${search}%`); idx++;
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM fire_assays ${where}`, params);
    const dataRes = await pool.query(
      `SELECT * FROM fire_assays ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    res.json({ data: dataRes.rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) { next(err); }
});

router.get('/meta/stats', async (_req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE assay_date = CURRENT_DATE) AS today_assays,
        COUNT(*) FILTER (WHERE result = 'Pass') AS pass_count,
        COUNT(*) FILTER (WHERE result = 'Fail') AS fail_count,
        COUNT(*) AS total,
        COALESCE(AVG(purity),0)::NUMERIC(6,2) AS avg_purity,
        COALESCE(SUM(charges) FILTER (WHERE assay_date = CURRENT_DATE), 0) AS today_revenue
      FROM fire_assays
    `);
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await pool.query('SELECT * FROM fire_assays WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Assay not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      assay_date, sample_id, jeweller_name, jeweller_id, phone, bis_license,
      article_type, material, article_weight, huid, pieces,
      cupel_no, crucible_no, sample_weight, lead_weight, silver_used,
      ash_weight, bead_weight, parcel_weight,
      purity, fineness, hallmark_grade, result, furnace_temp,
      operator, charges, payment_mode, remarks
    } = req.body;

    if (!jeweller_name || !article_type) {
      return res.status(400).json({ error: 'jeweller_name and article_type are required' });
    }

    const r = await pool.query(
      `INSERT INTO fire_assays
        (assay_date, sample_id, jeweller_name, jeweller_id, phone, bis_license,
         article_type, material, article_weight, huid, pieces,
         cupel_no, crucible_no, sample_weight, lead_weight, silver_used,
         ash_weight, bead_weight, parcel_weight,
         purity, fineness, hallmark_grade, result, furnace_temp,
         operator, charges, payment_mode, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
       RETURNING *`,
      [assay_date || new Date().toISOString().split('T')[0],
       sample_id, jeweller_name, jeweller_id || null, phone, bis_license,
       article_type, material || 'Gold', article_weight || null, huid, pieces || 1,
       cupel_no, crucible_no, sample_weight || null, lead_weight || null, silver_used || null,
       ash_weight || null, bead_weight || null, parcel_weight || null,
       purity || null, fineness || null, hallmark_grade || '916', result || 'Pass', furnace_temp || 900,
       operator, charges || 0, payment_mode || 'Cash', remarks]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      assay_date, sample_id, jeweller_name, jeweller_id, phone, bis_license,
      article_type, material, article_weight, huid, pieces,
      cupel_no, crucible_no, sample_weight, lead_weight, silver_used,
      ash_weight, bead_weight, parcel_weight,
      purity, fineness, hallmark_grade, result, furnace_temp,
      operator, charges, payment_mode, remarks
    } = req.body;

    const r = await pool.query(
      `UPDATE fire_assays SET
        assay_date=$1, sample_id=$2, jeweller_name=$3, jeweller_id=$4, phone=$5, bis_license=$6,
        article_type=$7, material=$8, article_weight=$9, huid=$10, pieces=$11,
        cupel_no=$12, crucible_no=$13, sample_weight=$14, lead_weight=$15, silver_used=$16,
        ash_weight=$17, bead_weight=$18, parcel_weight=$19,
        purity=$20, fineness=$21, hallmark_grade=$22, result=$23, furnace_temp=$24,
        operator=$25, charges=$26, payment_mode=$27, remarks=$28, updated_at=NOW()
       WHERE id=$29 RETURNING *`,
      [assay_date, sample_id, jeweller_name, jeweller_id || null, phone, bis_license,
       article_type, material, article_weight, huid, pieces,
       cupel_no, crucible_no, sample_weight, lead_weight, silver_used,
       ash_weight, bead_weight, parcel_weight,
       purity, fineness, hallmark_grade, result, furnace_temp,
       operator, charges, payment_mode, remarks, req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Assay not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const r = await pool.query('DELETE FROM fire_assays WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Assay not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
