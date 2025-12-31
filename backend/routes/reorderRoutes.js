import express from "express";
import { reorderItems } from "../controllers/reorderController.js";
import requireAuth from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/:id", requireAuth, reorderItems);
export default router;
