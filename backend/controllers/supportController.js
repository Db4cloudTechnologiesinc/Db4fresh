import db from "../config/db.js";

/* CREATE SUPPORT TICKET */
export const createTicket = (req, res) => {
  const userId = req.user.id;
  const { order_id, category, subject, message } = req.body;

  db.query(
    `
    INSERT INTO support_tickets 
    (user_id, order_id, category, subject, message)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, order_id || null, category, subject, message],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Support request submitted successfully" });
    }
  );
};

/* GET USER SUPPORT HISTORY */
export const getMyTickets = (req, res) => {
  const userId = req.user.id;

  db.query(
    `
    SELECT * FROM support_tickets 
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
};
