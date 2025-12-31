import express from "express";
import {
  addAddress,
  getAddresses,
  setDefaultAddress,
  deleteAddress,
  checkPincode,        // ✅ REQUIRED
} from "../controllers/addressController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addAddress);
router.get("/", auth, getAddresses);

// ✅ THIS ROUTE FIXES YOUR 404
router.get("/check/:pincode", auth, checkPincode);

router.put("/default/:id", auth, setDefaultAddress);
router.delete("/:id", auth, deleteAddress);

export default router;
