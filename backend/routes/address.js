
import express from "express";
import db from "../config/db.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADD ADDRESS ================= */
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      name = "",
      phone = "",
      address_line1 = "",
      address_line2 = "",
      city = "",
      state = "",
      pincode,
      landmark = "",
      is_default = 0,
    } = req.body;

    if (!address_line1 || !pincode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // If setting default → clear old default
    if (is_default) {
      await db.query(
        "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
        [req.user.id]
      );
    }

    const [result] = await db.query(
      `INSERT INTO user_addresses
      (user_id, name, phone, address_line1, address_line2, city, state, pincode, landmark, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark,
        is_default ? 1 : 0,
      ]
    );

    return res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("ADDRESS INSERT ERROR:", err.sqlMessage || err);
    return res.status(500).json({ message: "Address save failed" });
  }
});

/* ================= GET ADDRESSES ================= */
router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC",
      [req.user.id]
    );

    return res.json(rows);
  } catch (err) {
    console.error("FETCH ADDRESS ERROR:", err.sqlMessage || err);
    return res.status(500).json({ message: "Failed to fetch addresses" });
  }
});

/* ================= UPDATE ADDRESS ================= */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name = "",
      phone = "",
      address_line1 = "",
      address_line2 = "",
      city = "",
      state = "",
      pincode,
      landmark = "",
      is_default = 0,
    } = req.body;

    if (!address_line1 || !pincode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (is_default) {
      await db.query(
        "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
        [req.user.id]
      );
    }

    await db.query(
      `UPDATE user_addresses SET
        name = ?,
        phone = ?,
        address_line1 = ?,
        address_line2 = ?,
        city = ?,
        state = ?,
        pincode = ?,
        landmark = ?,
        is_default = ?
       WHERE id = ? AND user_id = ?`,
      [
        name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        landmark,
        is_default ? 1 : 0,
        id,
        req.user.id,
      ]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("ADDRESS UPDATE ERROR:", err.sqlMessage || err);
    return res.status(500).json({ message: "Address update failed" });
  }
});

/* ================= DELETE ADDRESS ================= */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM user_addresses WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("ADDRESS DELETE ERROR:", err.sqlMessage || err);
    return res.status(500).json({ message: "Address delete failed" });
  }
});
/* ================= UPDATE ADDRESS ================= */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get existing address
    const [rows] = await db.query(
      "SELECT * FROM user_addresses WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Address not found" });
    }

    const existing = rows[0];

    // 2️⃣ Merge old + new safely
    const payload = {
      name: req.body.name ?? existing.name,
      phone: req.body.phone ?? existing.phone,
      address_line1: req.body.address_line1 ?? existing.address_line1,
      address_line2: req.body.address_line2 ?? existing.address_line2,
      city: req.body.city ?? existing.city,
      state: req.body.state ?? existing.state,
      pincode: req.body.pincode ?? existing.pincode,
      landmark: req.body.landmark ?? existing.landmark,
      is_default: req.body.is_default ?? existing.is_default,
    };

    // 3️⃣ Handle default address
    if (payload.is_default) {
      await db.query(
        "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
        [req.user.id]
      );
    }

    // 4️⃣ Update safely
    await db.query(
      `UPDATE user_addresses SET
        name = ?,
        phone = ?,
        address_line1 = ?,
        address_line2 = ?,
        city = ?,
        state = ?,
        pincode = ?,
        landmark = ?,
        is_default = ?
       WHERE id = ? AND user_id = ?`,
      [
        payload.name,
        payload.phone,
        payload.address_line1,
        payload.address_line2,
        payload.city,
        payload.state,
        payload.pincode,
        payload.landmark,
        payload.is_default ? 1 : 0,
        id,
        req.user.id,
      ]
    );

    // 5️⃣ Return updated address
    const [updated] = await db.query(
      "SELECT * FROM user_addresses WHERE id = ?",
      [id]
    );

    return res.json({ success: true, address: updated[0] });
  } catch (err) {
    console.error("ADDRESS UPDATE ERROR:", err.sqlMessage || err);
    return res.status(500).json({ message: "Address update failed" });
  }
});

export default router;
