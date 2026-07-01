// server/src/routes/dashboard.js
import { Router } from 'express';
import { pool } from '../../db.js';

const router = Router();

// Main dashboard stats — aggregated from all modules
router.get('/stats', async (_req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [jewellers, laser, xrf, soldering, fire, exchange] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status='Active') AS active,
          COUNT(*) FILTER (WHERE status='Expiring') AS expiring
        FROM jewellers
      `),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE job_date=$1) AS today_jobs,
          COALESCE(SUM(pieces) FILTER (WHERE job_date=$1), 0) AS today_pieces,
          COUNT(*) FILTER (WHERE status='Pending') AS pending,
          COALESCE(SUM(charges) FILTER (WHERE job_date=$1), 0) AS today_revenue
        FROM laser_jobs
      `, [today]),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE test_date=$1) AS today_tests,
          COUNT(*) FILTER (WHERE result='Pass') AS pass_count,
          COUNT(*) FILTER (WHERE result='Fail') AS fail_count,
          COALESCE(SUM(charges) FILTER (WHERE test_date=$1), 0) AS today_revenue
        FROM xrf_tests
      `, [today]),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status='In Progress') AS active,
          COUNT(*) FILTER (WHERE status='Pending') AS pending,
          COALESCE(SUM(charges) FILTER (WHERE job_date=$1), 0) AS today_revenue
        FROM soldering_jobs
      `, [today]),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE assay_date=$1) AS today_assays,
          COUNT(*) FILTER (WHERE result='Pass') AS pass_count,
          COALESCE(SUM(charges) FILTER (WHERE assay_date=$1), 0) AS today_revenue
        FROM fire_assays
      `, [today]),
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE txn_date=$1) AS today_txns,
          COALESCE(SUM(final_amount) FILTER (WHERE txn_date=$1), 0) AS today_value,
          COALESCE(SUM(final_amount) FILTER (WHERE txn_type='Buy'), 0) AS total_buy,
          COALESCE(SUM(final_amount) FILTER (WHERE txn_type='Sell'), 0) AS total_sell
        FROM gold_exchanges
      `, [today]),
    ]);

    // Total today revenue
    const totalRevenue =
      parseFloat(laser.rows[0].today_revenue) +
      parseFloat(xrf.rows[0].today_revenue) +
      parseFloat(soldering.rows[0].today_revenue) +
      parseFloat(fire.rows[0].today_revenue);

    res.json({
      jewellers: jewellers.rows[0],
      laser: laser.rows[0],
      xrf: xrf.rows[0],
      soldering: soldering.rows[0],
      fire: fire.rows[0],
      exchange: exchange.rows[0],
      today_revenue: totalRevenue,
    });
  } catch (err) { next(err); }
});

// Monthly revenue for chart
router.get('/monthly-revenue', async (_req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT
        TO_CHAR(month_date, 'Mon') AS month,
        EXTRACT(MONTH FROM month_date) AS month_num,
        COALESCE(SUM(laser_rev + xrf_rev + sol_rev + fire_rev), 0) AS total
      FROM (
        SELECT generate_series(
          DATE_TRUNC('year', NOW()),
          DATE_TRUNC('month', NOW()),
          '1 month'::interval
        ) AS month_date
      ) months
      LEFT JOIN (
        SELECT
          DATE_TRUNC('month', job_date) AS m,
          SUM(charges) AS laser_rev,
          0 AS xrf_rev, 0 AS sol_rev, 0 AS fire_rev
        FROM laser_jobs GROUP BY m
        UNION ALL
        SELECT DATE_TRUNC('month', test_date), 0, SUM(charges), 0, 0 FROM xrf_tests GROUP BY 1
        UNION ALL
        SELECT DATE_TRUNC('month', job_date), 0, 0, SUM(charges), 0 FROM soldering_jobs GROUP BY 1
        UNION ALL
        SELECT DATE_TRUNC('month', assay_date), 0, 0, 0, SUM(charges) FROM fire_assays GROUP BY 1
      ) revenue ON revenue.m = month_date
      GROUP BY month_date
      ORDER BY month_date
    `);
    res.json(r.rows);
  } catch (err) { next(err); }
});

// Recent activity feed
router.get('/activity', async (_req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT id, 'Laser Cutting' AS type, jeweller_name, 
             CONCAT(article_type, ' · ', material, ' · ', pieces, ' pcs') AS detail,
             created_at, status
      FROM laser_jobs
      UNION ALL
      SELECT id, 'XRF Test', jeweller_name,
             CONCAT(article_type, ' · ', tested_purity, '% purity') AS detail,
             created_at, result AS status
      FROM xrf_tests
      UNION ALL
      SELECT id, 'Soldering', jeweller_name,
             CONCAT(article_type, ' · ', COALESCE(issue, 'repair')), created_at, status
      FROM soldering_jobs
      UNION ALL
      SELECT id, 'Fire Assay', jeweller_name,
             CONCAT(article_type, ' · ', COALESCE(purity::TEXT, '?'), '% purity'), created_at, result AS status
      FROM fire_assays
      UNION ALL
      SELECT id, 'Gold Exchange', jeweller_name,
             CONCAT(txn_type, ' · ', COALESCE(net_weight::TEXT, '?'), 'g · ₹', COALESCE(final_amount::TEXT, '?')),
             created_at, status
      FROM gold_exchanges
      ORDER BY created_at DESC
      LIMIT 10
    `);
    res.json(r.rows);
  } catch (err) { next(err); }
});

export default router;
