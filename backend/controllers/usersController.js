import db from "../config/db.js";

export const getUsers = (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

export const getUser = (req, res) => {
  db.query("SELECT id, name, email, role FROM users WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows[0]);
  });
};

export const deleteUser = (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
};
