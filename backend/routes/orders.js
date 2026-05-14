// import express from "express";
// import userAuth from "../middleware/userAuth.js";
// import {
//   createOrder,
//   getMyOrders,
//   getOrders,
//   getOrderById,
//   markOrderDelivered,
// } from "../controllers/ordersController.js";
// import { generateInvoice } from "../utils/generateInvoice.js";
// import db from "../config/db.js"; // 👈 your mysql connection

// const router = express.Router();

// // Create order
// router.post("/order", userAuth, createOrder);

// // My orders
// router.get("/my-orders", userAuth, getMyOrders);

// // Admin orders
// router.get("/", getOrders);

// // 📄 DOWNLOAD INVOICE (MySQL)
// router.get("/invoice/:id", userAuth, async (req, res) => {
//   try {
//     const orderId = req.params.id;

//     // 1️⃣ Get order
//     const [orders] = await db.query(
//       "SELECT * FROM orders WHERE id = ?",
//       [orderId]
//     );

//     if (!orders.length) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const order = orders[0];

//     // 2️⃣ Security: only owner can download
//     if (order.user_id !== req.user.id) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     // 3️⃣ Get order items
//     const [items] = await db.query(
//       "SELECT * FROM order_items WHERE order_id = ?",
//       [orderId]
//     );

//     // 4️⃣ Build invoice object
//     const invoiceData = {
//       orderId: order.id,
//       orderDate: order.created_at,
//       paymentMethod: order.payment_method,
//       customer: {
//         name: order.address_name,
//         phone: order.phone,
//       },
//       deliveryAddress: {
//         house: order.house_no,
//         street: order.street,
//         area: order.area,
//         city: order.city,
//         state: order.state,
//         pincode: order.pincode,
//       },
//       items: items.map((i) => ({
//         name: i.name,
//         qty: i.quantity,
//         price: i.price,
//       })),
//       bill: {
//         itemTotal: items.reduce(
//           (sum, i) => sum + i.price * i.quantity,
//           0
//         ),
//         deliveryFee: 0,
//         gst: 0,
//         grandTotal: order.total_amount,
//       },
//     };

//     // 5️⃣ Generate PDF
//     generateInvoice(invoiceData, res);
//   } catch (err) {
//     console.error("Invoice error:", err);
//     res.status(500).json({ message: "Invoice generation failed" });
//   }
// });

// // Order details
// router.get("/:id", userAuth, getOrderById);

// // Mark delivered
// router.put("/:id/deliver", markOrderDelivered);

// export default router;


import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  markOrderDelivered,
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

/* =========================================================
   MARK ORDER DELIVERED
========================================================= */
router.put("/:id/deliver", userAuth, markOrderDelivered);

export default router;