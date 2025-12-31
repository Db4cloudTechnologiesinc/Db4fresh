import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
} from "../controllers/ordersController.js";

const router = express.Router();

// ⚠️ ORDER MATTERS
router.post("/", createOrder);
router.get("/", getOrders);
// router.get("/:id", getOrderById); 

router.get("/:id", (req, res) => {
  console.log("🔥 ORDER DETAILS ROUTE HIT", req.params.id);
  res.json({ ok: true });
});
// ✅ MUST EXIST

export default router;
