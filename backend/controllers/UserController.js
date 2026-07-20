import db from "../config/db.js";

/* =========================
   GET USER PROFILE
========================= */
export const getProfile = async (req, res) => {
  try {
    console.log("GET PROFILE API CALLED");

    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Profile Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   GET ALL USERS
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   SEARCH USERS
========================= */
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;

    const [rows] = await db.query(
      `
      SELECT id, name, email
      FROM users
      WHERE name LIKE ?
         OR CAST(id AS CHAR) LIKE ?
      `,
      [`%${query}%`, `%${query}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    await db.query(
      "UPDATE users SET name = ?, phone = ? WHERE id = ?",
      [name, phone, userId]
    );

    res.json({
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Update Profile Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   GET USER BY ID
========================= */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        created_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   GET USER DETAILS
========================= */
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await db.query(
      `
      SELECT id, name, email, phone, created_at
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const [orders] = await db.query(
      `
      SELECT *
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [id]
    );

    const [addresses] = await db.query(
      `
      SELECT *
      FROM user_addresses
      WHERE user_id = ?
      `,
      [id]
    );

    const totalOrders = orders.length;

    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const lastOrderDate =
      orders.length > 0 ? orders[0].created_at : null;

    res.json({
      user: users[0],
      stats: {
        totalOrders,
        totalSpent,
        lastOrderDate,
      },
      addresses,
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   DELETE USER ACCOUNT
========================= */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      "DELETE FROM orders WHERE user_id = ?",
      [userId]
    );

    await db.query(
      "DELETE FROM user_addresses WHERE user_id = ?",
      [userId]
    );

    await db.query(
      "DELETE FROM wishlist WHERE user_id = ?",
      [userId]
    );

    await db.query(
      "DELETE FROM cart WHERE user_id = ?",
      [userId]
    );

    await db.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    res.json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   DEACTIVATE ACCOUNT
========================= */
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      `
      UPDATE users
      SET is_active = 0,
          deleted_at = NOW()
      WHERE id = ?
      `,
      [userId]
    );

    res.json({
      message:
        "Your account has been deactivated. You can restore it within 7 days by logging in again.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};