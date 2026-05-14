

import db from "../config/db.js";
import { sendMessage } from "../kafka/producer.js";

/* CREATE ORDER */
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ Save order in DB
    const [result] = await db.query(
      "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
      [userId, totalAmount]
    );

    const orderId = result.insertId;

    // 🔥 SEND TO KAFKA (ADMIN NOTIFICATION)
    await sendMessage("order-topic", {
      type: "NEW_ORDER",
      orderId,
      userId,
      totalAmount,
      items,
      createdAt: new Date(),
    });

    console.log("📦 Order created & sent to Kafka:", orderId);

    res.json({ success: true, orderId });
  } catch (err) {
    console.error("❌ Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* GET MY ORDERS */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [userId]
    );

    res.json(orders);
  } catch {
    res.status(500).json([]);
  }
};

/* GET ALL ORDERS (ADMIN) */
export const getOrders = async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(rows);
  } catch {
    res.status(500).json([]);
  }
};

/* GET ORDER BY ID */
export const getOrderById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [req.params.id]
    );

    res.json(rows[0]);
  } catch {
    res.status(500).json({});
  }
};

/* MARK DELIVERED */
export const markOrderDelivered = async (req, res) => {
  try {
    await db.query(
      "UPDATE orders SET order_status='DELIVERED' WHERE id=?",
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};