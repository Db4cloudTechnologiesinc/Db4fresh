// routes/products.js
import express from "express";
import {
  getProducts,
  getProduct,
  createProductWithVariants,
  updateProduct,
  deleteProduct,
  uploadImages
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";


const router = express.Router();


// Upload multiple images
router.post("/upload", upload.array("images", 10), uploadImages);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProductWithVariants);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);




export default router;
