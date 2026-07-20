import db from "../config/db.js";

/* CREATE SUPPORT TICKET */
export const createTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id, category, subject, message } = req.body;

    await db.query(
      `
      INSERT INTO support_tickets
      (user_id, order_id, category, subject, message)
      VALUES (?, ?, ?, ?, ?)
      `,
      [userId, order_id || null, category, subject, message]
    );

    res.json({
      message: "Support request submitted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/* GET USER SUPPORT HISTORY */
export const getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT *
      FROM support_tickets
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/* GET ALL SUPPORT TICKETS (ADMIN) */
export const getAllTickets = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT
        st.*,
        u.name,
        u.email
      FROM support_tickets st
      JOIN users u
        ON st.user_id = u.id
      ORDER BY st.created_at DESC
      `
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

/* UPDATE TICKET STATUS (ADMIN) */
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query(
      `
      UPDATE support_tickets
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    res.json({
      success: true,
      message: "Ticket status updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};