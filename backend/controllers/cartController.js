// import db from "../config/db.js";

// // GET USER CART ITEMS
// export const getCart = (req, res) => {
//   const userId = req.user.id;

//   db.query(
//     `SELECT cart.id, cart.quantity, products.name, products.price, products.image 
//      FROM cart 
//      JOIN products ON products.id = cart.product_id 
//      WHERE cart.user_id = ?`,
//     [userId],
//     (err, result) => {
//       if (err) return res.status(500).send(err);

//       res.json(result);
//     }
//   );
// };

// // ADD TO CART
// export const addToCart = (req, res) => {
//   const userId = req.user.id;
//   const { product_id, quantity } = req.body;

//   // Check if product exists in cart
//   db.query(
//     "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
//     [userId, product_id],
//     (err, result) => {
//       if (result.length > 0) {
//         // Update quantity
//         db.query(
//           "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
//           [quantity, userId, product_id]
//         );
//         return res.json({ message: "Quantity updated" });
//       }

//       // Insert new item
//       db.query(
//         "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
//         [userId, product_id, quantity],
//         (err, result) => {
//           if (err) return res.status(500).send(err);

//           res.json({ message: "Added to cart" });
//         }
//       );
//     }
//   );
// };

// // UPDATE CART QUANTITY
// export const updateCart = (req, res) => {
//   const userId = req.user.id;
//   const { product_id, quantity } = req.body;

//   db.query(
//     "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
//     [quantity, userId, product_id],
//     (err, result) => {
//       if (err) return res.status(500).send(err);

//       res.json({ message: "Cart updated" });
//     }
//   );
// };

// // REMOVE ITEM FROM CART
// export const removeFromCart = (req, res) => {
//   const userId = req.user.id;
//   const { product_id } = req.params;

//   db.query(
//     "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
//     [userId, product_id],
//     (err, result) => {
//       if (err) return res.status(500).send(err);

//       res.json({ message: "Item removed" });
//     }
//   );
// };
import db from "../config/db.js";

// Add item to cart (or increase qty if exists)
export const addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, qty = 1 } = req.body;

  // check existing
  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [userId, productId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length > 0) {
        // update qty
        const cartId = rows[0].id;
        db.query(
          "UPDATE cart SET qty = qty + ? WHERE id = ?",
          [qty, cartId],
          (uErr) => {
            if (uErr) return res.status(500).json(uErr);
            return res.json({ message: "Cart updated" });
          }
        );
      } else {
        // insert new
        db.query(
          "INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)",
          [userId, productId, qty],
          (iErr) => {
            if (iErr) return res.status(500).json(iErr);
            return res.json({ message: "Added to cart" });
          }
        );
      }
    }
  );
};

// Get cart for logged-in user (returns product fields + cartId + qty)
export const getCart = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT c.id AS cartId, c.qty, p.id AS productId, p.name, p.price, p.image, p.description
    FROM cart c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// Update cart qty by cartId
export const updateCartQty = (req, res) => {
  const { cartId } = req.params;
  const { qty } = req.body;
  db.query("UPDATE cart SET qty = ? WHERE id = ?", [qty, cartId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Qty updated" });
  });
};

// Remove from cart by cartId
export const removeFromCart = (req, res) => {
  const { cartId } = req.params;
  db.query("DELETE FROM cart WHERE id = ?", [cartId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Removed from cart" });
  });
};

// Optional: count endpoint
export const getCartCount = (req, res) => {
  const userId = req.user.id;
  db.query("SELECT SUM(qty) AS count FROM cart WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json({ count: rows[0].count || 0 });
  });
};
