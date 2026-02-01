


// import express from "express";

// import {
//   getProducts,
//   getProduct,
//   createProductWithVariants,
//   updateProduct,
//   deleteProduct,
//   uploadImages,
//   getProductDetails,
//   getProductReviews,
//   getSimilarProducts,
//   getSuggestedProducts,
//   getProductsBySubcategory,
//   searchProducts
// } from "../controllers/productController.js";

// import upload from "../middleware/upload.js";

// const router = express.Router();

// /* ================= IMAGE UPLOAD ================= */
// router.post("/upload", upload.array("images", 10), uploadImages);

// /* ================= SUBCATEGORY PRODUCTS ================= */
// /* ✅ ONLY ONE SUBCATEGORY ROUTE — THIS IS IMPORTANT */
// router.get("/subcategory/:subcategoryId", getProductsBySubcategory);

// /* ================= MAIN ROUTES ================= */
// router.get("/", getProducts);
// router.post("/", createProductWithVariants);

// /* ⚠️ Dynamic routes MUST come last */
// router.get("/:id/details", getProductDetails);
// router.get("/:id/reviews", getProductReviews);
// router.get("/:id/similar", getSimilarProducts);
// router.get("/:id/suggested", getSuggestedProducts);
// router.get("/search", searchProducts);


// router.get("/:id", getProduct);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);



// // import {
// //   getTopPicks,
// //   getGroupedProducts,
// // } from "../controllers/productController.js";

// // router.get("/top-picks", getTopPicks);
// // router.get("/grouped", getGroupedProducts);


// export default router;


import express from "express";
import {
  getProducts,
  getProduct,
  createProductWithVariants,
  updateProduct,
  deleteProduct,
  uploadImages,
  getProductDetails,
  getProductReviews,
  getSimilarProducts,
  getSuggestedProducts,
  getProductsBySubcategory,
  searchProducts,
  getTopPicks,
  getGroupedProducts,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= IMAGE UPLOAD ================= */
router.post("/upload", upload.array("images", 10), uploadImages);

/* ================= HOME PAGE ================= */
router.get("/top-picks", getTopPicks);
router.get("/grouped", getGroupedProducts);

/* ================= SUBCATEGORY ================= */
router.get("/subcategory/:subcategoryId", getProductsBySubcategory);

/* ================= MAIN ================= */
router.get("/", getProducts);
router.post("/", createProductWithVariants);

/* ================= EXTRA ================= */
router.get("/search", searchProducts);

/* ⚠️ DYNAMIC ROUTES MUST BE LAST */
router.get("/:id/details", getProductDetails);
router.get("/:id/reviews", getProductReviews);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id/suggested", getSuggestedProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
