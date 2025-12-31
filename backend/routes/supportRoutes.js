import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createTicket,
  getMyTickets
} from "../controllers/supportController.js";

const router = express.Router();

router.post("/", requireAuth, createTicket);
router.get("/", requireAuth, getMyTickets);

export default router;
