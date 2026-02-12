
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

/**
 * CART COUNT (HEADER ICON)
 */
router.get("/count", requireAuth, getCartCount);

/**
 * GET FULL CART (USED ON PAGE LOAD / REFRESH)
 */
router.get("/", requireAuth, getCart);

/**
 * ADD TO CART
 */
router.post("/add", requireAuth, addToCart);

/**
 * UPDATE QTY
 */
router.put("/:cartId", requireAuth, updateCartQty);

/**
 * REMOVE ITEM
 */
router.delete("/:cartId", requireAuth, removeFromCart);

export default router;
