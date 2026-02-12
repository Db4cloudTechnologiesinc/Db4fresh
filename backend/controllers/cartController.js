
import db from "../config/db.js";


export const addToCart = async (req, res) => {
  try {
    console.log("🔥 ADD TO CART HIT");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const userId = req.user.id;
    const { productId, qty = 1 } = req.body;

    console.log("USER ID USED:", userId);

    const [rows] = await db.query(
      "SELECT id, qty FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    console.log("EXISTING ROWS:", rows);

    if (rows.length > 0) {
      await db.query(
        "UPDATE cart SET qty = qty + ? WHERE id = ?",
        [qty, rows[0].id]
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)",
        [userId, productId, qty]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    console.log("🔥 GET CART HIT");
    console.log("USER:", req.user);

    const userId = req.user.id;

    const [rows] = await db.query(
      `SELECT 
        c.id AS cartId,
        c.qty,
        p.id AS productId,
        p.name,
        p.price,
        p.image
      FROM cart c
      JOIN products p ON p.id = c.product_id
      WHERE c.user_id = ?`,
      [userId]
    );

    console.log("CART ROWS:", rows);
    res.json(rows);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * UPDATE QTY
 */
export const updateCartQty = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { qty } = req.body;

    if (qty <= 0) {
      await db.query("DELETE FROM cart WHERE id = ?", [cartId]);
    } else {
      await db.query(
        "UPDATE cart SET qty = ? WHERE id = ?",
        [qty, cartId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * REMOVE ITEM
 */
export const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await db.query("DELETE FROM cart WHERE id = ?", [cartId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * CART COUNT (HEADER ICON)
 */
export const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const [[row]] = await db.query(
      "SELECT COALESCE(SUM(qty), 0) AS count FROM cart WHERE user_id = ?",
      [userId]
    );

    res.json({ count: row.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * CLEAR CART (CALL AFTER ORDER SUCCESS)
 */
export const clearCart = async (userId) => {
  await db.query("DELETE FROM cart WHERE user_id = ?", [userId]);
};
