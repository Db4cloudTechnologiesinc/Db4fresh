import express from "express";
import  requireAuth  from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  searchUsers,
  getAllUsers,
  getUserById,
  getUserDetails
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/", requireAuth, getAllUsers);

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.delete("/delete", requireAuth, deleteAccount);

router.get("/search/:query", requireAuth, searchUsers);
router.get("/:id", requireAuth, getUserById);
router.get("/details/:id",requireAuth,getUserDetails);

export default router;
