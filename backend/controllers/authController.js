
// import db from "../config/db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const signup = (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
//     if (err) return res.status(500).json(err);
//     if (rows.length > 0) return res.status(400).json({ message: "Email exists" });

//     const hashed = bcrypt.hashSync(password, 10);
//     db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed], (err, result) => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "User created", id: result.insertId });
//     });
//   });
// };

// export const login = (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password required" });
//     }

//     db.query(
//       "SELECT * FROM users WHERE email = ?",
//       [email],
//       (err, rows) => {
//         if (err) {
//           console.error("DB error:", err);
//           return res.status(500).json({ message: "Database error" });
//         }

//         if (rows.length === 0) {
//           return res.status(400).json({ message: "User not found" });
//         }

//         const user = rows[0];

//         const isMatch = bcrypt.compareSync(password, user.password);
//         if (!isMatch) {
//           return res.status(400).json({ message: "Incorrect password" });
//         }

//         const token = jwt.sign(
//           { id: user.id, email: user.email, role: user.role || "user" },
//           process.env.JWT_SECRET,
//           { expiresIn: "7d" }
//         );

//         res.json({
//           token,
//           user: {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role || "user",
//           },
//         });
//       }
//     );
//   } catch (error) {
//     console.error("LOGIN CRASH:", error);
//     res.status(500).json({ message: "Login failed" });
//   }
// };
 
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
 
/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
 
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
 
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email exists" });
    }
 
    const hashed = bcrypt.hashSync(password, 10);
 
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );
 
    res.json({ message: "User created", id: result.insertId });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};
 
/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
 
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
 
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
 
    const user = rows[0];
 
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
 
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
 
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
 
 