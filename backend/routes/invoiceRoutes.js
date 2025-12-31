import express from "express";
import { generateInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/:id", generateInvoice);

export default router;
