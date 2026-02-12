
import express from "express";
import crypto from "crypto";
import { getRazorpayInstance } from "../config/razorpay.js";
import db from "../config/db.js";

const router = express.Router();

/* ================= CREATE RAZORPAY ORDER ================= */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const razorpay = getRazorpayInstance();

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "db4fresh_" + Date.now(),
    });

    res.json(razorpayOrder);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ================= VERIFY PAYMENT ================= */
router.post(
  "/verify",
  express.urlencoded({ extended: true }),
  async (req, res) => {
    console.log("🔥 VERIFY HIT");
console.log("BODY:", req.body);
console.log("QUERY:", req.query);

    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      // ✅ FIX 1: read orderId from QUERY or BODY
      const orderId = req.body.orderId || req.query.orderId;

      if (!razorpay_payment_id || !orderId) {
        console.error("Missing payment_id or orderId");
        return res.redirect("http://localhost:5173/payment-failed");
      }

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        console.error("Signature mismatch");
        return res.redirect("http://localhost:5173/payment-failed");
      }

      /* 🔥 FIX 2: correct column names 🔥 */
      await db.query(
  `UPDATE orders
   SET payment_status = 'paid',
       payment_method = 'ONLINE',
       order_status = 'PLACED',
       payment_id = ?
   WHERE id = ?`,
  [razorpay_payment_id, orderId]
);


      console.log("✅ Payment verified & order updated:", orderId);

      res.redirect("http://localhost:5173/order-success");
    } catch (err) {
      console.error("VERIFY PAYMENT ERROR:", err);
      res.redirect("http://localhost:5173/payment-failed");
    }
  }
);

export default router;
