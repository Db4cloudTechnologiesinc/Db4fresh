import express from "express";
import  requireAuth  from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  deleteAccount
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.delete("/delete", requireAuth, deleteAccount);

export default router;
