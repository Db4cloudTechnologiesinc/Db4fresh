import express from "express";
 
import { createAdmin, loginAdmin } from "../controllers/adminauth.js";
import {
  getDashboardStats,
  getUserHistory,
  getRevenueStats,
  getRevenueDetails
} from "../controllers/admin.js";
 
const router = express.Router();
 
/* ================= ADMIN AUTH ================= */
router.post("/create", createAdmin);
router.post("/login", loginAdmin);
 
/* ================= DASHBOARD ================== */
router.get("/stats", getDashboardStats);
 
/* ================= USERS ====================== */
router.get("/users/:id/history", getUserHistory);
 
/* ================= REVENUE (FIXED) ==================== */
// ✅ THIS MUST MATCH FRONTEND
router.get("/revenue", getRevenueStats);
router.get("/revenue/details", getRevenueDetails);
 
export default router;
 
 