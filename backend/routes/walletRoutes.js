import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getWallet } from "../controllers/walletController.js";

const router = express.Router();

router.get("/", requireAuth, getWallet);

export default router;
