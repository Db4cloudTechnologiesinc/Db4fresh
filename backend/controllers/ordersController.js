import db from "../config/db.js";

export const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { items, totalAmount, paymentMethod, address } = req.body;
    const userId = req.user?.id;

    console.log("🔥 CREATE ORDER HIT");
    console.log("USER ID:", userId);
    console.log("ITEMS:", items);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const safeTotalAmount = Number(totalAmount);
    if (isNaN(safeTotalAmount)) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const normalizedPaymentMethod =
      paymentMethod === "COD" ? "COD" : "ONLINE";

    const paymentStatus =
      normalizedPaymentMethod === "ONLINE" ? "paid" : "pending";

    const addressJson = address ? JSON.stringify(address) : null;

    await connection.beginTransaction();

    /* ================= INSERT ORDER ================= */

    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (user_id, total_amount, payment_method,
        payment_status, order_status, address)
       VALUES (?, ?, ?, ?, 'PLACED', ?)`,
      [
        userId,
        safeTotalAmount,
        normalizedPaymentMethod,
        paymentStatus,
        addressJson,
      ]
    );

    const orderId = orderResult.insertId;

    /* ================= INSERT ORDER ITEMS ================= */

    for (const item of items) {
      const productId =
        item.productId || item.product_id || item.id;

      const qty =
        Number(item.qty || item.quantity || 1);

      await connection.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price,
          product_name, product_image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          productId,
          qty,
          Number(item.price) || 0,
          item.name || "Product",
          item.image || "",
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      orderId,
    });

  } catch (err) {
    await connection.rollback();
    console.error("❌ CREATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};

/* =========================================================
   GET ORDER BY ID
========================================================= */

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user?.id;

    const [[order]] = await db.query(
      `SELECT *
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await db.query(
      `SELECT
        product_name AS name,
        product_image AS image,
        quantity,
        price
       FROM order_items
       WHERE order_id = ?`,
      [orderId]
    );

    res.json({ order, items });

  } catch (err) {
    console.error("GET ORDER ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================================================
   GET MY ORDERS
========================================================= */

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    const [orders] = await db.query(
      `SELECT *
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(orders);

  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err.message);
    res.status(500).json([]);
  }
};


/* =========================================================
   GET ALL ORDERS (ADMIN)
========================================================= */

export const getOrders = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT *
       FROM orders
       ORDER BY created_at DESC`
    );

    res.json(rows);

  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err.message);
    res.status(500).json([]);
  }
};


/* =========================================================
   MARK ORDER AS DELIVERED
========================================================= */

export const markOrderDelivered = async (req, res) => {
  try {
    const orderId = req.params.id;

    await db.query(
      `UPDATE orders
       SET order_status='DELIVERED',
           payment_status='paid'
       WHERE id = ?`,
      [orderId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("MARK DELIVERED ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};
