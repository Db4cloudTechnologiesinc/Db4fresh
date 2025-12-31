import db from "../config/db.js";

export const reorderItems = (req, res) => {
  const userId = req.user.id; // from auth middleware
  const orderId = req.params.id;

  const itemsSql = `
    SELECT product_name, price, qty
    FROM order_items
    WHERE order_id = ?
  `;

  db.query(itemsSql, [orderId], (err, items) => {
    if (err || items.length === 0)
      return res.status(404).json({ message: "No items found" });

    const insertSql = `
      INSERT INTO cart (user_id, product_name, price, qty)
      VALUES ?
    `;

    const values = items.map((i) => [
      userId,
      i.product_name,
      i.price,
      i.qty,
    ]);

    db.query(insertSql, [values], (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Items added to cart" });
    });
  });
};
