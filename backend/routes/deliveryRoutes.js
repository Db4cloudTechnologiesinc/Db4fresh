import express from "express";
import upload from "../middleware/upload.js";  // ✅ Import multer config
import {
  registerDelivery,
  loginDelivery
} from "../controllers/deliveryController.js";

const router = express.Router();

/* ===============================
   REGISTER DELIVERY PARTNER
=============================== */
router.post(
  "/register",
  upload.single("license_image"),   // 🔥 MUST match frontend field name
  registerDelivery
);

/* ===============================
   LOGIN DELIVERY PARTNER
=============================== */
router.post("/login", loginDelivery);

export default router;



