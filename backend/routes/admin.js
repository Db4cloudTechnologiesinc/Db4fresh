
import express from "express";
import { loginAdmin } from "../controllers/adminauth.js";
import {
  getDashboardStats,
  getUserHistory,
  getRevenueStats,
  getRevenueDetails,
} from "../controllers/admin.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* AUTH */
router.post("/login", loginAdmin);

/* DASHBOARD */
router.get("/stats", adminAuth, getDashboardStats);

/* USERS */
router.get("/users/:id/history", adminAuth, getUserHistory);

/* REVENUE */
router.get("/revenue", adminAuth, getRevenueStats);
router.get("/revenue/details", adminAuth, getRevenueDetails);

export default router;
