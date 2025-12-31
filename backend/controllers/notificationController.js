import db from "../config/db.js";

/* GET PREFERENCES */
export const getPreferences = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM notification_preferences WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      // Auto-create if not exists
      if (rows.length === 0) {
        db.query(
          "INSERT INTO notification_preferences (user_id) VALUES (?)",
          [userId],
          () => {
            res.json({
              order_updates: true,
              offers: true,
              wallet: true,
              email_enabled: true,
              sms_enabled: false,
              push_enabled: false,
            });
          }
        );
      } else {
        res.json(rows[0]);
      }
    }
  );
};

/* UPDATE PREFERENCES */
export const updatePreferences = (req, res) => {
  const userId = req.user.id;
  const {
    order_updates,
    offers,
    wallet,
    email_enabled,
    sms_enabled,
    push_enabled,
  } = req.body;

  db.query(
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
    ],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Notification preferences updated" });
    }
  );
};

/* GET NOTIFICATIONS */
export const getNotifications = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT * FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 20
    `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};
