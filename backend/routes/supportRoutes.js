import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus
} from "../controllers/supportController.js";

const router = express.Router();

router.post("/", requireAuth, createTicket);
router.get("/", requireAuth, getMyTickets);

// ADMIN
router.get("/admin", getAllTickets);
router.put("/admin/:id", updateTicketStatus);

export default router;
