import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    
const { name, email, password } = req.body;

// ✅ Empty field check
if (!name || !email || !password) {
  return res.status(400).json({
    message: "All fields required",
  });
}

// ✅ Name validation
const nameRegex = /^[A-Za-z ]+$/;

if (!nameRegex.test(name)) {
  return res.status(400).json({
    message: "Name should contain only alphabets",
  });
}

// ✅ Lowercase email validation
const emailRegex =
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Email should contain only lowercase letters",
  });
}

// ✅ Strong password validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
  });
}

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email exists" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email.toLowerCase(), hashed]
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

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    console.log("FORGOT PASSWORD EMAIL:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [rows] = await db.query(
      "SELECT id FROM users WHERE LOWER(email) = ?",
      [email]
    );

    console.log("USER FOUND:", rows.length);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = Date.now() + 15 * 60 * 1000;

    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [resetToken, resetExpiry, email]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔴 THIS LINE WILL THROW IF EMAIL CONFIG IS WRONG
    await transporter.verify();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({
      message: "Failed to send reset link",
      error: err.message,
    });
  }
};
/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const [rows] = await db.query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
      [token, Date.now()]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    await db.query(
      `UPDATE users 
       SET password = ?, reset_token = NULL, reset_token_expiry = NULL 
       WHERE reset_token = ?`,
      [hashed, token]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
};
