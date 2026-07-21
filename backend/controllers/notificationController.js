import db from "../config/db.js";

/* GET PREFERENCES */
export const getPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM notification_preferences WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      await db.query(
        "INSERT INTO notification_preferences (user_id) VALUES (?)",
        [userId]
      );

      return res.json({
        order_updates: true,
        offers: true,
        wallet: true,
        email_enabled: true,
        sms_enabled: false,
        push_enabled: false,
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

/* UPDATE PREFERENCES */
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      order_updates,
      offers,
      wallet,
      email_enabled,
      sms_enabled,
      push_enabled,
    } = req.body;

    await db.query(
      `
      UPDATE notification_preferences SET
        order_updates = ?,
        offers = ?,
        wallet = ?,
        email_enabled = ?,
        sms_enabled = ?,
        push_enabled = ?
      WHERE user_id = ?
      `,
      [
        order_updates,
        offers,
        wallet,
        email_enabled,
        sms_enabled,
        push_enabled,
        userId,
      ]
    );

    res.json({
      message: "Notification preferences updated",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* GET NOTIFICATIONS */
export const getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM notifications
      WHERE is_read = 0
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* MARK AS READ */
export const markNotificationsRead = async (req, res) => {
  try {
    await db.query(`
      UPDATE notifications
      SET is_read = 1
      WHERE is_read = 0
    `);

    res.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};