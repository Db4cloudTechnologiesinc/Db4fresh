import db from "../config/db.js";
 
/* ================= IMAGE UPLOAD ================= */
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: "No images uploaded" });
    }
 
    const images = req.files.map((file) => ({
      url: `/uploads/products/${file.filename}`,
    }));
 
    res.json({ images });
  } catch (err) {
    console.error("UPLOAD IMAGES ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
 
/* ================= CREATE PRODUCT ================= */
export const createProductWithVariants = async (req, res) => {
  try {
    const {
      name,
      category_id,
      subcategory_id,
      description,
      manufacture_date,
      expiry_date,
      images = [],
      variants = [],
    } = req.body;
 
    const [result] = await db.query(
      `
      INSERT INTO products
      (name, category_id, subcategory_id, description, manufacture_date, expiry_date, images, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        name,
        category_id,
        subcategory_id || null,
        description || null,
        manufacture_date || null,
        expiry_date || null,
        JSON.stringify(images),
      ]
    );
 
    const productId = result.insertId;
 
    for (const v of variants) {
      if (!v.variant_label) continue;
 
      await db.query(
        `
        INSERT INTO product_variants
        (product_id, variant_label, price, mrp, stock)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          productId,
          v.variant_label,
          Number(v.price) || 0,
          v.mrp || null,
          Number(v.stock) || 0,
        ]
      );
    }
 
    res.json({ success: true, productId });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
 
/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
  p.*,

(
  SELECT v.variant_label
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_label,

(
  SELECT v.price
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS price,

(
  SELECT v.mrp
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS mrp,

(
  SELECT SUM(v.stock)
  FROM product_variants v
  WHERE v.product_id = p.id
) AS stock

FROM products p
WHERE p.active = 1
ORDER BY p.id DESC
    `);

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
/* ================= PRODUCTS BY SUBCATEGORY ================= */
export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
 
    const [rows] = await db.query(
      `
      SELECT
        p.*,
        COALESCE(MIN(v.price), 0) AS price,
        COALESCE(SUM(v.stock), 0) AS stock
      FROM products p
      LEFT JOIN product_variants v ON v.product_id = p.id
      WHERE p.subcategory_id = ?
        AND p.active = 1
      GROUP BY p.id
      `,
      [subcategoryId]
    );
 
    res.json(normalizeProducts(rows));
  } catch (err) {
    console.error("SUBCATEGORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
/* ================= SINGLE PRODUCT ================= */
export const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const [rows] = await db.query(
      `
      SELECT
        p.*,
        (
          SELECT v.variant_label
          FROM product_variants v
          WHERE v.product_id = p.id
          LIMIT 1
        ) AS variant_label,
        (
          SELECT v.price
          FROM product_variants v
          WHERE v.product_id = p.id
          LIMIT 1
        ) AS price,
        (
          SELECT v.mrp
          FROM product_variants v
          WHERE v.product_id = p.id
          LIMIT 1
        ) AS mrp
      FROM products p
      WHERE p.id = ?
      `,
      [productId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = normalizeProducts(rows)[0];

    /* GET ALL VARIANTS */
    const [variants] = await db.query(
      `
      SELECT
        id,
        variant_label,
        price,
        mrp,
        stock
      FROM product_variants
      WHERE product_id = ?
      `,
      [productId]
    );

    product.variants = variants;

    res.json(product);

  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
 
    const {
      name,
      category_id,
      subcategory_id,
      description,
      manufacture_date,
      expiry_date,
      images = [],
      variants = [],
      removedVariantIds = [],
    } = req.body;
 
    await db.query(
      `
      UPDATE products SET
        name = ?,
        category_id = ?,
        subcategory_id = ?,
        description = ?,
        manufacture_date = ?,
        expiry_date = ?,
        images = ?
      WHERE id = ?
      `,
      [
        name,
        category_id,
        subcategory_id || null,
        description || null,
        manufacture_date || null,
        expiry_date || null,
        JSON.stringify(images),
        id,
      ]
    );
 
    if (removedVariantIds.length) {
      await db.query(
        "DELETE FROM product_variants WHERE id IN (?)",
        [removedVariantIds]
      );
    }
 
    for (const v of variants) {
      if (!v.variant_label) continue;
 
      if (v.id) {
        await db.query(
          `
          UPDATE product_variants
          SET variant_label=?, price=?, mrp=?, stock=?
          WHERE id=?
          `,
          [v.variant_label, v.price, v.mrp, v.stock, v.id]
        );
      } else {
        await db.query(
          `
          INSERT INTO product_variants
          (product_id, variant_label, price, mrp, stock)
          VALUES (?, ?, ?, ?, ?)
          `,
          [id, v.variant_label, v.price, v.mrp, v.stock]
        );
      }
    }
 
    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
 
/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  await db.query(
    "DELETE FROM product_variants WHERE product_id = ?",
    [req.params.id]
  );
  await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.json({ message: "Product deleted" });
};
 
/* ================= EXTRA ================= */
export const getProductDetails = getProduct;
 
export const getProductReviews = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM product_reviews WHERE product_id = ?",
    [req.params.id]
  );
  res.json(rows);
};
/* ================= SIMILAR PRODUCTS ================= */
  export const getSimilarProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    const [rows] = await db.query(
      `
      SELECT
        p.*,

        (
          SELECT v.variant_label
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS variant_label,

        (
          SELECT v.price
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS price,

        (
          SELECT v.mrp
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS mrp,

        (
          SELECT SUM(v.stock)
          FROM product_variants v
          WHERE v.product_id = p.id
        ) AS stock

      FROM products p
      WHERE p.active = 1
      AND p.id != ?
      ORDER BY RAND()
      LIMIT 10
      `,
      [productId]
    );

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.error("SIMILAR PRODUCTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
 
 
export const getSuggestedProducts = getSimilarProducts;
 
/* ================= SEARCH ================= */
export const searchProducts = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
 
  const [rows] = await db.query(
    `SELECT id, name FROM products WHERE active = 1 AND name LIKE ? LIMIT 10`,
    [`%${q}%`]
  );
 
  res.json(rows);
};
/* ================= TOP PICKS (HOME) ================= */
export const getTopPicks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.*,

        (
          SELECT v.variant_label
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS variant_label,

        (
          SELECT v.price
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS price,

        (
          SELECT v.mrp
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS mrp,

        (
          SELECT SUM(v.stock)
          FROM product_variants v
          WHERE v.product_id = p.id
        ) AS stock

      FROM products p
      WHERE p.active = 1
      ORDER BY p.id DESC
      LIMIT 10
    `);

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.error("TOP PICKS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}; 
 
 
/* ================= GROUPED PRODUCTS (HOME) ================= */
export const getGroupedProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.*,
        c.name AS category_name,
        COALESCE(MIN(v.price), 0) AS price,
        COALESCE(SUM(v.stock), 0) AS stock
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_variants v ON v.product_id = p.id
      WHERE p.active = 1
      GROUP BY p.id, c.name
      ORDER BY p.id DESC
    `);
 
    const grouped = {};
 
    normalizeProducts(rows).forEach((p) => {
      const cat = p.category_name;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });
 
    res.json(grouped);
  } catch (err) {
    console.error("GROUPED ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
/* ================= HELPER ================= */
const normalizeProducts = (rows) => {
  return rows.map((p) => {
    let images = [];
    try {
      images = p.images ? JSON.parse(p.images) : [];
    } catch {}
 
    const normalizedImages = images.map((img) => ({
      url: img.url?.startsWith("http")
        ? img.url
        : `http://localhost:4000${img.url}`,
    }));
 
    return {
      ...p,
      images: normalizedImages,
      image: normalizedImages[0]?.url || null,
      price: Number(p.price)||null ,
      mrp: Number(p.mrp) || null, 
      stock: Number(p.stock) || null,
    };
  });
};
export const getCartSuggestions = async (req, res) => {
  try {
    const productId = req.params.id;

    const [product] = await db.query(
      "SELECT category_id FROM products WHERE id = ?",
      [productId]
    );

    if (!product.length) {
      return res.json([]);
    }

    const categoryId = product[0].category_id;

    const [rows] = await db.query(
      `
      SELECT
        p.*,

        (
          SELECT v.variant_label
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS variant_label,

        (
          SELECT v.price
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS price,

        (
          SELECT v.mrp
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS mrp,

        (
          SELECT SUM(v.stock)
          FROM product_variants v
          WHERE v.product_id = p.id
        ) AS stock

      FROM products p
      WHERE p.category_id = ?
      AND p.id != ?
      AND p.active = 1
      LIMIT 10
      `,
      [categoryId, productId]
    );

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.error("CART SUGGESTIONS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
 
 