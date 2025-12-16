import express from "express";
import authPlaceholder from "../middleware/authPlaceholder.js";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  checkPincodeAvailability
} from "../controllers/addressController.js";

const router = express.Router();

// ⭐ PUBLIC — Pincode Availability Check
// MUST COME BEFORE auth middleware
router.get("/check/:pincode", checkPincodeAvailability);

// ⭐ PROTECTED ROUTES (require user id)
router.use(authPlaceholder);

router.get("/", getAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);
router.put("/:id/default", setDefaultAddress);

export default router;
