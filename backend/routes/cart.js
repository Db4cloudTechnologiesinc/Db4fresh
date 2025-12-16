import express from "express";
import {
  addToCart,
  getCart,
  updateCartQty,
  removeFromCart,
  getCartCount
} from "../controllers/cartController.js";

import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", requireAuth, addToCart);
router.get("/", requireAuth, getCart);
router.put("/:cartId", requireAuth, updateCartQty);
router.delete("/:cartId", requireAuth, removeFromCart);
router.get("/count", requireAuth, getCartCount);

export default router;
