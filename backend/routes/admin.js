 
import express from "express";
import { loginAdmin } from "../controllers/adminauth.js";
import {
  getDashboardStats,
  getUserHistory,
  getRevenueStats,
  getRevenueDetails,
} from "../controllers/admin.js";
import adminAuth from "../middleware/adminAuth.js";
import { getAdminProducts } from "../controllers/productController.js";
 
const router = express.Router();
 
/* AUTH */
router.post("/login", loginAdmin);
 
/* DASHBOARD */
router.get("/dashboard",  getDashboardStats);
 
/* USERS */
router.get("/users/:id/history", getUserHistory);
router.get("/products", getAdminProducts);
 
/* REVENUE */
router.get("/revenue", getRevenueStats);
router.get("/revenue/details", getRevenueDetails);
 
export default router;
 
 