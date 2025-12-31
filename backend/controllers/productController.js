
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

  // parse images
  try {
    images =
      typeof d.images === "string" ? JSON.parse(d.images) : d.images || [];
  } catch {
    images = [];
  }

  // parse variants
  try {
    variants =
      typeof d.variants === "string"
        ? JSON.parse(d.variants)
        : d.variants || [];
  } catch {
    variants = [];
  }

  console.log("ADMIN VARIANTS RAW 👉", variants);

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

      // ✅ validate variants
      const validVariants = variants.filter(
        (v) => v.variant_label && v.price
      );

      if (!validVariants.length) {
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

      const values = validVariants.map((v) => [
        productId,
        v.variant_label,     // ✅ FIXED
        v.price,
        v.mrp ?? null,
        v.stock ?? 0,
        v.sku ?? null,
      ]);

      console.log("FINAL VARIANT VALUES 👉", values);

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
   3️⃣ GET ALL PRODUCTS + VARIANTS (HOME PAGE)
============================================================ */
export const getProducts = (req, res, next) => {
  const sql = `
    SELECT 
      p.*,
      IF(
        COUNT(v.id) = 0,
        JSON_ARRAY(),
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', v.id,
            'variant_label', v.variant_label,
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
    GROUP BY p.id
    ORDER BY p.id DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return next(err);

    const products = rows.map((p) => {
      try {
        p.images = p.images ? JSON.parse(p.images) : [];
      } catch {
        p.images = [];
      }

      try {
        if (typeof p.variants === "string") {
          p.variants = JSON.parse(p.variants);
        }
      } catch {
        p.variants = [];
      }

      p.image =
        p.images.length > 0
          ? typeof p.images[0] === "string"
            ? p.images[0]
            : p.images[0].url
          : null;

      return p;
    });

    res.json(products);
  });
};

/* ============================================================
   4️⃣ GET SINGLE PRODUCT + VARIANTS
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
            'variant_label', v.variant_label,
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

    try {
      product.images = product.images ? JSON.parse(product.images) : [];
    } catch {
      product.images = [];
    }

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
/* ================= PRODUCT DETAILS ================= */
export const getProductDetails = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.*,
      s.name AS seller_name,
      s.location AS seller_location,
      IFNULL(AVG(r.rating), 4.2) AS avgRating,
      COUNT(r.id) AS totalReviews
    FROM products p
    LEFT JOIN sellers s ON p.seller_id = s.id
    LEFT JOIN product_reviews r ON p.id = r.product_id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json([]);
    res.json(rows[0] || {});
  });
};

/* ================= GET REVIEWS (ARRAY ONLY) ================= */
export const getProductReviews = (req, res) => {
  const sql = `
    SELECT rating, comment, created_at
    FROM product_reviews
    WHERE product_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.json([]);
    res.json(rows || []);
  });
};

/* ================= ADD REVIEW (ONLY PURCHASED USER) ================= */
export const addProductReview = (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating" });
  }

  /* ✅ CHECK IF USER PURCHASED PRODUCT */
  const purchaseCheckSql = `
    SELECT id FROM order_items
    WHERE user_id = ? AND product_id = ?
    LIMIT 1
  `;

  db.query(purchaseCheckSql, [userId, productId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error" });

    if (result.length === 0) {
      return res.status(403).json({
        message: "You can review only purchased products"
      });
    }

    /* ✅ INSERT REVIEW */
    const insertSql = `
      INSERT INTO product_reviews (product_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [productId, userId, rating, comment],
      (err) => {
        if (err) return res.status(500).json({ message: "Failed" });

        res.json({ message: "Review added successfully" });
      }
    );
  });
};

export const getSimilarProducts = (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT * FROM products
    WHERE category = (SELECT category FROM products WHERE id = ?)
    AND id != ?
    LIMIT 10
  `;

  db.query(sql, [productId, productId], (err, rows) => {
    if (err) {
      console.error("SIMILAR ERROR:", err);
      return res.status(200).json([]);
    }

    const products = rows.map((p) => {
      // ✅ PARSE IMAGES STRING
      try {
        p.images = p.images ? JSON.parse(p.images) : [];
      } catch {
        p.images = [];
      }

      // ✅ ADD SINGLE IMAGE FIELD (for frontend safety)
      p.image =
        p.images.length > 0
          ? typeof p.images[0] === "string"
            ? p.images[0]
            : p.images[0].url
          : null;

      return p;
    });

    res.status(200).json(products);
  });
};
export const getSuggestedProducts = (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT * FROM products
    WHERE id != ?
    ORDER BY RAND()
    LIMIT 6
  `;

  db.query(sql, [productId], (err, rows) => {
    if (err) {
      console.error("SUGGESTED ERROR:", err);
      return res.status(200).json([]);
    }

    const products = rows.map((p) => {
      // ✅ PARSE IMAGES STRING
      try {
        p.images = p.images ? JSON.parse(p.images) : [];
      } catch {
        p.images = [];
      }

      // ✅ ADD SINGLE IMAGE FIELD
      p.image =
        p.images.length > 0
          ? typeof p.images[0] === "string"
            ? p.images[0]
            : p.images[0].url
          : null;

      return p;
    });

    res.status(200).json(products);
  });
};
export const normalizeProduct = (p) => {
  try {
    p.images = p.images ? JSON.parse(p.images) : [];
  } catch {
    p.images = [];
  }

  p.image =
    p.images.length > 0
      ? typeof p.images[0] === "string"
        ? p.images[0]
        : p.images[0].url
      : null;

  return p;
};