import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getPreferences,
  updatePreferences,
  getNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/preferences", requireAuth, getPreferences);
router.put("/preferences", requireAuth, updatePreferences);
router.get("/", requireAuth, getNotifications);

export default router;
