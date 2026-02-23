import express from "express";
import db from "../../config/db.js";

const router = express.Router();

router.get("/:partnerId", async (req, res) => {
  const { partnerId } = req.params;

  const [history] = await db.query(
    "SELECT * FROM referrals WHERE referrer_id=?",
    [partnerId]
  );

  res.json(history);
});

export default router;
