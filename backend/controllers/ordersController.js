import db from "../config/db.js";

/* =========================================================
   CREATE ORDER
========================================================= */
export const createOrder = (req, res) => {
  const { items, totalAmount, address, userId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  if (!address || !address.name) {
    return res.status(400).json({ message: "Address required" });
  }

  const sql = `
    INSERT INTO orders (user_id, items, address, total_amount, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId || null,
      JSON.stringify(items),
      JSON.stringify(address),
      totalAmount,
      "PLACED",
    ],
    (err, result) => {
      if (err) {
        console.error("ORDER INSERT ERROR:", err);
        return res.status(500).json({ message: "Order failed" });
      }

      res.status(201).json({
        message: "Order placed successfully",
        orderId: result.insertId,
      });
    }
  );
};

/* =========================================================
   GET ALL ORDERS (ORDER HISTORY)
========================================================= */
export const getOrders = (req, res) => {
  db.query(
    "SELECT * FROM orders ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }

      const orders = rows.map((o) => ({
        id: o.id,
        user_id: o.user_id,
        total_amount: o.total_amount,
        status: o.status,
        created_at: o.created_at,

        items:
          typeof o.items === "string" ? JSON.parse(o.items) : o.items,

        address:
          typeof o.address === "string"
            ? JSON.parse(o.address)
            : o.address,
      }));

      res.json(orders);
    }
  );
};


export const getOrderById = (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  db.query(
    "SELECT * FROM orders WHERE id=? AND user_id=?",
    [orderId, userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0)
        return res.status(404).json({ message: "Order not found" });

      const order = rows[0];

      // ✅ CRITICAL FIX
      order.items =
        typeof order.items === "string"
          ? JSON.parse(order.items)
          : order.items || [];

      order.address =
        typeof order.address === "string"
          ? JSON.parse(order.address)
          : order.address || {};

      res.json(order);
    }
  );
};


