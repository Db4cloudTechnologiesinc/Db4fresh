

import dotenv from "dotenv";
dotenv.config(); // MUST BE FIRST

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

/* ================= FIX __dirname FOR ES MODULE ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= ROUTES ================= */
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import adminRoutes from "./routes/admin.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import reorderRoutes from "./routes/reorderRoutes.js";
import cancelOrderRoutes from "./routes/cancelOrderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

/* ================= DELIVERY ROUTES ================= */
import authMiddleware from "./middleware/authMiddleware.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import dashboardRoutes from "./routes/delivery/dashboard.js";
import slotsRoutes from "./routes/delivery/slots.js";
import referralRoutes from "./routes/delivery/referral.js";
import earningsRoutes from "./routes/delivery/earnings.js";
import statusRoutes from "./routes/delivery/status.js";

/* ================= MIDDLEWARE ================= */
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES (FINAL FIX) ================= */

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads" // <-- backend/uploads
    )
  )
);

/* ================= API ROUTES ================= */
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/reorder", reorderRoutes);
app.use("/api/cancel-order", cancelOrderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/payment", paymentRoutes);
/* ================= DELIVERY SYSTEM ================= */
app.use("/api/delivery", deliveryRoutes);
app.use("/api/delivery/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/delivery/slots", authMiddleware, slotsRoutes);
app.use("/api/delivery/referral", authMiddleware, referralRoutes);
app.use("/api/delivery/earnings", authMiddleware, earningsRoutes);
app.use("/api/delivery/status", authMiddleware, statusRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DB4Fresh Backend Running 🚀",
  });
});

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
  console.log("📂 Serving uploads from:", path.join(__dirname, "uploads"));
});