import db from "../config/db.js";

export const cancelOrder = (req, res) => {
  const orderId = req.params.id;

  const checkSql = `
    SELECT order_status FROM orders WHERE id = ?
  `;

  db.query(checkSql, [orderId], (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ message: "Order not found" });

    const status = result[0].order_status;

    if (["Delivered", "Out for Delivery"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled" });
    }

    const updateSql = `
      UPDATE orders SET order_status = 'Cancelled' WHERE id = ?
    `;

    db.query(updateSql, [orderId], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Order cancelled successfully" });
    });
  });
};
