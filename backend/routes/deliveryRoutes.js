
// import express from "express";
// import upload from "../middleware/upload.js";
// import deliveryAuthMiddleware from "../middleware/deliveryAuthMiddleware.js"; // ✅ add this

// import {
//   registerDelivery,
//   loginDelivery,
//   getDeliveryHistory,
//   updateDeliveryProfile,
//   getDeliveryProfile,
//   getStoreDetails,        // ✅ ADD THIS
//   updateStoreDetails,      // ✅ ADD THIS
//   createSupportTicket,    // ✅ ADD THIS
//   getSupportTickets,
//   uploadDocument,
//   getDocuments
// } from "../controllers/deliveryController.js";

// const router = express.Router();
// router.get("/store", deliveryAuthMiddleware, getStoreDetails);
// /* ===============================
//    REGISTER DELIVERY PARTNER
// =============================== */
// router.post(
//   "/register",
//   upload.single("license_image"),
//   registerDelivery
// );

// /* ===============================
//    LOGIN DELIVERY PARTNER
// =============================== */
// router.post("/login", loginDelivery);

// /* ===============================
//    DELIVERY HISTORY (Protected)
// =============================== */
// router.get(
//   "/history",
//   deliveryAuthMiddleware,   // 🔐 Only logged-in delivery partner
//   getDeliveryHistory
// );
// router.put(
//   "/update-profile",
//   deliveryAuthMiddleware,
//   upload.single("profile_image"),
//   updateDeliveryProfile
// );

// router.get(
//   "/profile",
//   deliveryAuthMiddleware,
//   getDeliveryProfile
// );

// router.get(
//   "/store",
//   deliveryAuthMiddleware,
//   getStoreDetails
// );

// router.put(
//   "/store",
//   deliveryAuthMiddleware,
//   updateStoreDetails
// );

// router.post(
//   "/support",
//   deliveryAuthMiddleware,
//   upload.single("screenshot"),
//   createSupportTicket
// );

// router.get(
//   "/support",
//   deliveryAuthMiddleware,
//   getSupportTickets
// );
// router.post(
//   "/documents",
//   deliveryAuthMiddleware,
//   upload.single("document"),
//   uploadDocument
// );

// router.get(
//   "/documents",
//   deliveryAuthMiddleware,
//   getDocuments
// );

// export default router;


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

  // 🔥 NEW ADVANCED COD CONTROLLERS
  getAssignedOrders,
  collectCODPayment,
  getWalletSummary,
  getCODTransactions

} from "../controllers/deliveryController.js";

const router = express.Router();

/* ===============================
   REGISTER DELIVERY PARTNER
=============================== */
router.post(
  "/register",
  upload.single("license_image"),
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
  upload.single("profile_image"),
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
  upload.single("screenshot"),
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
  upload.single("document"),
  uploadDocument
);

router.get(
  "/documents",
  deliveryAuthMiddleware,
  getDocuments
);

/* ===================================================
   🔥 ADVANCED COD SYSTEM ROUTES
=================================================== */

/* Get Assigned Orders (COD + Online) */
router.get(
  "/assigned-orders",
  deliveryAuthMiddleware,
  getAssignedOrders
);

/* Collect COD Payment */
router.post(
  "/collect-cod",
  deliveryAuthMiddleware,
  collectCODPayment
);

/* Get Wallet Summary */
router.get(
  "/wallet",
  deliveryAuthMiddleware,
  getWalletSummary
);

/* Get COD Transaction History */
router.get(
  "/cod-transactions",
  deliveryAuthMiddleware,
  getCODTransactions
);

export default router;