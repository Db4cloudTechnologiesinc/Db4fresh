// // import express from "express";
// // import upload from "../middleware/upload.js";
// // import deliveryAuthMiddleware from "../middleware/deliveryAuthMiddleware.js";

// // import {
// //   registerDelivery,
// //   loginDelivery,
// //   getDeliveryHistory,
// //   updateDeliveryProfile,
// //   getDeliveryProfile,
// //   getStoreDetails,
// //   updateStoreDetails,
// //   createSupportTicket,
// //   getSupportTickets,
// //   uploadDocument,
// //   getDocuments,
// //   getDeliveryEarnings,

// //   // 🔥 NEW ADVANCED COD CONTROLLERS
// //   getAssignedOrders,
// //   collectCODPayment,
// //   getWalletSummary,
// //   getCODTransactions

// // } from "../controllers/deliveryController.js";

// // const router = express.Router();

// // /* ===============================
// //    REGISTER DELIVERY PARTNER
// // =============================== */
// // router.post(
// //   "/register",
// //   upload.single("license_image"),
// //   registerDelivery
// // );

// // /* ===============================
// //    LOGIN DELIVERY PARTNER
// // =============================== */
// // router.post("/login", loginDelivery);

// // /* ===============================
// //    DELIVERY PROFILE & STORE
// // =============================== */
// // router.get("/profile", deliveryAuthMiddleware, getDeliveryProfile);

// // router.put(
// //   "/update-profile",
// //   deliveryAuthMiddleware,
// //   upload.single("profile_image"),
// //   updateDeliveryProfile
// // );

// // router.get("/store", deliveryAuthMiddleware, getStoreDetails);
// // router.put("/store", deliveryAuthMiddleware, updateStoreDetails);

// // /* ===============================
// //    DELIVERY HISTORY
// // =============================== */
// // router.get(
// //   "/history",
// //   deliveryAuthMiddleware,
// //   getDeliveryHistory
// // );

// // /* ===============================
// //    SUPPORT
// // =============================== */
// // router.post(
// //   "/support",
// //   deliveryAuthMiddleware,
// //   upload.single("screenshot"),
// //   createSupportTicket
// // );

// // router.get(
// //   "/support",
// //   deliveryAuthMiddleware,
// //   getSupportTickets
// // );

// // /* ===============================
// //    DOCUMENTS
// // =============================== */
// // router.post(
// //   "/documents",
// //   deliveryAuthMiddleware,
// //   upload.single("document"),
// //   uploadDocument
// // );

// // router.get(
// //   "/documents",
// //   deliveryAuthMiddleware,
// //   getDocuments
// // );


// // router.get("/earnings", deliveryAuthMiddleware, getDeliveryEarnings);

// // /* ===================================================
// //    🔥 ADVANCED COD SYSTEM ROUTES
// // =================================================== */

// // /* Get Assigned Orders (COD + Online) */
// // router.get(
// //   "/assigned-orders",
// //   deliveryAuthMiddleware,
// //   getAssignedOrders
// // );

// // /* Collect COD Payment */
// // router.post(
// //   "/collect-cod",
// //   deliveryAuthMiddleware,
// //   collectCODPayment
// // );

// // /* Get Wallet Summary */
// // router.get(
// //   "/wallet",
// //   deliveryAuthMiddleware,
// //   getWalletSummary
// // );

// // /* Get COD Transaction History */
// // router.get(
// //   "/cod-transactions",
// //   deliveryAuthMiddleware,
// //   getCODTransactions
// // );

// // export default router;

// import express from "express";
// import upload from "../middleware/upload.js";
// import deliveryAuthMiddleware from "../middleware/deliveryAuthMiddleware.js";

// import {
//   registerDelivery,
//   loginDelivery,
//   getDeliveryHistory,
//   updateDeliveryProfile,
//   getDeliveryProfile,
//   getStoreDetails,
//   updateStoreDetails,
//   createSupportTicket,
//   getSupportTickets,
//   uploadDocument,
//   getDocuments,
//   getDeliveryEarnings,
//   getAssignedOrders,
//   collectCODPayment,
//   getWalletSummary,
//   getCODTransactions
// } from "../controllers/deliveryController.js";

// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const router = express.Router();

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
//    DELIVERY PROFILE & STORE
// =============================== */
// router.get("/profile", deliveryAuthMiddleware, getDeliveryProfile);

// router.put(
//   "/update-profile",
//   deliveryAuthMiddleware,
//   upload.single("profile_image"),
//   updateDeliveryProfile
// );

// router.get("/store", deliveryAuthMiddleware, getStoreDetails);
// router.put("/store", deliveryAuthMiddleware, updateStoreDetails);

// /* ===============================
//    DELIVERY HISTORY
// =============================== */
// router.get(
//   "/history",
//   deliveryAuthMiddleware,
//   getDeliveryHistory
// );

// /* ===============================
//    SUPPORT
// =============================== */
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

// /* ===============================
//    DOCUMENTS
// =============================== */
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

// /* ===============================
//    VIEW DOCUMENT FILE (PROTECTED)
// =============================== */
// // router.get(
// //   "/document/:filename",
// //   deliveryAuthMiddleware,
// //   (req, res) => {
// //     const fileName = req.params.filename;

// //     const filePath = path.join(
// //       __dirname,
// //       "../uploads/delivery",
// //       fileName
// //     );

// //     if (!fs.existsSync(filePath)) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "File not found"
// //       });
// //     }

// //     res.sendFile(filePath);
// //   }
// // );

// router.get(
//   "/document/:filename",
//   deliveryAuthMiddleware,
//   (req, res) => {
//     const fileName = req.params.filename;

//     const filePath = path.resolve(
//       process.cwd(),
//       "uploads",
//       "delivery",
//       fileName
//     );

//     console.log("Resolved File Path:", filePath);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({
//         success: false,
//         message: "File not found"
//       });
//     }

//     res.sendFile(filePath);
//   }
// );
// /* ===============================
//    EARNINGS
// =============================== */
// router.get(
//   "/earnings",
//   deliveryAuthMiddleware,
//   getDeliveryEarnings
// );

// /* ===================================================
//    🔥 ADVANCED COD SYSTEM ROUTES
// =================================================== */

// /* Get Assigned Orders */
// router.get(
//   "/assigned-orders",
//   deliveryAuthMiddleware,
//   getAssignedOrders
// );

// /* Collect COD Payment */
// router.post(
//   "/collect-cod",
//   deliveryAuthMiddleware,
//   collectCODPayment
// );

// /* Get Wallet Summary */
// router.get(
//   "/wallet",
//   deliveryAuthMiddleware,
//   getWalletSummary
// );

// /* Get COD Transaction History */
// router.get(
//   "/cod-transactions",
//   deliveryAuthMiddleware,
//   getCODTransactions
// );

// export default router;
import express from "express";
import { uploadMemory } from "../middleware/upload.js";
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
  getDocumentById   // 🔥 NEW
} from "../controllers/deliveryController.js";

const router = express.Router();

/* ===============================
   REGISTER DELIVERY PARTNER
=============================== */
router.post(
  "/register",
  uploadMemory.single("license_image"),
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
  uploadMemory.single("profile_image"),
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
  uploadMemory.single("screenshot"),
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
  uploadMemory.single("document"),
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