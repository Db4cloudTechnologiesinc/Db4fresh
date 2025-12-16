// import db from "../config/db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // SIGNUP
// export const signup = (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
//     if (result?.length > 0) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     db.query(
//       "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//       [name, email, hashedPassword],
//       (err, result) => {
//         if (err) return res.status(500).send(err);

//         return res.json({ message: "User registered successfully" });
//       }
//     );
//   });
// };

// // LOGIN
// export const login = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "All fields required" });
//   }

//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, users) => {
//     if (users?.length === 0) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const user = users[0];

//     const valid = bcrypt.compareSync(password, user.password);
//     if (!valid) {
//       return res.status(400).json({ message: "Incorrect password" });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       "SECRET123",
//       { expiresIn: "7d" }
//     );

//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   });
// };
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length > 0) return res.status(400).json({ message: "Email exists" });

    const hashed = bcrypt.hashSync(password, 10);
    db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashed], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User created", id: result.insertId });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
  });
};
