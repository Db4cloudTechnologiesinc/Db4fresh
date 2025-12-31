import db from "../config/db.js";

/* =========================
   GET USER PROFILE
========================= */
export const getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT id, name, email, phone FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(rows[0]);
    }
  );
};

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, phone } = req.body;

  db.query(
    "UPDATE users SET name = ?, phone = ? WHERE id = ?",
    [name, phone, userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Profile updated successfully" });
    }
  );
};
/* =========================
   DELETE USER ACCOUNT
========================= */
export const deleteAccount = (req, res) => {
  const userId = req.user.id;

  // 1️⃣ Delete dependent data first (IMPORTANT)
  db.query("DELETE FROM orders WHERE user_id = ?", [userId]);
  db.query("DELETE FROM user_addresses WHERE user_id = ?", [userId]);
  db.query("DELETE FROM wishlist WHERE user_id = ?", [userId]);
  db.query("DELETE FROM cart WHERE user_id = ?", [userId]);

  // 2️⃣ Delete user
  db.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Account deleted successfully" });
    }
  );
};

export const deactivateAccount = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    UPDATE users 
    SET is_active = 0, deleted_at = NOW()
    WHERE id = ?
    `,
    [userId],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message:
          "Your account has been deactivated. You can restore it within 7 days by logging in again.",
      });
    }
  );
};
//export { getProfile, updateProfile , deleteAccount };