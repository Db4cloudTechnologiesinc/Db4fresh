import express from "express";
import db from "../../config/db.js";

const router = express.Router();

/* =====================================================
   GET EARNINGS DASHBOARD
===================================================== */
router.get("/:partnerId", async (req, res) => {
  const { partnerId } = req.params;

  try {
    /* -------------------------
       TODAY EARNINGS
    ------------------------- */
    const [todayResult] = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS today
      FROM partner_earnings
      WHERE partner_id = ?
      AND DATE(created_at) = CURDATE()
    `, [partnerId]);

    /* -------------------------
       WEEKLY EARNINGS
    ------------------------- */
    const [weeklyResult] = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS weekly
      FROM partner_earnings
      WHERE partner_id = ?
      AND YEARWEEK(created_at,1) = YEARWEEK(CURDATE(),1)
    `, [partnerId]);

    /* -------------------------
       TOTAL EARNINGS
    ------------------------- */
    const [totalResult] = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS total
      FROM partner_earnings
      WHERE partner_id = ?
    `, [partnerId]);

    /* -------------------------
       COMPLETED ORDERS
    ------------------------- */
    const [ordersResult] = await db.query(`
      SELECT COUNT(*) AS orders
      FROM orders
      WHERE partner_id = ?
      AND status = 'delivered'
    `, [partnerId]);

    /* -------------------------
       SAFE RESPONSE
    ------------------------- */
    res.json({
      today: todayResult?.[0]?.today || 0,
      weekly: weeklyResult?.[0]?.weekly || 0,
      total: totalResult?.[0]?.total || 0,
      orders: ordersResult?.[0]?.orders || 0
    });

  } catch (err) {
    console.error("EARNINGS ROUTE ERROR:", err);

    // Even if error, return zeros (prevents frontend crash)
    res.status(200).json({
      today: 0,
      weekly: 0,
      total: 0,
      orders: 0
    });
  }
});

export default router;
