import db from "../config/db.js";

/* ================= GET ALL REVIEWS ================= */
export const getAllReviews = (req, res) => {
  const sql = `
    SELECT 
      r.id,
      r.rating,
      r.comment,
      r.status,
      r.created_at,
      u.name AS user_name,
      p.name AS product_name
    FROM product_reviews r
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows || []);
  });
};

/* ================= UPDATE REVIEW STATUS ================= */
export const updateReviewStatus = (req, res) => {
  const { status } = req.body;
  const reviewId = req.params.id;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const sql = `
    UPDATE product_reviews
    SET status = ?, moderated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [status, reviewId], (err, result) => {
    if (err) return res.status(500).json({ message: "Update failed" });

    res.json({ message: `Review ${status.toLowerCase()}` });
  });
};
