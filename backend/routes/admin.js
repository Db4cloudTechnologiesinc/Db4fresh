 
import express from "express";
import { loginAdmin ,createAdmin } from "../controllers/adminauth.js";
import {
  getDashboardStats,
  getUserHistory,
  getRevenueStats,
  getRevenueDetails,
  getAdminNotifications,
} from "../controllers/admin.js";
import {markNotificationsRead,} from "../controllers/notificationController.js";
import adminAuth from "../middleware/adminAuth.js";
import { getAdminProducts } from "../controllers/productController.js";
 
const router = express.Router();
 
/* AUTH */
router.post("/login", loginAdmin);
router.post("/create", createAdmin);
/* DASHBOARD */
router.get("/dashboard",  getDashboardStats);
 
/* USERS */
router.get("/users/:id/history", getUserHistory);
router.get("/notifications", getAdminNotifications);
router.put("/read", markNotificationsRead);
router.get("/products", getAdminProducts);
 
/* REVENUE */
router.get("/revenue", getRevenueStats);
router.get("/revenue/details", getRevenueDetails);
 
export default router;
 
 