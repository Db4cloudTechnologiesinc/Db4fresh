import express from "express";
import { cancelOrder } from "../controllers/cancelOrderController.js";

const router = express.Router();

router.put("/:id", cancelOrder);

export default router;
