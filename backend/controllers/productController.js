// controllers/productController.js
import db from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* ============================================================
   1️⃣ UPLOAD MULTIPLE IMAGES → CLOUDINARY
============================================================ */
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedUrls = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
              if (err) reject(err);
              else
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
            }
          );

          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      })
    );

    res.json({
      success: true,
      images: uploadedUrls,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ============================================================
   2️⃣ CREATE PRODUCT + VARIANTS  ✅ FIXED
============================================================ */
export const createProductWithVariants = (req, res, next) => {
  const d = req.body;

  let images = [];
  let variants = [];

  // ✅ parse images safely
  try {
    if (typeof d.images === "string") images = JSON.parse(d.images);
    else if (Array.isArray(d.images)) images = d.images;
  } catch {
    images = [];
  }

  // ✅ parse variants safely (THIS FIXES YOUR ISSUE)
  try {
    if (typeof d.variants === "string") variants = JSON.parse(d.variants);
    else if (Array.isArray(d.variants)) variants = d.variants;
  } catch {
    variants = [];
  }

  console.log("ADMIN VARIANTS 👉", variants); // 🔍 DEBUG

  const productSql = `
    INSERT INTO products (name, category, description, images, active)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    productSql,
    [
      d.name,
      d.category || null,
      d.description || null,
      JSON.stringify(images),
      d.active ?? 1,
    ],
    (err, result) => {
      if (err) return next(err);

      const productId = result.insertId;

      // ✅ no variants → done
      if (!variants.length) {
        return res.json({
          message: "Product created (no variants)",
          productId,
        });
      }

      const variantSql = `
        INSERT INTO product_variants
        (product_id, variant_label, price, mrp, stock, sku)
        VALUES ?
      `;

      const values = variants.map((v) => [
        productId,
        v.label,
        v.price,
        v.mrp || null,
        v.stock || 0,
        v.sku || null,
      ]);

      db.query(variantSql, [values], (verr) => {
        if (verr) return next(verr);

        res.json({
          message: "Product + variants added",
          productId,
        });
      });
    }
  );
};

/* ============================================================
   3️⃣ GET ALL PRODUCTS (HOME PAGE)
============================================================ */
export const getProducts = (req, res, next) => {
  db.query("SELECT * FROM products ORDER BY id DESC", (err, rows) => {
    if (err) return next(err);

    const products = rows.map((p) => {
      let images = [];

      try {
        images = p.images ? JSON.parse(p.images) : [];
      } catch {
        images = [];
      }

      const image =
        images.length > 0
          ? typeof images[0] === "string"
            ? images[0]
            : images[0].url
          : null;

      return {
        ...p,
        images,
        image, // thumbnail
      };
    });

    res.json(products);
  });
};

/* ============================================================
   4️⃣ GET SINGLE PRODUCT + VARIANTS  ✅ FIXED
============================================================ */
export const getProduct = (req, res, next) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      p.*,
      IF(
        COUNT(v.id) = 0,
        JSON_ARRAY(),
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', v.id,
            'label', v.variant_label,
            'price', v.price,
            'mrp', v.mrp,
            'stock', v.stock,
            'sku', v.sku
          )
        )
      ) AS variants
    FROM products p
    LEFT JOIN product_variants v
      ON p.id = v.product_id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return next(err);

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];

    // parse images
    try {
      product.images = product.images ? JSON.parse(product.images) : [];
    } catch {
      product.images = [];
    }

    // parse variants (MySQL may return string)
    try {
      if (typeof product.variants === "string") {
        product.variants = JSON.parse(product.variants);
      }
    } catch {
      product.variants = [];
    }

    res.json(product);
  });
};

/* ============================================================
   5️⃣ UPDATE PRODUCT
============================================================ */
export const updateProduct = (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  if (data.images) {
    data.images = JSON.stringify(data.images);
  }

  db.query("UPDATE products SET ? WHERE id = ?", [data, id], (err) => {
    if (err) return next(err);
    res.json({ message: "Product updated" });
  });
};

/* ============================================================
   6️⃣ DELETE PRODUCT
============================================================ */
export const deleteProduct = (req, res, next) => {
  const id = req.params.id;

  db.query("DELETE FROM product_variants WHERE product_id = ?", [id], () => {
    db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
      if (err) return next(err);
      res.json({ message: "Product deleted" });
    });
  });
};
