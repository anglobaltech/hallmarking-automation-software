// server/src/routes/exchange.js
import { Router } from 'express';
import { pool } from '../../db.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', txn_type = 'All', status = 'All', date_from, date_to, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let idx = 1;
    let where = 'WHERE 1=1';

    if (txn_type !== 'All') { where += ` AND txn_type=$${idx++}`; params.push(txn_type); }
    if (status !== 'All') { where += ` AND status=$${idx++}`; params.push(status); }
    if (date_from) { where += ` AND txn_date>=$${idx++}`; params.push(date_from); }
    if (date_to) { where += ` AND txn_date<=$${idx++}`; params.push(date_to); }
    if (search) {
      where += ` AND (jeweller_name ILIKE $${idx} OR id ILIKE $${idx})`;
      params.push(`%${search}%`); idx++;
    }

    const countRes = await pool.query(`SELECT COUNT(*) FROM gold_exchanges ${where}`, params);
    const dataRes = await pool.query(
      `SELECT * FROM gold_exchanges ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    res.json({ data: dataRes.rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) { next(err); }
});

router.get('/meta/stats', async (_req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE txn_date = CURRENT_DATE) AS today_txns,
        COALESCE(SUM(final_amount) FILTER (WHERE txn_type='Buy' AND txn_date=CURRENT_DATE), 0) AS today_buy,
        COALESCE(SUM(final_amount) FILTER (WHERE txn_type='Sell' AND txn_date=CURRENT_DATE), 0) AS today_sell,
        COALESCE(SUM(final_amount) FILTER (WHERE txn_type='Buy'), 0) AS total_buy,
        COALESCE(SUM(final_amount) FILTER (WHERE txn_type='Sell'), 0) AS total_sell,
        COUNT(*) FILTER (WHERE status='Pending') AS pending
      FROM gold_exchanges
    `);
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await pool.query('SELECT * FROM gold_exchanges WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Transaction not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      txn_date, txn_type, jeweller_name, jeweller_id, phone, address, bis_license, gstin,
      gold_type, purity, fineness, huid, pieces, gross_weight, stone_weight,
      other_deduct_wt, net_weight, rate_per_gram, gross_amount,
      making_deduct, other_deduct, total_deductions, final_amount,
      payment_mode, cheque_no, upi_ref, status, remarks
    } = req.body;

    if (!jeweller_name || !txn_type) {
      return res.status(400).json({ error: 'jeweller_name and txn_type are required' });
    }

    const r = await pool.query(
      `INSERT INTO gold_exchanges
        (txn_date, txn_type, jeweller_name, jeweller_id, phone, address, bis_license, gstin,
         gold_type, purity, fineness, huid, pieces, gross_weight, stone_weight,
         other_deduct_wt, net_weight, rate_per_gram, gross_amount,
         making_deduct, other_deduct, total_deductions, final_amount,
         payment_mode, cheque_no, upi_ref, status, remarks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
       RETURNING *`,
      [txn_date || new Date().toISOString().split('T')[0],
       txn_type || 'Buy', jeweller_name, jeweller_id || null, phone, address, bis_license, gstin,
       gold_type || 'Old Jewellery', purity || null, fineness, huid, pieces || 1,
       gross_weight || null, stone_weight || 0, other_deduct_wt || 0, net_weight || null,
       rate_per_gram || null, gross_amount || null, making_deduct || 0, other_deduct || 0,
       total_deductions || 0, final_amount || null, payment_mode || 'Cash',
       cheque_no, upi_ref, status || 'Completed', remarks]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      txn_date, txn_type, jeweller_name, jeweller_id, phone, address, bis_license, gstin,
      gold_type, purity, fineness, huid, pieces, gross_weight, stone_weight,
      other_deduct_wt, net_weight, rate_per_gram, gross_amount,
      making_deduct, other_deduct, total_deductions, final_amount,
      payment_mode, cheque_no, upi_ref, status, remarks
    } = req.body;

    const r = await pool.query(
      `UPDATE gold_exchanges SET
        txn_date=$1, txn_type=$2, jeweller_name=$3, jeweller_id=$4, phone=$5, address=$6, bis_license=$7, gstin=$8,
        gold_type=$9, purity=$10, fineness=$11, huid=$12, pieces=$13, gross_weight=$14, stone_weight=$15,
        other_deduct_wt=$16, net_weight=$17, rate_per_gram=$18, gross_amount=$19,
        making_deduct=$20, other_deduct=$21, total_deductions=$22, final_amount=$23,
        payment_mode=$24, cheque_no=$25, upi_ref=$26, status=$27, remarks=$28, updated_at=NOW()
       WHERE id=$29 RETURNING *`,
      [txn_date, txn_type, jeweller_name, jeweller_id || null, phone, address, bis_license, gstin,
       gold_type, purity, fineness, huid, pieces, gross_weight, stone_weight,
       other_deduct_wt, net_weight, rate_per_gram, gross_amount, making_deduct, other_deduct,
       total_deductions, final_amount, payment_mode, cheque_no, upi_ref, status, remarks, req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Transaction not found' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const r = await pool.query('DELETE FROM gold_exchanges WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
