 
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
 
// =========================
// CREATE ADMIN
// =========================
export const createAdmin = (req, res) => {
  try {
    const { name, email, password } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
 
    // Check if admin exists
    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, rows) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "DB Error" });
      }
 
      if (rows.length > 0) {
        return res.status(400).json({ message: "Admin already exists" });
      }
 
      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);
 
      // Insert
      const sql =
        "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)";
      db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.log("INSERT ERROR:", err);
          return res.status(500).json({ message: "DB Error" });
        }
 
        return res.json({ message: "Admin created successfully" });
      });
    });
  } catch (error) {
    console.log("Exception:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
 
// =========================
// LOGIN ADMIN
// =========================
export const loginAdmin = (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const password = (req.body?.password || "").trim();
 
    console.log(`[LOGIN] attempt for ${email}`);
 
    db.query("SELECT * FROM admin WHERE LOWER(email) = ?", [email], (err, rows) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "DB Error" });
      }
 
      if (rows.length === 0) {
        console.log("[LOGIN] Admin not found");
        return res.status(400).json({ message: "Admin not found" });
      }
 
      const admin = rows[0];
 
      let validPassword = false;
 
      if (admin.password.startsWith("$2")) {
        // bcrypt hashed
        validPassword = bcrypt.compareSync(password, admin.password);
        console.log("[LOGIN] bcrypt compare =", validPassword);
      } else {
        // plain text
        validPassword = password === admin.password;
        console.log("[LOGIN] plain compare =", validPassword);
      }
 
      if (!validPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
 
      // Create token
      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.ADMIN_SECRET || "ADMIN_SECRET",
        { expiresIn: "7d" }
      );
 
      return res.json({
        message: "Login successful",
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      });
    });
  } catch (error) {
    console.log("Exception:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
 
 