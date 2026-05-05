 
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
  getProductsByCategory,
  searchProducts,
  getTopPicks,
  getGroupedProducts,
  getCartSuggestions,
  updateProductPrice
} from "../controllers/productController.js";
import { getAdminProducts } from "../controllers/productController.js";
 import { bulkUploadProducts } from "../controllers/productController.js";
 import { bulkUpdatePrice } from "../controllers/productController.js";
 import { getOfferZoneProducts } from "../controllers/productController.js";
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
router.get("/category/:categoryId", getProductsByCategory);
/* ================= CART SUGGESTIONS ================= */
router.get("/cart-suggestions/:id", getCartSuggestions);


/* ================= MAIN PRODUCTS ================= */
router.get("/", getProducts);
router.get("/products", getAdminProducts);

router.post("/", createProductWithVariants);
 router.post(
  "/bulk-upload",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "images", maxCount: 50 }
  ]),
  bulkUploadProducts
);
router.post("/update-price", updateProductPrice);
router.post("/bulk-update-price", bulkUpdatePrice);
/* ================= PRODUCT EXTRA ROUTES ================= */
/* ⚠️ SPECIFIC ROUTES MUST COME BEFORE GENERIC :id */
router.get("/:id/details", getProductDetails);
router.get("/:id/reviews", getProductReviews);
router.get("/:id/similar", getSimilarProducts);
router.get("/:id/suggested", getSuggestedProducts);
router.get("/offer-zone", getOfferZoneProducts);
 
/* ⚠️ GENERIC ROUTES MUST BE LAST */
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
 
export default router;
 
 