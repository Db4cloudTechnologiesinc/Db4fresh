
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

/* ================= SEARCH ================= */
router.get("/search", searchProducts);

/* ================= SUBCATEGORY ================= */
router.get("/subcategory/:subcategoryId", getProductsBySubcategory);

/* ================= MAIN PRODUCTS ================= */
router.get("/", getProducts);
router.post("/", createProductWithVariants);

/* ================= PRODUCT EXTRA ROUTES ================= */
/* ⚠️ SPECIFIC ROUTES MUST COME BEFORE GENERIC :id */
router.get("/:id/details", getProductDetails);
router.get("/:id/reviews", getProductReviews);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id/suggested", getSuggestedProducts);

/* ⚠️ GENERIC ROUTES MUST BE LAST */
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
