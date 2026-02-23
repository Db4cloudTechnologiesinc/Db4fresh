import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Tesseract from "tesseract.js";
import path from "path";
import fs from "fs";

/* ================= REGISTER WITH OCR ================= */
export const registerDelivery = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      dob,
      vehicle_type,
      license_number,
      license_expiry,
      verification_score,
    } = req.body;

    const licenseImage = req.file?.filename;

    if (!licenseImage) {
      return res.status(400).json({
        message: "License image required",
      });
    }

    /* ================= CHECK EMAIL ================= */
    const [existing] = await db.query(
      "SELECT id FROM delivery_partners WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= SAFE FILE PATH ================= */
    const imagePath = path.join(
      process.cwd(),
      "uploads",
      "delivery",
      licenseImage
    );

    console.log("Reading image from:", imagePath);

    if (!fs.existsSync(imagePath)) {
      return res.status(400).json({
        message: "Uploaded file not found on server",
      });
    }

    /* ================= OCR PROCESS ================= */
    const result = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    const extractedText = result.data.text.toUpperCase();

    console.log("OCR TEXT:", extractedText);

    /* ================= VALIDATION ================= */
let status = "REJECTED";

/* ================= KEYWORD CHECK ================= */
const containsLicenseKeyword =
  extractedText.includes("DRIVING") ||
  extractedText.includes("LICENCE") ||
  extractedText.includes("LICENSE");

/* ================= LICENSE FORMAT CHECK ================= */
// Accept modern Indian DL formats (10–20 alphanumeric characters)
const licenseRegex = /^[A-Z0-9]{10,20}$/;

const cleanedLicenseNumber =
  license_number?.replace(/\s/g, "").toUpperCase();

const validLicenseFormat =
  licenseRegex.test(cleanedLicenseNumber);

/* ================= EXPIRY CHECK ================= */
const notExpired =
  new Date(license_expiry) > new Date();

/* ================= DRIVING TEST CHECK ================= */
const passedTest =
  parseInt(verification_score) >= 2;

/* ================= DEBUG LOGS ================= */
console.log("containsLicenseKeyword:", containsLicenseKeyword);
console.log("validLicenseFormat:", validLicenseFormat);
console.log("notExpired:", notExpired);
console.log("passedTest:", passedTest);

/* ================= FINAL DECISION ================= */
if (
  containsLicenseKeyword &&
  validLicenseFormat &&
  notExpired &&
  passedTest
) {
  status = "APPROVED";
}


    /* ================= INSERT INTO DB ================= */

    await db.query(
      `INSERT INTO delivery_partners 
       (name, email, password, phone, dob, vehicle_type,
        license_number, license_expiry, license_image,
        verification_score, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        hashedPassword,
        phone,
        dob,
        vehicle_type,
        license_number,
        license_expiry,
        licenseImage,
        verification_score || 0,
        status,
      ]
    );

    if (status === "APPROVED") {
      return res.status(201).json({
        message: "Verification successful. You can login.",
      });
    } else {
      return res.status(400).json({
        message:
          "License verification failed. Please upload valid driving license.",
      });
    }

  } catch (err) {
    console.error("OCR REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ================= LOGIN ================= */
export const loginDelivery = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM delivery_partners WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (user.status !== "APPROVED") {
      return res.status(403).json({
        message:
          "Account not verified. License validation failed.",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
