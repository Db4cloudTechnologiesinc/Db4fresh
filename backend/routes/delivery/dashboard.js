import express from "express";
import db from "../../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const partnerId = req.user.id;

  try {
    // Get Earnings
    const [earnings] = await db.query(
      "SELECT total_earnings FROM delivery_partners WHERE id=?",
      [partnerId]
    );

    // Get Orders Count
    const [orders] = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders WHERE delivery_partner_id=?",
      [partnerId]
    );

    // 🔥 Check Active Slot (Today)
    const [activeSlot] = await db.query(`
      SELECT p.slot_id, d.start_time, d.end_time
      FROM partner_booked_slots p
      JOIN delivery_slots d ON p.slot_id = d.id
      WHERE p.partner_id = ?
      AND p.status = 'active'
      LIMIT 1
    `, [partnerId]);

    const isOnline = activeSlot.length > 0;

    res.json({
      totalEarnings: earnings.length ? earnings[0].total_earnings : 0,
      totalOrders: orders.length ? orders[0].totalOrders : 0,
      isOnline: isOnline,
      activeSlot: activeSlot.length ? activeSlot[0] : null
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;