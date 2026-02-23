import express from "express";
import db from "../../config/db.js";

const router = express.Router();

router.get("/:partnerId", async (req, res) => {
  const { partnerId } = req.params;

  try {
    const [earnings] = await db.query(
      "SELECT total_earnings FROM delivery_partners WHERE id=?",
      [partnerId]
    );

    const [orders] = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders WHERE partner_id=?",
      [partnerId]
    );

    res.json({
      totalEarnings: earnings[0].total_earnings,
      totalOrders: orders[0].totalOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
