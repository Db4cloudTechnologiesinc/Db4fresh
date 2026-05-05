import express from "express";
import upload from "../middleware/upload.js";
import deliveryAuthMiddleware from "../middleware/deliveryAuthMiddleware.js";

import {
  registerDelivery,
  loginDelivery,
  getDeliveryHistory,
  updateDeliveryProfile,
  getDeliveryProfile,
  getStoreDetails,
  updateStoreDetails,
  createSupportTicket,
  getSupportTickets,
  uploadDocument,
  getDocuments,
  getDeliveryEarnings,
  getAssignedOrders,
  collectCODPayment,
  getWalletSummary,
  getCODTransactions,
  getDocumentById
} from "../controllers/deliveryController.js";

const router = express.Router();

/* ===============================
   REGISTER DELIVERY PARTNER
=============================== */
router.post(
  "/register",
  upload.single("license_image"), // ✅ changed
  registerDelivery
);

/* ===============================
   LOGIN DELIVERY PARTNER
=============================== */
router.post("/login", loginDelivery);

/* ===============================
   DELIVERY PROFILE & STORE
=============================== */
router.get("/profile", deliveryAuthMiddleware, getDeliveryProfile);

router.put(
  "/update-profile",
  deliveryAuthMiddleware,
  upload.single("profile_image"), // ✅ changed
  updateDeliveryProfile
);

router.get("/store", deliveryAuthMiddleware, getStoreDetails);
router.put("/store", deliveryAuthMiddleware, updateStoreDetails);

/* ===============================
   DELIVERY HISTORY
=============================== */
router.get(
  "/history",
  deliveryAuthMiddleware,
  getDeliveryHistory
);

/* ===============================
   SUPPORT
=============================== */
router.post(
  "/support",
  deliveryAuthMiddleware,
  upload.single("screenshot"), // ✅ changed
  createSupportTicket
);

router.get(
  "/support",
  deliveryAuthMiddleware,
  getSupportTickets
);

/* ===============================
   DOCUMENTS
=============================== */
router.post(
  "/documents",
  deliveryAuthMiddleware,
  upload.single("document"), // ✅ changed
  uploadDocument
);

router.get(
  "/documents",
  deliveryAuthMiddleware,
  getDocuments
);

/* ===============================
   VIEW DOCUMENT FROM DATABASE
=============================== */
router.get(
  "/document/:id",
  deliveryAuthMiddleware,
  getDocumentById
);

/* ===============================
   EARNINGS
=============================== */
router.get(
  "/earnings",
  deliveryAuthMiddleware,
  getDeliveryEarnings
);

/* ===================================================
   🔥 ADVANCED COD SYSTEM ROUTES
=================================================== */

router.get(
  "/assigned-orders",
  deliveryAuthMiddleware,
  getAssignedOrders
);

router.post(
  "/collect-cod",
  deliveryAuthMiddleware,
  collectCODPayment
);

router.get(
  "/wallet",
  deliveryAuthMiddleware,
  getWalletSummary
);

router.get(
  "/cod-transactions",
  deliveryAuthMiddleware,
  getCODTransactions
);

export default router;