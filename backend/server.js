import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/products.js";
import addressesRoutes from "./routes/addresses.js";
import { errorHandler } from "./middleware/errorHandler.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  allowedHeaders: "*"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ Serve uploads BEFORE any routes
app.use("/uploads", express.static("uploads"));

// ⭐ ROUTES
app.use("/api/products", productRoutes);
app.use("/api/addresses", addressesRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Backend running...");
});

// ❌ Remove old 404 (because it blocked static files)
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
