

import db from "../config/db.js";
import { sendMessage } from "../kafka/producer.js";

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      paymentMethod,
      address,
      deliverySlot,
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const slot = deliverySlot
  ? `${deliverySlot.date} - ${deliverySlot.time}`
  : null;

    // Create order
   const [result] = await db.query(
  `
  INSERT INTO orders (
    user_id,
    total_amount,
    payment_method,
    payment_status,
    delivery_slot,
    address,
    items,
    order_status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    userId,
    totalAmount,
    paymentMethod,
    "pending",
    slot,
    JSON.stringify(address),
    JSON.stringify(items),
    "PLACED",
  ]
);
    const orderId = result.insertId;

    // Save order items
    if (Array.isArray(items)) {
      for (const item of items) {
        await db.query(
          `
          INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price,
            product_name,
            product_image
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
         [
  orderId,
  item.productId || item.product_id || item.id,
  item.qty || item.quantity || 1,
  item.price,
  item.name,
  item.image,
]
        );
      }
    }

    await sendMessage("order-topic", {
  orderId,
  userId,
  totalAmount,
});
    res.json({
      success: true,
      orderId,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
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

export const getOrders = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        user_id,
        total_amount,
        payment_method,
        payment_status,
        delivery_slot,
        delivery_partner_name,
        order_status,
        created_at
      FROM orders
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    if (!orders.length) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orders[0];

    const [items] = await db.query(
      `
      SELECT
        id,
        product_id,
        quantity,
        price,
        product_name AS name,
        product_image AS image
      FROM order_items
      WHERE order_id = ?
      `,
      [orderId]
    );

    let address = {};

    try {
      address =
        typeof order.address === "string"
          ? JSON.parse(order.address)
          : order.address || {};
    } catch {
      address = {};
    }

    res.json({
      order: {
        ...order,
        ...address,
      },
      items,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await db.query(
      "UPDATE orders SET order_status=? WHERE id=?",
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
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
export const getOrderTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM order_status_history
      WHERE order_id = ?
      ORDER BY created_at ASC
      `,
      [id]
    );

    res.json({
      success: true,
      timeline: rows,
    });
  } catch (err) {
    console.error("TIMELINE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const assignPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { partnerId } = req.body;

    const [partner] = await db.query(
      `
      SELECT name
      FROM delivery_partners
      WHERE id = ?
      `,
      [partnerId]
    );

    if (!partner.length) {
      return res.status(404).json({
        message: "Partner not found",
      });
    }

    await db.query(
      `
      UPDATE orders
      SET
        delivery_partner_id = ?,
        delivery_partner_name = ?
      WHERE id = ?
      `,
      [partnerId, partner[0].name, id]
    );

    res.json({
      success: true,
      message: "Partner assigned successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to assign partner",
    });
  }
};
export const getDeliveryPartners = async (req, res) => {
  try {
    const [partners] = await db.query(`
      SELECT id, name
      FROM delivery_partners
      WHERE is_active = 1
    `);

    res.json({
      success: true,
      partners,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery partners",
    });
  }
};