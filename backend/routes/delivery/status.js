import express from "express";
import db from "../../config/db.js";

const router = express.Router();

/* ================================
   GET ONLINE STATUS
================================ */
router.get("/:partnerId", async (req, res) => {
  const { partnerId } = req.params;

  try {
    const [result] = await db.query(
      "SELECT is_online FROM delivery_partners WHERE id = ?",
      [partnerId]
    );

    res.json({
      is_online: result[0]?.is_online || 0
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================================
   UPDATE ONLINE STATUS
================================ */
router.post("/update", async (req, res) => {
  const { partnerId, is_online } = req.body;

  try {
    await db.query(
      "UPDATE delivery_partners SET is_online = ? WHERE id = ?",
      [is_online, partnerId]
    );

    res.json({ message: "Status updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
