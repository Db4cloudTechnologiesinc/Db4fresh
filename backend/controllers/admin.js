import db from "../config/db.js";


/* =========================
   DASHBOARD STATS
========================= */
export const getDashboardStats = async (req, res) => {
  try {
    const [[products]] = await db.query("SELECT COUNT(*) AS count FROM products");
    const [[orders]] = await db.query("SELECT COUNT(*) AS count FROM orders");
    const [[users]] = await db.query("SELECT COUNT(*) AS count FROM users");

    const [[revenue]] = await db.query(`
      SELECT IFNULL(SUM(total_amount), 0) AS amount
      FROM orders
    `);

    console.log("DEBUG:", {
      products,
      orders,
      users,
      revenue,
    });

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
    const {
      range = "all",
      date,
      month,
      year,
    } = req.query;

    let dateFilter = "";

    switch (range) {
      case "today":
        dateFilter = "AND DATE(created_at) = CURDATE()";
        break;

      case "week":
        dateFilter =
          "AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)";
        break;

      case "month":
        dateFilter =
          "AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
        break;

      case "year":
        dateFilter =
          "AND YEAR(created_at) = YEAR(CURDATE())";
        break;

      case "custom-date":
        if (date) {
          dateFilter = `AND DATE(created_at) = '${date}'`;
        }
        break;

      case "custom-month":
        if (month) {
          const [selectedYear, selectedMonth] = month.split("-");

          dateFilter = `
            AND YEAR(created_at) = ${selectedYear}
            AND MONTH(created_at) = ${parseInt(selectedMonth)}
          `;
        }
        break;

      case "custom-year":
        if (year) {
          dateFilter = `AND YEAR(created_at) = ${year}`;
        }
        break;

      default:
        dateFilter = "";
    }

    const condition = `
      (
        (payment_method = 'ONLINE' AND payment_status = 'paid')
        OR
        (payment_method = 'COD' AND order_status = 'DELIVERED')
      )
      ${dateFilter}
    `;

    const [[summary]] = await db.query(`
      SELECT
        COUNT(*) AS totalOrders,
        IFNULL(SUM(total_amount),0) AS totalRevenue,
        ROUND(IFNULL(AVG(total_amount),0),2) AS avgOrderValue
      FROM orders
      WHERE ${condition}
    `);

    const [paymentSplit] = await db.query(`
      SELECT
        payment_method,
        COUNT(*) AS orderCount,
        IFNULL(SUM(total_amount),0) AS revenue
      FROM orders
      WHERE ${condition}
      GROUP BY payment_method
    `);

    const [[cancelled]] = await db.query(`
      SELECT COUNT(*) AS cancelledOrders
      FROM orders
      WHERE order_status = 'CANCELLED'
      ${dateFilter}
    `);

    let codRevenue = 0;
    let onlineRevenue = 0;
    let codOrders = 0;
    let onlineOrders = 0;

    paymentSplit.forEach((row) => {
      if (row.payment_method === "COD") {
        codRevenue = row.revenue;
        codOrders = row.orderCount;
      }

      if (row.payment_method === "ONLINE") {
        onlineRevenue = row.revenue;
        onlineOrders = row.orderCount;
      }
    });

    res.json({
      totalRevenue: summary.totalRevenue || 0,
      totalOrders: summary.totalOrders || 0,
      avgOrderValue: summary.avgOrderValue || 0,
      codRevenue,
      onlineRevenue,
      codOrders,
      onlineOrders,
      cancelledOrders: cancelled.cancelledOrders || 0,
    });

  } catch (err) {
    console.error("REVENUE ERROR:", err);

    res.status(500).json({
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      codRevenue: 0,
      onlineRevenue: 0,
      codOrders: 0,
      onlineOrders: 0,
      cancelledOrders: 0,
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
export const getAdminNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 20
    `);

    res.json(rows);

  } catch (err) {
    console.error("NOTIFICATION ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await db.query(`
      UPDATE notifications
      SET is_read = TRUE
      WHERE is_read = FALSE
    `);

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};