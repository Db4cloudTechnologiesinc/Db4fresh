// import express from "express";
// import db from "../config/db.js";

// const router = express.Router();

// // Get all users
// router.get("/", (req, res) => {
//   db.query("SELECT id, name, email, created_at FROM users ORDER BY id DESC",
//     (err, rows) => {
//       if (err) return res.status(500).json(err);
//       res.json(rows);
//     }
//   );
// });

// // Get single user
// router.get("/:id", (req, res) => {
//   db.query("SELECT id, name, email FROM users WHERE id = ?",
//     [req.params.id],
//     (err, rows) => {
//       if (err) return res.status(500).json(err);
//       res.json(rows[0]);
//     }
//   );
// });

// // Delete user
// router.delete("/:id", (req, res) => {
//   db.query("DELETE FROM users WHERE id = ?",
//     [req.params.id],
//     (err) => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "User deleted" });
//     }
//   );
// });

// export default router;
import express from "express";
import { getUsers, getUser, deleteUser } from "../controllers/usersController.js";
const router = express.Router();
router.get("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
export default router;
