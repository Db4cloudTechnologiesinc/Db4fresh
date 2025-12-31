import express from "express";
import {
  getAllReviews,
  updateReviewStatus
} from "../controllers/adminReviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ADMIN ONLY */
router.get("/reviews", verifyToken, verifyAdmin, getAllReviews);
router.put("/reviews/:id", verifyToken, verifyAdmin, updateReviewStatus);

export default router;
