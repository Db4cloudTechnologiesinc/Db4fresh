
import express from "express";
import db from "../config/db.js";
 
const router = express.Router();
 
/* ============================
   SEARCH USERS (MUST BE FIRST)
============================ */
router.get("/search/:q", (req, res) => {
  const q = `%${req.params.q}%`;
 
  db.query(
    "SELECT id, name, email FROM users WHERE name LIKE ? OR id LIKE ? LIMIT 5",
    [q, q],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});
 
/* ============================
   GET ALL USERS
============================ */
router.get("/", (req, res) => {
  db.query(
    "SELECT id, name, email, created_at FROM users ORDER BY id DESC",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});
 
/* ============================
   GET SINGLE USER (PROFILE)
============================ */
router.get("/:id", (req, res) => {
  db.query(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(rows[0]);
    }
  );
});
 
/* ============================
   DELETE USER
============================ */
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User deleted" });
    }
  );
});
/* ============================
   USER HISTORY
============================ */
 
router.get("/:id/history", (req, res) => {
  const userId = req.params.id;
 
  const response = {
    user: null,
    orders: [],
    cancellations: [],
    refunds: []
  };
 
  // 1️⃣ USER
  db.query(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [userId],
    (err, userRows) => {
      if (err) return res.status(500).json(err);
      if (userRows.length === 0)
        return res.status(404).json({ message: "User not found" });
 
      response.user = userRows[0];
 
      // 2️⃣ ORDERS
      db.query(
        "SELECT * FROM orders WHERE user_id = ?",
        [userId],
        (err, orders) => {
          if (err) return res.status(500).json(err);
          response.orders = orders;
 
          // 3️⃣ CANCELLATIONS
          db.query(
            "SELECT * FROM cancellations WHERE user_id = ?",
            [userId],
            (err, cancellations) => {
              if (err) return res.status(500).json(err);
              response.cancellations = cancellations;
 
              // 4️⃣ REFUNDS
              db.query(
                "SELECT * FROM refunds WHERE user_id = ?",
                [userId],
                (err, refunds) => {
                  if (err) return res.status(500).json(err);
                  response.refunds = refunds;
 
                  // ✅ SEND ALL DATA
                  res.json(response);
                }
              );
            }
          );
        }
      );
    }
  );
});
 
 
 export default router;
 