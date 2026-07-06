 
import express from "express";
import db from "../config/db.js";
import {
  getProducts,
  getProduct,
  getProductVariants,
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
 import {
  getOfferZoneProducts,
  getFreeDeliveryProducts,
  getTodayDealsProducts,
  getSuperStoreProducts,
  getHalfPriceProducts
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";
 
const router = express.Router();
 
/* ================= IMAGE UPLOAD ================= */
router.post("/upload", upload.array("images", 10), uploadImages);
 
/* ================= HOME PAGE ================= */
router.get("/top-picks", getTopPicks);
router.get("/grouped", getGroupedProducts);
router.get("/offer-zone", getOfferZoneProducts);
router.get("/free-delivery", getFreeDeliveryProducts);
router.get("/todays-deal", getTodayDealsProducts);
router.get("/super-store", getSuperStoreProducts);
router.get("/fifty-percent-off", getHalfPriceProducts);
 
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
router.get("/:id/variants", getProductVariants);

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
 
 router.put("/:id/status", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { id } = req.params;
    const { status } = req.body;

    await db.query(
  `
  UPDATE products
  SET
    status = ?,
    active = ?
  WHERE id = ?
  `,
  [
    status,
    status === "ACTIVE" ? 1 : 0,
    id,
  ]
);

    res.json({
      success: true,
      message: "Product status updated",
    });
  } catch (err) {
    console.error("STATUS ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
});
export default router;