import db from "../config/db.js";

// ➕ Add to wishlist
export const addToWishlist = (req, res) => {
  const { user_id, product_id } = req.body;

  const sql = `INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)`;

  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Added to wishlist" });
  });
};

// ❌ Remove from wishlist
export const removeFromWishlist = (req, res) => {
  const { user_id, product_id } = req.body;

  const sql = `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`;

  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Removed from wishlist" });
  });
};

// 📌 Get wishlist for user
export const getWishlist = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT products.* FROM wishlist
    JOIN products ON products.id = wishlist.product_id
    WHERE wishlist.user_id = ?
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};
