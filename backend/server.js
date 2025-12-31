import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// ROUTES
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import adminRoutes from "./routes/admin.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import reorderRoutes from "./routes/reorderRoutes.js";
import cancelOrderRoutes from "./routes/cancelOrderRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ ONLY THIS
import walletRoutes from "./routes/walletRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// MIDDLEWARE
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ================= ROUTES ================= */
app.use("/api/products", productRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/reorder", reorderRoutes);
app.use("/api/cancel-order", cancelOrderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes); // ✅ PROFILE ROUTES FIXED
app.use("/api/wallet", walletRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/notifications", notificationRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("✅ Backend running...");
});

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
