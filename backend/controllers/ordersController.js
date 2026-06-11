

import db from "../config/db.js";
import { sendMessage } from "../kafka/producer.js";

/* CREATE ORDER */
// export const createOrder = async (req, res) => {
//   try {
//     const { items, totalAmount } = req.body;
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // ✅ Save order in DB
//     const [result] = await db.query(
//       "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
//       [userId, totalAmount]
//     );

//     const orderId = result.insertId;

//     // 🔥 SEND TO KAFKA (ADMIN NOTIFICATION)
//     await sendMessage("order-topic", {
//       type: "NEW_ORDER",
//       orderId,
//       userId,
//       totalAmount,
//       items,
//       createdAt: new Date(),
//     });

//     console.log("📦 Order created & sent to Kafka:", orderId);

//     res.json({ success: true, orderId });
//   } catch (err) {
//     console.error("❌ Order Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
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
    items
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  [
    userId,
    totalAmount,
    paymentMethod,
    "Pending", // payment_status
    deliverySlot,
    JSON.stringify(address),
    JSON.stringify(items),
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
      type: "NEW_ORDER",
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

/* GET ALL ORDERS (ADMIN) */
// export const getOrders = async (_req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         id,
//         user_id,
//         total_amount,
//         payment_method,
//         payment_status,
//         delivery_slot,
//         delivery_partner,
//         order_status,
//         created_at
//       FROM orders
//       ORDER BY id DESC
//     `);

//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json([]);
//   }
// };
// 
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
        delivery_partner,
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




/* GET ORDER BY ID */
// export const getOrderById = async (req, res) => {
//   try {
//     const orderId = req.params.id;

//     // Order
//     const [orders] = await db.query(
//       "SELECT * FROM orders WHERE id = ?",
//       [orderId]
//     );

//     if (!orders.length) {
//       return res.status(404).json({
//         message: "Order not found",
//       });
//     }

//     // Order Items
//     const [items] = await db.query(
//       `
//       SELECT
//         oi.*,
//         p.name,
//         p.image
//       FROM order_items oi
//       LEFT JOIN products p
//       ON oi.product_id = p.id
//       WHERE oi.order_id = ?
//       `,
//       [orderId]
//     );

//     res.json({
//       order: orders[0],
//       items,
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: "Failed to fetch order",
//     });
//   }
// };
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