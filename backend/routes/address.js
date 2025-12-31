import express from "express";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  checkPincode,
} from "../controllers/addressController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("🔥 ADDRESS ROUTES FILE LOADED");

/* ================= PUBLIC ROUTE ================= */
router.get("/check/:pincode", (req, res) => {
  console.log("🔥 PINCODE ROUTE HIT (NO AUTH)");
  checkPincode(req, res);
});

/* ================= PROTECTED ROUTES ================= */
router.use((req, res, next) => {
  console.log("🔐 AUTH MIDDLEWARE HIT");
  requireAuth(req, res, next);
});

router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/:id/default", setDefaultAddress);
router.delete("/:id", deleteAddress);

export default router;
