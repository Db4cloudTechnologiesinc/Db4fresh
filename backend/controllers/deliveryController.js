
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

    if (!licenseImage)
      return res.status(400).json({ message: "License image required" });

    const [existing] = await db.query(
      "SELECT id FROM delivery_partners WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const imagePath = path.join(
      process.cwd(),
      "uploads",
      "delivery",
      licenseImage
    );

    if (!fs.existsSync(imagePath))
      return res.status(400).json({ message: "Uploaded file not found" });

    const result = await Tesseract.recognize(imagePath, "eng");
    const extractedText = result.data.text.toUpperCase();

    let status = "rejected";

    const containsLicenseKeyword =
      extractedText.includes("DRIVING") ||
      extractedText.includes("LICENCE") ||
      extractedText.includes("LICENSE");

    const licenseRegex = /^[A-Z0-9]{10,20}$/;
    const cleanedLicenseNumber =
      license_number?.replace(/\s/g, "").toUpperCase();

    const validLicenseFormat =
      licenseRegex.test(cleanedLicenseNumber);

    const notExpired =
      new Date(license_expiry) > new Date();

    const passedTest =
      parseInt(verification_score) >= 2;

    if (
      containsLicenseKeyword &&
      validLicenseFormat &&
      notExpired &&
      passedTest
    ) {
      status = "approved";
    }

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

    if (status === "approved") {
      return res.status(201).json({
        message: "Verification successful. You can login.",
      });
    }

    return res.status(400).json({
      message: "License verification failed.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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

    if (!users.length)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.status !== "approved")
      return res.status(403).json({ message: "Account not verified." });

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

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELIVERY HISTORY ================= */
export const getDeliveryHistory = async (req, res) => {
  try {
    const deliveryId = req.user.id;

    const [orders] = await db.query(
      `SELECT id, total_amount, delivered_at
       FROM orders
       WHERE delivery_partner_id = ?
       AND order_status = 'DELIVERED'
       ORDER BY delivered_at DESC`,
      [deliveryId]
    );

    res.json({
      success: true,
      totalOrders: orders.length,
      orders,
    });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= PROFILE ================= */
export const updateDeliveryProfile = async (req, res) => {
  try {
    const deliveryId = req.user.id;
    const { name, phone } = req.body;

    let profileImage = req.file ? req.file.filename : null;

    await db.query(
      `UPDATE delivery_partners
       SET name=?, phone=?, profile_image=COALESCE(?, profile_image)
       WHERE id=?`,
      [name, phone, profileImage, deliveryId]
    );

    res.json({ success: true });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDeliveryProfile = async (req, res) => {
  try {
    const deliveryId = req.user.id;

    const [rows] = await db.query(
      `SELECT 
         name, 
         phone_number AS phone, 
         profile_image 
       FROM delivery_partners 
       WHERE id=?`,
      [deliveryId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("Profile API Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
/* ================= STORE DETAILS ================= */
export const getStoreDetails = async (req, res) => {
  try {
    const deliveryId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM delivery_store WHERE delivery_id=?",
      [deliveryId]
    );

    res.json(rows[0] || {});
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateStoreDetails = async (req, res) => {
  try {
    const deliveryId = req.user.id;
    const {
      store_name,
      address,
      city,
      pincode,
      phone,
      latitude,
      longitude,
      is_active
    } = req.body;

    const [existing] = await db.query(
      "SELECT id FROM delivery_store WHERE delivery_id=?",
      [deliveryId]
    );

    if (existing.length) {
      await db.query(
        `UPDATE delivery_store
         SET store_name=?, address=?, city=?, pincode=?, phone=?, latitude=?, longitude=?, is_active=?
         WHERE delivery_id=?`,
        [store_name, address, city, pincode, phone, latitude, longitude, is_active, deliveryId]
      );
    } else {
      await db.query(
        `INSERT INTO delivery_store
         (delivery_id, store_name, address, city, pincode, phone, latitude, longitude, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [deliveryId, store_name, address, city, pincode, phone, latitude, longitude, is_active]
      );
    }

    res.json({ success: true });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= SUPPORT ================= */
export const createSupportTicket = async (req, res) => {
  try {
    const deliveryId = req.user.id;
    const { issue_type, description } = req.body;

    let screenshot = req.file ? req.file.filename : null;

    await db.query(
      `INSERT INTO delivery_support_tickets
       (delivery_id, issue_type, description, screenshot)
       VALUES (?, ?, ?, ?)`,
      [deliveryId, issue_type, description, screenshot]
    );

    res.json({ success: true });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSupportTickets = async (req, res) => {
  try {
    const deliveryId = req.user.id;

    const [rows] = await db.query(
      `SELECT * FROM delivery_support_tickets
       WHERE delivery_id=?
       ORDER BY created_at DESC`,
      [deliveryId]
    );

    res.json(rows);

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= DOCUMENTS ================= */
export const uploadDocument = async (req, res) => {
  try {
    const deliveryId = req.user.id;
    const { document_type } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "File required" });

    const fileName = req.file.filename;

    const [existing] = await db.query(
      "SELECT id FROM delivery_documents WHERE delivery_id=? AND document_type=?",
      [deliveryId, document_type]
    );

    if (existing.length) {
      await db.query(
        "UPDATE delivery_documents SET file_name=?, status='Pending' WHERE delivery_id=? AND document_type=?",
        [fileName, deliveryId, document_type]
      );
    } else {
      await db.query(
        "INSERT INTO delivery_documents (delivery_id, document_type, file_name) VALUES (?, ?, ?)",
        [deliveryId, document_type, fileName]
      );
    }

    res.json({ success: true });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const deliveryId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM delivery_documents WHERE delivery_id=?",
      [deliveryId]
    );

    res.json(rows);

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= ADVANCED COD SYSTEM ================= */

export const getAssignedOrders = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const [orders] = await db.query(
      `SELECT id, total_amount, payment_method, payment_status, order_status, created_at
       FROM orders
       WHERE delivery_partner_id=? 
       AND order_status='OUT_FOR_DELIVERY'
       ORDER BY created_at DESC`,
      [partnerId]
    );

    res.json({ success: true, orders });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const collectCODPayment = async (req, res) => {
  const partnerId = req.user.id;
  const { order_id } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [rows] = await connection.query(
      `SELECT * FROM orders WHERE id=? AND delivery_partner_id=?`,
      [order_id, partnerId]
    );

    if (!rows.length)
      throw new Error("Order not assigned");

    const order = rows[0];

    if (order.payment_method !== "COD")
      throw new Error("Not COD order");

    if (order.payment_status === "paid")
      throw new Error("Already paid");

    await connection.query(
      `UPDATE orders SET payment_status='paid', order_status='DELIVERED' WHERE id=?`,
      [order_id]
    );

    await connection.query(
      `INSERT INTO cod_transactions (order_id, partner_id, amount)
       VALUES (?, ?, ?)`,
      [order_id, partnerId, order.total_amount]
    );

    await connection.query(
      `INSERT INTO delivery_wallet (partner_id,total_cod_collected)
       VALUES (?,?)
       ON DUPLICATE KEY UPDATE
       total_cod_collected=total_cod_collected+VALUES(total_cod_collected)`,
      [partnerId, order.total_amount]
    );

    await connection.commit();
    res.json({ success: true });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

export const getWalletSummary = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const [rows] = await db.query(
      `SELECT total_cod_collected, total_settled,
       (total_cod_collected-total_settled) AS pending
       FROM delivery_wallet WHERE partner_id=?`,
      [partnerId]
    );

    res.json(rows[0] || {
      total_cod_collected: 0,
      total_settled: 0,
      pending: 0
    });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCODTransactions = async (req, res) => {
  try {
    const partnerId = req.user.id;

    const [rows] = await db.query(
      `SELECT * FROM cod_transactions
       WHERE partner_id=?
       ORDER BY collected_at DESC`,
      [partnerId]
    );

    res.json(rows);

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};
export const getDeliveryEarnings = async (req, res) => {
  try {
    const deliveryId = req.user.id;

    const [orders] = await db.query(
      `SELECT total_amount, payment_method, created_at 
       FROM orders 
       WHERE delivery_partner_id = ? 
       AND order_status = 'DELIVERED'`,
      [deliveryId]
    );

    let totalEarnings = 0;
    let todayEarnings = 0;
    let codAmount = 0;
    let onlineAmount = 0;

    const today = new Date().toISOString().split("T")[0];

    orders.forEach(order => {
      // Example: give 10% commission per order
      const deliveryFee = order.total_amount * 0.1;

      totalEarnings += deliveryFee;

      if (order.created_at?.toISOString?.().split("T")[0] === today) {
        todayEarnings += deliveryFee;
      }

      if (order.payment_method === "COD") {
        codAmount += order.total_amount;
      } else {
        onlineAmount += order.total_amount;
      }
    });

    res.json({
      totalEarnings,
      todayEarnings,
      totalOrders: orders.length,
      codAmount,
      onlineAmount
    });

  } catch (error) {
    console.error("Earnings API Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};