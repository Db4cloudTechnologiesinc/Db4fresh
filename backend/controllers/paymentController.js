import crypto from "crypto";
import db from "../config/db.js";

/* =====================================
   VERIFY RAZORPAY PAYMENT
===================================== */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // your DB order id
    } = req.body;

    // 🔐 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ Mark order as PAID
    const sql = `
      UPDATE orders
      SET payment_status = 'paid'
      WHERE id = ?
    `;

    await db.query(sql, [orderId]);

    res.json({ success: true });
  } catch (err) {
    console.error("PAYMENT VERIFY ERROR:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
