import db from "../config/db.js";
 import XLSX from "xlsx";

/* ================= COMMON PRICE QUERY ================= */
// const PRICE_QUERY = `
// (
//   SELECT COALESCE(
//     (
//       SELECT pp.selling_price
//       FROM product_prices pp
//       JOIN product_variants v ON v.id = pp.variant_id
//       WHERE v.product_id = p.id
//       ORDER BY pp.created_at DESC
//       LIMIT 1
//     ),
//     (
//       SELECT v.price
//       FROM product_variants v
//       WHERE v.product_id = p.id
//       ORDER BY v.price ASC
//       LIMIT 1
//     )
//   )
// ) AS price,

// (
//   SELECT COALESCE(
//     (
//       SELECT pp.mrp
//       FROM product_prices pp
//       JOIN product_variants v ON v.id = pp.variant_id
//       WHERE v.product_id = p.id
//       ORDER BY pp.created_at DESC
//       LIMIT 1
//     ),
//     (
//       SELECT v.mrp
//       FROM product_variants v
//       WHERE v.product_id = p.id
//       ORDER BY v.price ASC
//       LIMIT 1
//     )
//   )
// ) AS mrp,
// `;
const PRICE_QUERY = `
(
  SELECT COALESCE(
    (
      SELECT pp.selling_price
      FROM product_prices pp
      WHERE pp.variant_id = (
        SELECT v.id FROM product_variants v
        WHERE v.product_id = p.id
        ORDER BY v.price ASC LIMIT 1
      )
      ORDER BY pp.created_at DESC
      LIMIT 1
    ),
    (
      SELECT v.price
      FROM product_variants v
      WHERE v.product_id = p.id
      ORDER BY v.price ASC
      LIMIT 1
    )
  )
) AS price,

(
  SELECT COALESCE(
    (
      SELECT pp.mrp
      FROM product_prices pp
      WHERE pp.variant_id = (
        SELECT v.id FROM product_variants v
        WHERE v.product_id = p.id
        ORDER BY v.price ASC LIMIT 1
      )
      ORDER BY pp.created_at DESC
      LIMIT 1
    ),
    (
      SELECT v.mrp
      FROM product_variants v
      WHERE v.product_id = p.id
      ORDER BY v.price ASC
      LIMIT 1
    )
  )
) AS mrp,
`;/* ================= IMAGE UPLOAD ================= */
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
       brand,
      is_free_delivery,
      is_today_deal,
      images = [],
      variants = [],
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO products
      (name, category_id, subcategory_id, description, manufacture_date, expiry_date, brand, is_free_delivery, is_today_deal, images, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name,
        category_id,
        subcategory_id || null,
        description || null,
        manufacture_date || null,
        expiry_date || null,
        brand || null,
        is_free_delivery || 0,
        is_today_deal || 0,
        JSON.stringify(images),
      ]
    );

    const productId = result.insertId;

    for (const v of variants) {
  if (!v.variant_label) continue;

  await db.query(
    `INSERT INTO product_variants
    (product_id, variant_label, price, mrp, stock)
    VALUES (?, ?, ?, ?, ?)`,
    [
      productId,
      v.variant_label,
      v.price ? Number(v.price) : null,
      v.mrp ? Number(v.mrp) : null,
      v.stock ? Number(v.stock) : 0,
    ]
  );
}
    res.json({ success: true, productId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
/* ================= GET PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // const [rows] = await db.query(
    //   `
    //   SELECT p.*,
    //   (
    //     SELECT v.variant_label FROM product_variants v
    //     WHERE v.product_id = p.id
    //     ORDER BY v.price ASC LIMIT 1
    //   ) AS variant_label,

    //   ${PRICE_QUERY}

    //   (
    //     SELECT SUM(v.stock) FROM product_variants v
    //     WHERE v.product_id = p.id
    //   ) AS stock

    //   FROM products p
    //   WHERE p.active = 1
    //   ORDER BY p.id DESC
    //   LIMIT ? OFFSET ?
    //   `,
    //   [limit, offset]
    // );
    const [rows] = await db.query(
  `
  SELECT 
    p.*,

    c.name AS category_name,
    s.name AS subcategory_name,

    (
      SELECT v.variant_label 
      FROM product_variants v
      WHERE v.product_id = p.id
      ORDER BY v.price ASC 
      LIMIT 1
    ) AS variant_label,

    ${PRICE_QUERY}

    (
      SELECT SUM(v.stock) 
      FROM product_variants v
      WHERE v.product_id = p.id
    ) AS stock

  FROM products p

  LEFT JOIN categories c
  ON p.category_id = c.id

  LEFT JOIN subcategories s
  ON p.subcategory_id = s.id

  WHERE p.active = 1

  ORDER BY p.id DESC

  LIMIT ? OFFSET ?
  `,
  [limit, offset]
);

    res.json(normalizeProducts(rows));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

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
          SELECT COALESCE(
            (
              SELECT pp.selling_price
              FROM product_prices pp
              JOIN product_variants v ON v.id = pp.variant_id
              WHERE v.product_id = p.id
              ORDER BY pp.created_at DESC
              LIMIT 1
            ),
            (
              SELECT v.price
              FROM product_variants v
              WHERE v.product_id = p.id
              ORDER BY v.price ASC
              LIMIT 1
            )
          )
        ) AS price,

        (
          SELECT COALESCE(
            (
              SELECT pp.mrp
              FROM product_prices pp
              JOIN product_variants v ON v.id = pp.variant_id
              WHERE v.product_id = p.id
              ORDER BY pp.created_at DESC
              LIMIT 1
            ),
            (
              SELECT v.mrp
              FROM product_variants v
              WHERE v.product_id = p.id
              ORDER BY v.price ASC
              LIMIT 1
            )
          )
        ) AS mrp,

        (
          SELECT SUM(v.stock)
          FROM product_variants v
          WHERE v.product_id = p.id
        ) AS stock

      FROM products p
      WHERE p.category_id = ?
      AND p.active = 1
      ORDER BY p.id DESC
      `,
      [categoryId]
    );

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.error("CATEGORY PRODUCTS ERROR:", err);
    res.status(500).json({ message: err.message });
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
export const getAdminProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT p.*,

      (
        SELECT v.variant_label
        FROM product_variants v
        WHERE v.product_id = p.id
        ORDER BY v.price ASC
        LIMIT 1
      ) AS variant_label,

      ${PRICE_QUERY}

      (
        SELECT SUM(v.stock)
        FROM product_variants v
        WHERE v.product_id = p.id
      ) AS stock

      FROM products p
      ORDER BY p.id DESC
      `
    );

    res.json(normalizeProducts(rows)); // no pagination needed for admin

  } catch (err) {
    res.status(500).json({ message: err.message });
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
      is_free_delivery,
      is_today_deal,
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
        is_free_delivery = ?,
        is_today_deal = ?,
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
        is_free_delivery || 0,
        is_today_deal || 0,
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
          SET variant_label=?, price=?, mrp=?, stock=?, is_free_delivery=?, is_today_deal=?
          WHERE id=?
          `,
          [v.variant_label, v.price, v.mrp, v.stock, v.is_free_delivery || 0, v.is_today_deal || 0, v.id]
        );
      } else {
        await db.query(
          `
          INSERT INTO product_variants
          (product_id, variant_label, price, mrp, stock, is_free_delivery, is_today_deal)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [id, v.variant_label, v.price, v.mrp, v.stock, v.is_free_delivery || 0, v.is_today_deal || 0]
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
      SELECT p.*,

      (
        SELECT v.variant_label FROM product_variants v
        WHERE v.product_id = p.id
        ORDER BY v.price ASC LIMIT 1
      ) AS variant_label,

      ${PRICE_QUERY}

      (
        SELECT SUM(v.stock) FROM product_variants v
        WHERE v.product_id = p.id
      ) AS stock

      FROM products p
      WHERE p.active = 1 AND p.id != ?
      ORDER BY RAND()
      LIMIT 10
      `,
      [productId]
    );

    res.json(normalizeProducts(rows));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
export const getSuggestedProducts = getSimilarProducts;
 
/* ================= SEARCH ================= */

// export const searchProducts = async (req, res) => {

//   try {

//     const q =
//       req.query.q?.trim().toLowerCase() || "";

//     const [rows] = await db.query(
    
//       `SELECT 
//         p.*,

//         c.name AS category_name,
//         s.name AS subcategory_name

//       FROM products p

//       LEFT JOIN categories c
//       ON p.category_id = c.id

//       LEFT JOIN subcategories s
//       ON p.subcategory_id = s.id

//       WHERE
//         p.active = 1

//       AND
//       (
//         LOWER(p.name) LIKE ?
//         OR LOWER(c.name) LIKE ?
//         OR LOWER(s.name) LIKE ?
//       )

//       ORDER BY p.id DESC`,
//       [`%${q}%`, `%${q}%`, `%${q}%`]
//     );

//     res.json(rows);

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: "Search failed"
//     });

//   }

// };

export const searchProducts = async (req, res) => {

  try {

    const q =
      req.query.q?.trim().toLowerCase() || "";

    const [rows] = await db.query(

      `
      SELECT 
        p.*,

        c.name AS category_name,
        s.name AS subcategory_name,

        /* IMAGE */
        p.image,

        /* VARIANT */
        (
          SELECT v.variant_label
          FROM product_variants v
          WHERE v.product_id = p.id
          LIMIT 1
        ) AS variant_label,

        /* PRICE */
        (
          SELECT v.price
          FROM product_variants v
          WHERE v.product_id = p.id
          LIMIT 1
        ) AS price,

        /* MRP */
        (
          SELECT v.mrp
          FROM product_variants v
          WHERE v.product_id = p.id
          LIMIT 1
        ) AS mrp,

        /* STOCK */
        (
          SELECT SUM(v.stock)
          FROM product_variants v
          WHERE v.product_id = p.id
        ) AS stock

      FROM products p

      LEFT JOIN categories c
      ON p.category_id = c.id

      LEFT JOIN subcategories s
      ON p.subcategory_id = s.id

      WHERE
        p.active = 1

      AND
      (
        LOWER(p.name) LIKE ?
        OR LOWER(c.name) LIKE ?
        OR LOWER(s.name) LIKE ?
      )

      ORDER BY p.id DESC
      `,

      [
        `%${q}%`,
        `%${q}%`,
        `%${q}%`
      ]

    );

    res.json(rows);

  } catch (err) {

    console.log("SEARCH ERROR =>", err);

    res.status(500).json({
      message: "Search failed"
    });

  }

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
export const getOfferZoneProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*,

      (
        SELECT v.variant_label
        FROM product_variants v
        WHERE v.product_id = p.id
        ORDER BY v.price ASC
        LIMIT 1
      ) AS variant_label,

      ${PRICE_QUERY}

      (
        SELECT SUM(v.stock)
        FROM product_variants v
        WHERE v.product_id = p.id
      ) AS stock

      FROM products p
      WHERE p.active = 1

      -- ✅ wider expiry range
      AND p.expiry_date IS NOT NULL
      AND p.expiry_date >= CURDATE()
      AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)

      ORDER BY p.expiry_date ASC
    `);

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.error("OFFER ZONE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

 
export const getGroupedProducts = async (req, res) => {
  try {
    const [categories] = await db.query(`SELECT * FROM categories`);

    const [products] = await db.query(`
      SELECT p.*, c.name AS category_name,

      ${PRICE_QUERY}

      (
        SELECT SUM(v.stock)
        FROM product_variants v
        WHERE v.product_id = p.id
      ) AS stock

      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1
    `);

    const grouped = {};

    // initialize all categories
    categories.forEach((c) => {
      grouped[c.name] = [];
    });

    normalizeProducts(products).forEach((p) => {
      grouped[p.category_name].push(p);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ================= NORMALIZER ================= */
// const normalizeProducts = (rows) => {
//   return rows.map((p) => {
//     let images = [];
//     try {
//       images = p.images ? JSON.parse(p.images) : [];
//     } catch {}

//     const formatted = images.map((img) => ({
//       url: img.url?.startsWith("http")
//         ? img.url
//         : `http://localhost:4000${img.url}`,
//     }));

//     return {
//       ...p,
//       images: formatted,
      
//       image: formatted[0]?.url || null,
//       price: Number(p.price) || null,
//       mrp: Number(p.mrp) || null,
//       stock: Number(p.stock) || null,
//     };
//   });
// };
const normalizeProducts = (rows) => {
  return rows.map((p) => {
    let images = [];

    try {
      images =
        typeof p.images === "string"
          ? JSON.parse(p.images)
          : p.images || [];
    } catch (e) {
      console.log("Image parse error:", p.id);
      images = [];
    }

    const formatted = images.map((img) => ({
      url: img.url?.startsWith("http")
        ? img.url
        : `http://localhost:4000${img.url}`,
    }));

    return {
      ...p,

      images: formatted,

      // 🔥 FIX: fallback added
      image:
        p.image
          ? p.image.startsWith("http")
            ? p.image
            : `http://localhost:4000${p.image}`
          : formatted[0]?.url || "/placeholder.png",

      price: Number(p.price) || 0,
      mrp: Number(p.mrp) || 0,
      stock: Number(p.stock) || 0,
    };
  });
};
/* ================= CART SUGGESTIONS ================= */
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
export const bulkUploadProducts = async (req, res) => {
  try {
    const excelFile = req.files["file"][0];
    const imageFiles = req.files["images"] || [];

    const workbook = XLSX.readFile(excelFile.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    // ✅ Map images
    const imageMap = {};
    imageFiles.forEach((file) => {
      imageMap[file.originalname] = file.filename;
    });

    const errors = [];

    for (const r of rows) {
      try {
        if (!r.name || !r.category_id || !r.variant_label) {
          throw new Error("Missing required fields");
        }

        const category_id = Number(r.category_id);
        const subcategory_id = r.subcategory_id
          ? Number(r.subcategory_id)
          : null;

        const price = Number(r.price) || 0;
        const mrp = Number(r.mrp) || 0;
        const stock = Number(r.stock) || 0;

        // ================= IMAGE LOGIC =================
        let imagesArray = [];

        if (r.images) {
          const imageList = r.images.split(",").map((img) => img.trim());

          imagesArray = imageList
            .map((img) => {
              if (img.startsWith("http")) return { url: img };

              if (imageMap[img]) {
                return { url: `/uploads/products/${imageMap[img]}` };
              }

              return null;
            })
            .filter(Boolean);
        }

        if (imagesArray.length === 0) {
          imagesArray.push({ url: "/uploads/products/default.png" });
        }
        // =================================================

        // ✅ Check product
        const [existingProduct] = await db.query(
          "SELECT id FROM products WHERE name=? AND category_id=?",
          [r.name, category_id]
        );

        let productId;

        if (!existingProduct.length) {
          const [result] = await db.query(
            `INSERT INTO products
            (name, category_id, subcategory_id, brand, description, weight, unit, images, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [
              r.name,
              category_id,
              subcategory_id,
              r.brand || "Generic",
              r.description || "No description",
              r.weight || null,
              r.unit || null,
              JSON.stringify(imagesArray),
            ]
          );

          productId = result.insertId;
        } else {
          productId = existingProduct[0].id;
        }

        // ✅ Check if variant already exists
        const [existingVariant] = await db.query(
          `SELECT id FROM product_variants 
           WHERE product_id = ? AND variant_label = ?`,
          [productId, r.variant_label]
        );

        let variantId;

        if (!existingVariant.length) {
          // 👉 create new variant
          const [variantResult] = await db.query(
            `INSERT INTO product_variants
            (product_id, variant_label, price, mrp, stock)
            VALUES (?, ?, ?, ?, ?)`,
            [productId, r.variant_label, price, mrp, stock]
          );

          variantId = variantResult.insertId;
        } else {
          // 👉 update existing variant
          variantId = existingVariant[0].id;

          await db.query(
            `UPDATE product_variants
             SET price=?, mrp=?, stock=?
             WHERE id=?`,
            [price, mrp, stock, variantId]
          );
        }

        // ✅ SMART PRICE INSERT (ONLY IF CHANGED)
        const [lastPrice] = await db.query(
          `SELECT selling_price FROM product_prices
           WHERE variant_id = ?
           ORDER BY created_at DESC
           LIMIT 1`,
          [variantId]
        );

        if (
          !lastPrice.length ||
          Number(lastPrice[0].selling_price) !== price
        ) {
          await db.query(
            `
            INSERT INTO product_prices
            (variant_id, selling_price, mrp, created_at)
            VALUES (?, ?, ?, NOW())
            `,
            [variantId, price, mrp]
          );
        }

      } catch (err) {
        errors.push({
          row: r,
          error: err.message,
        });
      }
    }

    res.json({
      message: "Bulk upload completed",
      errors,
    });

  } catch (err) {
    console.error("BULK UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const updateProductPrice = async (req, res) => {
  try {
    const { variant_id, price, mrp } = req.body;

    if (!variant_id || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ UPDATE MAIN TABLE
    await db.query(
      `UPDATE product_variants SET price=?, mrp=? WHERE id=?`,
      [price, mrp || null, variant_id]
    );

    // ✅ INSERT HISTORY
    await db.query(
      `INSERT INTO product_prices 
       (variant_id, selling_price, mrp, created_at)
       VALUES (?, ?, ?, NOW())`,
      [variant_id, price, mrp || null]
    );

    res.json({ message: "Price updated successfully" });

  } catch (err) {
    console.error("PRICE UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const bulkUpdatePrice = async (req, res) => {
  try {
    const updates = req.body;

    for (const item of updates) {
      const { variant_id, price, mrp } = item;

      // update main table
      await db.query(
        "UPDATE product_variants SET price=?, mrp=? WHERE id=?",
        [price, mrp, variant_id]
      );

      // insert history
      await db.query(
        `INSERT INTO product_prices 
         (variant_id, selling_price, mrp, created_at)
         VALUES (?, ?, ?, NOW())`,
        [variant_id, price, mrp]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("BULK UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
