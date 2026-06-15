
import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  markOrderDelivered,
  assignPartner,
  getOrderTimeline,
  getDeliveryPartners,
} from "../controllers/ordersController.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import db from "../config/db.js";

const router = express.Router();

/* =========================================================
   CREATE ORDER (Kafka)
========================================================= */
router.post("/order", userAuth, createOrder);

/* =========================================================
   MY ORDERS
========================================================= */
router.get("/my-orders", userAuth, getMyOrders);

/* =========================================================
   ADMIN ORDERS
========================================================= */
router.get("/", getOrders);

/* =========================================================
   DOWNLOAD INVOICE
========================================================= */
router.get("/invoice/:id", userAuth, async (req, res) => {
  try {
    const orderId = req.params.id;

    // 1️⃣ Get order
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    if (!orders.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];

    // 🔐 Security check
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 2️⃣ Get order items
    const [items] = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );

    // 3️⃣ Build invoice
    const invoiceData = {
      orderId: order.id,
      orderDate: order.created_at,
      paymentMethod: order.payment_method,

      customer: {
        name: order.address_name,
        phone: order.phone,
      },

      deliveryAddress: {
        house: order.house_no,
        street: order.street,
        area: order.area,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
      },

      items: items.map((i) => ({
        name: i.product_name, // ✅ FIX (was wrong before)
        qty: i.quantity,
        price: i.price,
      })),

      bill: {
        itemTotal: items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
        deliveryFee: 0,
        gst: 0,
        grandTotal: order.total_amount,
      },
    };

    // 4️⃣ Generate PDF
    generateInvoice(invoiceData, res);

  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
});

/* =========================================================
   GET ORDER BY ID
========================================================= */
router.get("/:id", userAuth, getOrderById);


router.put("/:id/status", updateOrderStatus);

/* =========================================================
   MARK ORDER DELIVERED
========================================================= */
router.put("/:id/deliver", userAuth, markOrderDelivered);
router.put("/:id/assign-partner", assignPartner);
router.get("/:id/timeline", getOrderTimeline);
router.get("/:id/delivery-partners", getDeliveryPartners);


export default router;