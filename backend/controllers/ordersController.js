import db from "../config/db.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const sql = `
      INSERT INTO orders (user_id, items, total_amount)
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [
      userId || null,
      JSON.stringify(items),
      totalAmount,
    ]);

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order" });
  }
};
export const getOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    const orders = rows.map((o) => ({
      ...o,
      items: JSON.parse(o.items),
      address: o.address ? JSON.parse(o.address) : null,
    }));

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};