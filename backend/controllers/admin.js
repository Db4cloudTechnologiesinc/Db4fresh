import db from "../config/db.js";

/* =========================
   DASHBOARD STATS
========================= */
export const getDashboardStats = async (req, res) => {
  try {
    const [[products]] = await db.query(
      "SELECT COUNT(*) AS count FROM products"
    );

    const [[orders]] = await db.query(
      "SELECT COUNT(*) AS count FROM orders"
    );

    const [[users]] = await db.query(
      "SELECT COUNT(*) AS count FROM users"
    );

    const [[revenue]] = await db.query(
      `SELECT IFNULL(SUM(total_amount), 0) AS amount
       FROM orders
       WHERE
         (payment_method = 'ONLINE' AND payment_status = 'paid')
         OR
         (payment_method = 'COD' AND order_status = 'DELIVERED')`
    );

    res.json({
      products: products.count,
      orders: orders.count,
      users: users.count,
      revenue: revenue.amount,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({
      products: 0,
      orders: 0,
      users: 0,
      revenue: 0,
    });
  }
};

/* =========================
   USER HISTORY
========================= */
export const getUserHistory = async (req, res) => {
  try {
    const userId = req.params.id;

    const [[user]] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json({
      user: user || {},
      orders: orders || [],
    });
  } catch (err) {
    console.error("USER HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REVENUE SUMMARY (COD vs ONLINE)
========================= */
export const getRevenueStats = async (req, res) => {
  try {
    const [[total]] = await db.query(
      `SELECT
          COUNT(*) AS totalOrders,
          IFNULL(SUM(total_amount), 0) AS totalRevenue
       FROM orders
       WHERE
         (payment_method = 'ONLINE' AND payment_status = 'paid')
         OR
         (payment_method = 'COD' AND order_status = 'DELIVERED')`
    );

    const [split] = await db.query(
      `SELECT
          payment_method,
          IFNULL(SUM(total_amount), 0) AS amount
       FROM orders
       WHERE
         (payment_method = 'ONLINE' AND payment_status = 'paid')
         OR
         (payment_method = 'COD' AND order_status = 'DELIVERED')
       GROUP BY payment_method`
    );

    let codRevenue = 0;
    let onlineRevenue = 0;

    split.forEach(row => {
      if (row.payment_method === "COD") {
        codRevenue = row.amount;
      }
      if (row.payment_method === "ONLINE") {
        onlineRevenue = row.amount;
      }
    });

    res.json({
      totalOrders: total.totalOrders,
      totalRevenue: total.totalRevenue,
      codRevenue,
      onlineRevenue,
    });
  } catch (err) {
    console.error("REVENUE STATS ERROR:", err);
    res.status(500).json({
      totalOrders: 0,
      totalRevenue: 0,
      codRevenue: 0,
      onlineRevenue: 0,
    });
  }
};

/* =========================
   REVENUE DETAILS BY DATE
========================= */
export const getRevenueDetails = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
          DATE(created_at) AS date,
          SUM(total_amount) AS revenue
       FROM orders
       WHERE
         (payment_method = 'ONLINE' AND payment_status = 'paid')
         OR
         (payment_method = 'COD' AND order_status = 'DELIVERED')
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    res.json(rows);
  } catch (err) {
    console.error("REVENUE DETAILS ERROR:", err);
    res.status(500).json([]);
  }
};
