import express from "express";
import  requireAuth  from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  searchUsers,
  getAllUsers,
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/", requireAuth, getAllUsers);

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.delete("/delete", requireAuth, deleteAccount);

router.get("/search/:query", requireAuth, searchUsers);

export default router;
