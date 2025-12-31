import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
 
/* =========================
   ADMIN LOGIN (UNCHANGED)
========================= */
export const adminLogin = (req, res) => {
  const { email, password } = req.body;
 
  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json(err);
 
    if (rows.length === 0) {
      return res.status(400).json({ message: "Admin not found" });
    }
 
    const admin = rows[0];
    const valid = bcrypt.compareSync(password, admin.password);
 
    if (!valid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
 
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      "ADMIN_SECRET_KEY",
      { expiresIn: "7d" }
    );
 
    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    });
  });
};
 
/* =========================
   DASHBOARD STATS (FIXED)
========================= */
export const getDashboardStats = (req, res) => {
  const stats = {
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  };

  db.query("SELECT COUNT(*) AS c FROM products", (e1, r1) => {
    if (e1) {
      console.error("PRODUCTS TABLE ERROR:", e1);
      return res.json(stats);
    }
    stats.products = r1[0].c;

    db.query("SELECT COUNT(*) AS c FROM orders", (e2, r2) => {
      if (e2) {
        console.error("ORDERS TABLE ERROR:", e2);
        return res.json(stats);
      }
      stats.orders = r2[0].c;

      db.query("SELECT COUNT(*) AS c FROM users", (e3, r3) => {
        if (e3) {
          console.error("USERS TABLE ERROR:", e3);
          return res.json(stats);
        }
        stats.users = r3[0].c;

        db.query(
          "SELECT IFNULL(SUM(total_amount),0) AS r FROM orders",
          (e4, r4) => {
            if (!e4) stats.revenue = r4[0].r;
            res.json(stats);
          }
        );
      });
    });
  });
};
 
/* =========================
   USER FULL HISTORY (UNCHANGED)
========================= */
export const getUserHistory = (req, res) => {
  const userId = req.params.id;
 
  db.query("SELECT * FROM users WHERE id=?", [userId], (err, user) => {
    if (err) return res.status(500).json(err);
 
    db.query("SELECT * FROM orders WHERE user_id=?", [userId], (err, orders) => {
      if (err) return res.status(500).json(err);
 
      db.query(
        "SELECT * FROM order_cancellations WHERE user_id=?",
        [userId],
        (err, cancels) => {
          if (err) return res.status(500).json(err);
 
          db.query(
            "SELECT * FROM refunds WHERE user_id=?",
            [userId],
            (err, refunds) => {
              if (err) return res.status(500).json(err);
 
              db.query(
                "SELECT * FROM user_logs WHERE user_id=?",
                [userId],
                (err, logs) => {
                  if (err) return res.status(500).json(err);
 
                  res.json({
                    user: user[0] || {},
                    orders: orders || [],
                    cancellations: cancels || [],
                    refunds: refunds || [],
                    logs: logs || []
                  });
                }
              );
            }
          );
        }
      );
    });
  });
};
 
/* =========================
   REVENUE SUMMARY (FIXED)
========================= */
export const getRevenueStats = (req, res) => {
  const range = req.query.range || "all";
  let where = "";
 
  if (range === "today") {
    where = "WHERE DATE(created_at) = CURDATE()";
  } else if (range === "week") {
    where = "WHERE YEARWEEK(created_at,1) = YEARWEEK(CURDATE(),1)";
  } else if (range === "month") {
    where = `
      WHERE YEAR(created_at)=YEAR(CURDATE())
      AND MONTH(created_at)=MONTH(CURDATE())
    `;
  } else if (range === "year") {
    where = "WHERE YEAR(created_at)=YEAR(CURDATE())";
  }
 
  const sql = `
    SELECT
      COUNT(*) AS totalOrders,
      IFNULL(SUM(total_amount),0) AS totalRevenue
    FROM orders
    ${where}
  `;
 
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
 
    res.json({
      totalOrders: rows[0].totalOrders,
      totalRevenue: rows[0].totalRevenue,
      codRevenue: rows[0].totalRevenue, // COD-only system for now
      onlineRevenue: 0
    });
  });
};
 
/* =========================
   REVENUE DETAILS (OPTIONAL, SAFE)
========================= */
export const getRevenueDetails = (req, res) => {
  const sql = `
    SELECT
      DATE(created_at) AS orderDate,
      COUNT(*) AS totalOrders,
      IFNULL(SUM(total_amount), 0) AS totalRevenue
    FROM orders
    GROUP BY DATE(created_at)
    ORDER BY orderDate DESC
  `;
 
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
 
 