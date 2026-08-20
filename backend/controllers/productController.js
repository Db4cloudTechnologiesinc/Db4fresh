// import db from "../config/db.js";
//  import XLSX from "xlsx";
//  import axios from "axios";
// import fs from "fs-extra";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /* ================= COMMON PRICE QUERY ================= */
// const PRICE_QUERY = `
// (
//   SELECT COALESCE(
//     (
//       SELECT pp.selling_price
//       FROM product_prices pp
//       WHERE pp.variant_id = (
//         SELECT v.id FROM product_variants v
//         WHERE v.product_id = p.id
//         ORDER BY v.price ASC LIMIT 1
//       )
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
//       WHERE pp.variant_id = (
//         SELECT v.id FROM product_variants v
//         WHERE v.product_id = p.id
//         ORDER BY v.price ASC LIMIT 1
//       )
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
// `;/* ================= IMAGE UPLOAD ================= */
// export const uploadImages = async (req, res) => {
//   try {
//     if (!req.files || !req.files.length) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }

//     const images = req.files.map((file) => ({
//       url: `/uploads/products/${file.filename}`,
//     }));

//     res.json({ images });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// function parseVariantLabel(label) {
//   const cleaned = label.trim().toLowerCase();

//   const match = cleaned.match(
//     /^(\d+(?:\.\d+)?)\s*(kg|g|l|ml|pack|packs)$/i
//   );

//   if (!match) {
//     return {
//       quantity: null,
//       unit: null,
//     };
//   }

//   return {
//     quantity: Number(match[1]),
//     unit: match[2] === "packs" ? "pack" : match[2].toLowerCase(),
//   };
// }
// /* ================= CREATE PRODUCT ================= */

// export const createProductWithVariants = async (req, res) => {
//   try {

//     const {
//       name,
//       category_id,
//       subcategory_id,
//       description,
//       manufacture_date,
//       expiry_date,
//       brand,
//       images = [],
//       variants = [],
//     } = req.body;

//     /* ================= CREATE PRODUCT ================= */

//     const [result] = await db.query(
//       `
//       INSERT INTO products
//       (
//         name,
//         category_id,
//         subcategory_id,
//         description,
//         manufacture_date,
//         expiry_date,
//         brand,
//         images,
//         active
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         name,
//         category_id,
//         subcategory_id || null,
//         description || null,
//         manufacture_date || null,
//         expiry_date || null,
//         brand || null,
//         JSON.stringify(images),
//         1,
//       ]
//     );

//     const productId = result.insertId;

//     /* ================= CREATE VARIANTS ================= */

//     for (const v of variants) {

//       if (!v.variant_label) continue;

//       const { quantity, unit } =
//   parseVariantLabel(v.variant_label);

// await db.query(
//   `
//   INSERT INTO product_variants
//   (
//     product_id,
//     variant_label,
//     quantity,
//     unit,
//     price,
//     mrp,
//     stock,
//     is_free_delivery,
//     is_today_deal
//   )
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `,
//   [
//     productId,
//     v.variant_label,
//     quantity,
//     unit,
//     v.price ? Number(v.price) : 0,
//     v.mrp ? Number(v.mrp) : null,
//     v.stock ? Number(v.stock) : 0,
//     v.is_free_delivery || 0,
//     v.is_today_deal || 0,
//   ]
// );
//     }

//     res.json({
//       success: true,
//       productId,
//     });

//   } catch (err) {

//     console.log("CREATE PRODUCT ERROR:", err);

//     res.status(500).json({
//       message: err.message,
//     });

//   }
// };
 
// /* ================= GET PRODUCTS ================= */
// export const getProducts = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

    
//     const [rows] = await db.query(
//   `
//   SELECT 
//     p.*,

//     c.name AS category_name,
//     s.name AS subcategory_name,

   
//     (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//     ${PRICE_QUERY}

//     (
//       SELECT SUM(v.stock) 
//       FROM product_variants v
//       WHERE v.product_id = p.id
//     ) AS stock

//   FROM products p

//   LEFT JOIN categories c
//   ON p.category_id = c.id

//   LEFT JOIN subcategories s
//   ON p.subcategory_id = s.id

//   WHERE p.active = 1
// ORDER BY p.id DESC


//   LIMIT ? OFFSET ?
//   `,
//   [limit, offset]
// );

//     res.json(normalizeProducts(rows));
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const getProductsByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,

       
//         (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//         (
//           SELECT COALESCE(
//             (
//               SELECT pp.selling_price
//               FROM product_prices pp
//               JOIN product_variants v ON v.id = pp.variant_id
//               WHERE v.product_id = p.id
//               ORDER BY pp.created_at DESC
//               LIMIT 1
//             ),
//             (
//               SELECT v.price
//               FROM product_variants v
//               WHERE v.product_id = p.id
//               ORDER BY v.price ASC
//               LIMIT 1
//             )
//           )
//         ) AS price,

//         (
//           SELECT COALESCE(
//             (
//               SELECT pp.mrp
//               FROM product_prices pp
//               JOIN product_variants v ON v.id = pp.variant_id
//               WHERE v.product_id = p.id
//               ORDER BY pp.created_at DESC
//               LIMIT 1
//             ),
//             (
//               SELECT v.mrp
//               FROM product_variants v
//               WHERE v.product_id = p.id
//               ORDER BY v.price ASC
//               LIMIT 1
//             )
//           )
//         ) AS mrp,

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p
//       WHERE p.category_id = ?
// AND p.active = 1
// ORDER BY p.id DESC`,
//       [categoryId]
//     );

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.error("CATEGORY PRODUCTS ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// /* ================= PRODUCTS BY SUBCATEGORY ================= */
// export const getProductsBySubcategory = async (req, res) => {
//   try {
//     const { subcategoryId } = req.params;
 
//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,
//         COALESCE(MIN(v.price), 0) AS price,
//         COALESCE(SUM(v.stock), 0) AS stock
//       FROM products p
//       LEFT JOIN product_variants v ON v.product_id = p.id
//       WHERE p.subcategory_id = ?
// AND p.active = 1
//       GROUP BY p.id
//       `,
//       [subcategoryId]
//     );
 
//     res.json(normalizeProducts(rows));
//   } catch (err) {
//     console.error("SUBCATEGORY ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const getAdminProducts = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `
//       SELECT
// p.*,

// c.name AS category_name,

// s.name AS subcategory_name,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

// ${PRICE_QUERY}

// (
//   SELECT SUM(v.stock)
//   FROM product_variants v
//   WHERE v.product_id = p.id
// ) AS stock

// FROM products p

// LEFT JOIN categories c
// ON p.category_id = c.id

// LEFT JOIN subcategories s
// ON p.subcategory_id = s.id

// ORDER BY p.id DESC
//       `
//     );

//     res.json(normalizeProducts(rows)); // no pagination needed for admin

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= SINGLE PRODUCT ================= */
// export const getProduct = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,
//         (
//           SELECT v.variant_label
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           LIMIT 1
//         ) AS variant_label,
//         (
//           SELECT v.price
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           LIMIT 1
//         ) AS price,
//         (
//           SELECT v.mrp
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           LIMIT 1
//         ) AS mrp
//       FROM products p
//       WHERE p.id = ?
//       `,
//       [productId]
//     );

//     if (!rows.length) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const product = normalizeProducts(rows)[0];

//     /* GET ALL VARIANTS */
//     const [variants] = await db.query(
//       `
//       SELECT
//         id,
//         variant_label,
//         price,
//         mrp,
//         stock
//       FROM product_variants
//       WHERE product_id = ?
//       `,
//       [productId]
//     );

//     product.variants = variants;

//     res.json(product);

//   } catch (err) {
//     console.error("GET PRODUCT ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// /* ================= GET PRODUCT VARIANTS ================= */
// export const getProductVariants = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT
//         id,
//         variant_label,
//         price,
//         mrp,
//         stock
//       FROM product_variants
//       WHERE product_id = ?
//       ORDER BY quantity
//       `,
//       [id]
//     );

//     res.json(rows);

//   } catch (err) {

//     res.status(500).json({
//       message: err.message,
//     });

//   }
// };
// /* ================= UPDATE PRODUCT ================= */
// export const updateProduct = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
 
//     const {
//       name,
//       category_id,
//       subcategory_id,
//       description,
//       manufacture_date,
//       expiry_date,
//       images = [],
//       variants = [],
//       removedVariantIds = [],
//     } = req.body;
 
//     await db.query(
//   `
//   UPDATE products SET
//     name = ?,
//     category_id = ?,
//     subcategory_id = ?,
//     description = ?,
//     manufacture_date = ?,
//     expiry_date = ?,
//     images = ?
//   WHERE id = ?
//   `,
//   [
//     name,
//     category_id,
//     subcategory_id || null,
//     description || null,
//     manufacture_date || null,
//     expiry_date || null,
//     JSON.stringify(images),
//     id,
//   ]
// );
//     if (removedVariantIds.length) {
//       await db.query(
//         "DELETE FROM product_variants WHERE id IN (?)",
//         [removedVariantIds]
//       );
//     }
 
//     for (const v of variants) {
//       if (!v.variant_label) continue;
 
//       if (v.id) {
//         const { quantity, unit } =
//   parseVariantLabel(v.variant_label);

// await db.query(
//   `
//   UPDATE product_variants
//   SET
//     variant_label=?,
//     quantity=?,
//     unit=?,
//     price=?,
//     mrp=?,
//     stock=?,
//     is_free_delivery=?,
//     is_today_deal=?
//   WHERE id=?
//   `,
//   [
//     v.variant_label,
//     quantity,
//     unit,
//     v.price,
//     v.mrp,
//     v.stock,
//     v.is_free_delivery || 0,
//     v.is_today_deal || 0,
//     v.id
//   ]
// );
//       } else {
//         const { quantity, unit } =
//   parseVariantLabel(v.variant_label);

// await db.query(
//   `
//   INSERT INTO product_variants
//   (
//     product_id,
//     variant_label,
//     quantity,
//     unit,
//     price,
//     mrp,
//     stock,
//     is_free_delivery,
//     is_today_deal
//   )
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `,
//   [
//     id,
//     v.variant_label,
//     quantity,
//     unit,
//     v.price,
//     v.mrp,
//     v.stock,
//     v.is_free_delivery || 0,
//     v.is_today_deal || 0
//   ]
// );
//       }
//     }
 
//     res.json({ success: true });
//   } catch (err) {
//     console.error("UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
 
// /* ================= DELETE PRODUCT ================= */
// export const deleteProduct = async (req, res) => {
//   await db.query(
//     "DELETE FROM product_variants WHERE product_id = ?",
//     [req.params.id]
//   );
//   await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
//   res.json({ message: "Product deleted" });
// };
 
// /* ================= EXTRA ================= */
// export const getProductDetails = getProduct;
 
// export const getProductReviews = async (req, res) => {
//   const [rows] = await db.query(
//     "SELECT * FROM product_reviews WHERE product_id = ?",
//     [req.params.id]
//   );
//   res.json(rows);
// };
// /* ================= SIMILAR PRODUCTS ================= */
// export const getSimilarProducts = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const [productRows] = await db.query(
//       `
//       SELECT category_id, subcategory_id
//       FROM products
//       WHERE id = ?
//       `,
//       [productId]
//     );

//     if (productRows.length === 0) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     const currentCategoryId = productRows[0].category_id;
//     const currentSubcategoryId = productRows[0].subcategory_id;

//     if (!currentSubcategoryId) {
//       return res.json([]);
//     }

//     const [rows] = await db.query(
//       `
//       SELECT 
//         p.*,

//         (
//           SELECT v.id
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS variant_id,

//         (
//           SELECT v.variant_label
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS variant_label,

//         ${PRICE_QUERY}

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p

//       WHERE
//         p.active = 1
//         AND p.id != ?
//         AND p.subcategory_id = ?

//       LIMIT 10
//       `,
//       [productId, currentSubcategoryId]
//     );

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.log("SIMILAR PRODUCTS ERROR:", err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };
// export const getSuggestedProducts = getSimilarProducts;
// /* ================= SEARCH ================= */

// export const searchProducts = async (req, res) => {

//   try {

//     const q =
//       req.query.q?.trim().toLowerCase() || "";

//     const [rows] = await db.query(

//       `
//       SELECT 
//         p.*,

//         c.name AS category_name,
//         s.name AS subcategory_name,

//         /* IMAGE */
//         p.image,

//         /* VARIANT */
        
// (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,
//         /* PRICE */
//         (
//           SELECT v.price
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           LIMIT 1
//         ) AS price,

//         /* MRP */
//         (
//           SELECT v.mrp
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           LIMIT 1
//         ) AS mrp,

//         /* STOCK */
//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

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

//       ORDER BY p.id DESC
//       `,

//       [
//         `%${q}%`,
//         `%${q}%`,
//         `%${q}%`
//       ]

//     );

//     res.json(rows);

//   } catch (err) {

//     console.log("SEARCH ERROR =>", err);

//     res.status(500).json({
//       message: "Search failed"
//     });

//   }

// };
// /* ================= TOP PICKS (HOME) ================= */
// export const getTopPicks = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         p.*,

        
//         (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//         (
//           SELECT v.price
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS price,

//         (
//           SELECT v.mrp
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS mrp,

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p
//       WHERE p.active = 1

// AND NOT EXISTS (
//   SELECT 1
//   FROM product_variants pv
//   WHERE pv.product_id = p.id
//     AND (
//       (pv.unit = 'kg' AND pv.quantity >= 3)
//       OR
//       (pv.unit = 'l' AND pv.quantity >= 3)
//       OR
//       (pv.unit = 'pack' AND pv.quantity >= 12)
//     )
// )

// ORDER BY p.id DESC
//       LIMIT 10
//     `);

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.error("TOP PICKS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// }; 
// /* ================= OFFER ZONE PRODUCTS ================= */

// export const getOfferZoneProducts = async (req, res) => {
//   try {

//     const [offers] = await db.query(`
//      SELECT
//     bp.id AS id,
//     o.id AS offer_id,

//     bp.name,
//     bp.images,
//     bp.brand,
//     bp.description,
//     bp.category_id,
//     bp.subcategory_id,

//     o.buy_qty,
//     o.free_qty,

//     fp.name AS free_product_name,

    
//     (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//     (
//       SELECT price
//       FROM product_variants
//       WHERE product_id = bp.id
//       ORDER BY price
//       LIMIT 1
//     ) AS price,

//     (
//       SELECT mrp
//       FROM product_variants
//       WHERE product_id = bp.id
//       ORDER BY price
//       LIMIT 1
//     ) AS mrp,

//     (
//       SELECT SUM(stock)
//       FROM product_variants
//       WHERE product_id = bp.id
//     ) AS stock

// FROM offers o

// JOIN products bp
// ON bp.id = o.buy_product_id

// JOIN products fp
// ON fp.id = o.free_product_id

// WHERE o.active = 1;
//     `);

//     res.json(offers);

//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       message: err.message
//     });
//   }
// };
// export const getFreeDeliveryProducts = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT DISTINCT p.*, pv.variant_label, pv.price, pv.mrp, pv.stock
//       FROM products p
//       JOIN product_variants pv ON p.id = pv.product_id
//       WHERE p.active = 1
//       AND pv.is_free_delivery = 1
//     `);

//     res.json(normalizeProducts(rows));
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const getTodayDealsProducts = async (req, res) => {
//   try {

//     const [rows] = await db.query(`
// SELECT
//     p.*,

//     MIN(pv.variant_label) AS variant_label,
//     MIN(pv.price) AS price,
//     MIN(pv.mrp) AS mrp,
//     SUM(pv.stock) AS stock,

//     p.deal_discount,
//     p.deal_expires_at

// FROM products p

// JOIN product_variants pv
// ON pv.product_id = p.id

// WHERE
//     p.active = 1
//     AND p.today_deal = 1

// GROUP BY p.id

// ORDER BY p.id DESC
// `);

//     res.json(normalizeProducts(rows));

//   } catch (err) {

//     console.log("TODAY DEALS ERROR:", err);

//     res.status(500).json({
//       message: err.message
//     });

//   }
// };

// export const getHalfPriceProducts = async (req, res) => {
//   try {

//     const [rows] = await db.query(`
//       SELECT DISTINCT
//         p.*,
//         pv.variant_label,
//         pv.price,
//         pv.mrp,
//         pv.stock,

//         ROUND(
//           ((pv.mrp - pv.price) / pv.mrp) * 100
//         ) AS discount_percentage

//       FROM products p

//       JOIN product_variants pv
//       ON p.id = pv.product_id

//       WHERE
//         p.active = 1
//         AND pv.mrp IS NOT NULL
//         AND pv.mrp > pv.price

//         AND ROUND(
//           ((pv.mrp - pv.price) / pv.mrp) * 100
//         ) >= 50

//       ORDER BY discount_percentage DESC
//     `);

//     res.json(normalizeProducts(rows));

//   } catch (err) {

//     console.log("50% OFF ERROR:", err);

//     res.status(500).json({
//       message: err.message
//     });

//   }
// };
// export const getSuperStoreProducts = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT DISTINCT p.*
//       FROM products p
//       JOIN product_variants pv
//         ON pv.product_id = p.id
//       WHERE p.active = 1
//         AND p.status = 'ACTIVE'
//         AND (
//           (pv.unit = 'kg' AND pv.quantity >= 3)
//           OR
//           (pv.unit = 'l' AND pv.quantity >= 3)
//           OR
//           (pv.unit = 'pack' AND pv.quantity >= 12)
//         )
//       ORDER BY p.created_at DESC
//     `);

//     console.log("SUPER STORE PRODUCTS:", rows);

//     return res.json(rows);

//   } catch (err) {
//     console.error("SUPER STORE ERROR:", err);

//     return res.status(500).json({
//       message: err.message
//     });
//   }
// };
// export const getGroupedProducts = async (req, res) => {
//   try {
//     const [categories] = await db.query(`SELECT * FROM categories`);

//     const [products] = await db.query(`
//       SELECT p.*, c.name AS category_name,

//       ${PRICE_QUERY}

//       (
//         SELECT SUM(v.stock)
//         FROM product_variants v
//         WHERE v.product_id = p.id
//       ) AS stock

//       FROM products p
//       JOIN categories c ON c.id = p.category_id
//       WHERE p.active = 1
//     `);

//     const grouped = {};

//     // initialize all categories
//     categories.forEach((c) => {
//       grouped[c.name] = [];
//     });

//     normalizeProducts(products).forEach((p) => {
//       grouped[p.category_name].push(p);
//     });

//     res.json(grouped);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// /* ================= REVENUE STATS ================= */
// const normalizeProducts = (rows) => {
//   return rows.map((p) => {
//     let images = [];

//     try {
//       images =
//         typeof p.images === "string"
//           ? JSON.parse(p.images)
//           : p.images || [];
//     } catch (e) {
//       console.log("Image parse error:", p.id);
//       images = [];
//     }

//     const formatted = images.map((img) => ({
//       url: img.url?.startsWith("http")
//         ? img.url
//         : `http://localhost:4000${img.url}`,
//     }));

//     return {
//       ...p,

//       images: formatted,

//       // 🔥 FIX: fallback added
//       image:
//         p.image
//           ? p.image.startsWith("http")
//             ? p.image
//             : `http://localhost:4000${p.image}`
//           : formatted[0]?.url || "/placeholder.png",

//       price: Number(p.price) || 0,
//       mrp: Number(p.mrp) || 0,
//       stock: Number(p.stock) || 0,
//     };
//   });
// };
// /* ================= CART SUGGESTIONS ================= */
// export const getCartSuggestions = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const [product] = await db.query(
//       "SELECT category_id FROM products WHERE id = ?",
//       [productId]
//     );

//     if (!product.length) {
//       return res.json([]);
//     }

//     const categoryId = product[0].category_id;

//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,

//        (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,


//         (
//           SELECT v.price
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS price,

//         (
//           SELECT v.mrp
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS mrp,

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p
//       WHERE p.category_id = ?
//       AND p.id != ?
//       AND p.active = 1
//       LIMIT 10
//       `,
//       [categoryId, productId]
//     );

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.error("CART SUGGESTIONS ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const bulkUploadProducts = async (req, res) => {
//   try {
//     console.log("========== BULK UPLOAD STARTED ==========");
// console.log("Files:", req.files);

// const excelFile = req.files["file"][0];
// const imageFiles = req.files["images"] || [];

// // ================= READ WORKBOOK =================
// const workbook = XLSX.readFile(excelFile.path);

// const productsSheet = workbook.Sheets["Products"];
// const variantsSheet = workbook.Sheets["Product_Variants"];

// if (!productsSheet) {
//   return res.status(400).json({
//     message: "Products sheet not found",
//   });
// }

// if (!variantsSheet) {
//   return res.status(400).json({
//     message: "Product_Variants sheet not found",
//   });
// }

// const products = XLSX.utils.sheet_to_json(productsSheet);
// const variants = XLSX.utils.sheet_to_json(variantsSheet);

// console.log("Products:", products.length);
// console.log("Variants:", variants.length);

// // ================= IMAGE MAP =================
// const imageMap = {};

// imageFiles.forEach((file) => {
//   imageMap[file.originalname] = file.filename;
// });

// const productMap = {};
// const errors = [];

// // ===================================================
// // INSERT PRODUCTS
// // ===================================================

// for (const p of products) {
//   try {
//     console.log("Processing Product:", p["Product Name"]);

//     const productName = String(p["Product Name"]).trim();
//     const categoryName = String(p["Category"]).trim();

//     // ---------- CATEGORY ----------
//     const [category] = await db.query(
//       "SELECT id FROM categories WHERE LOWER(name)=LOWER(?)",
//       [categoryName]
//     );

//     if (!category.length) {
//       throw new Error(`Category '${categoryName}' not found`);
//     }

//     const category_id = category[0].id;

//     // ---------- SUBCATEGORY ----------
//     let subcategory_id = null;

//     if (p["Subcategory"]) {
//       const [subcategory] = await db.query(
//         `SELECT id
//          FROM subcategories
//          WHERE name=? AND category_id=?`,
//         [p["Subcategory"], category_id]
//       );

//       if (subcategory.length) {
//         subcategory_id = subcategory[0].id;
//       }
//     }

// // ---------- IMAGE ----------
// let imagesArray = [];

// // If image URL or uploaded image exists
// if (p["Image URL"]) {
//   const img = String(p["Image URL"]).trim();

//   // External image URL
//   if (img.startsWith("http")) {
//     imagesArray.push({
//       url: img,
//     });
//   }
//   // Uploaded image file
//   else if (imageMap[img]) {
//     imagesArray.push({
//       url: `/uploads/products/${imageMap[img]}`,
//     });
//   }
// }

// // If no image is provided, use default image
// if (imagesArray.length === 0) {
//   imagesArray.push({
//     url: "/uploads/products/default.png",
//   });
// }
//     // ---------- CHECK PRODUCT ----------
//     const [existingProduct] = await db.query(
//       `SELECT id
//        FROM products
//        WHERE name=? AND category_id=?`,
//       [productName, category_id]
//     );

//     let productId;

//     if (!existingProduct.length) {

//       const [productResult] = await db.query(
//         `
//         INSERT INTO products
//         (
//           name,
//           category_id,
//           subcategory_id,
//           brand,
//           description,
//           highlights,
//           tags,
//           return_policy,
//           images,
//           active,
//           status
//         )
//         VALUES
//         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           productName,
//           category_id,
//           subcategory_id,
//           p["Brand"] || "",
//           p["Description"] || "",
//           p["Highlights"] || "",
//           p["Tags"] || "",
//           p["Return Policy"] || "",
//           JSON.stringify(imagesArray),
//           Number(p["Active"]) || 1,
//           p["Status"] || "ACTIVE",
//         ]
//       );

//       productId = productResult.insertId;

//       console.log("✅ Product Created:", productName);

//     } else {

//       productId = existingProduct[0].id;

//       console.log("ℹ️ Product Already Exists:", productName);

//     }

//     productMap[productName.trim()] = productId;

//   } catch (err) {

//     console.error(err);

//     errors.push({
//       sheet: "Products",
//       product: p["Product Name"],
//       error: err.message,
//     });

//   }
// }





// // ===================================================
// // INSERT VARIANTS
// // ===================================================

// for (const v of variants) {
//   try {

//     const productName = String(v["Product Name"]).trim();

//     const productId = productMap[productName];

//     if (!productId) {
//       throw new Error(
//         `Product '${productName}' not found in Products sheet`
//       );
//     }

//     const variantLabel = String(v["Variant Label"]).trim();

//     const quantity = Number(v["Quantity"]) || 0;

//     const unit = String(v["Unit"]).trim().toLowerCase();

//     const price = Number(v["Price"]) || 0;

//     const mrp = Number(v["MRP"]) || 0;

//     const stock = Number(v["Stock"]) || 0;

//     const sku = v["SKU"] || "";

//     const freeDelivery =
//       Number(v["Free Delivery"]) === 1 ? 1 : 0;

//     const todayDeal =
//       Number(v["Today Deal"]) === 1 ? 1 : 0;

//     // ---------------- EXISTING VARIANT ----------------

//     const [existingVariant] = await db.query(
//       `
//       SELECT id
//       FROM product_variants
//       WHERE product_id=?
//       AND variant_label=?
//       `,
//       [productId, variantLabel]
//     );

//     let variantId;

//     if (!existingVariant.length) {

//       const [variantResult] = await db.query(
//         `
//         INSERT INTO product_variants
//         (
//           product_id,
//           variant_label,
//           price,
//           mrp,
//           sku,
//           stock,
//           is_free_delivery,
//           is_today_deal,
//           quantity,
//           unit
//         )
//         VALUES
//         (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           productId,
//           variantLabel,
//           price,
//           mrp,
//           sku,
//           stock,
//           freeDelivery,
//           todayDeal,
//           quantity,
//           unit
//         ]
//       );

//       variantId = variantResult.insertId;

//       console.log(
//         `✅ Variant Created: ${productName} - ${variantLabel}`
//       );

//     } else {

//       variantId = existingVariant[0].id;

//       await db.query(
//         `
//         UPDATE product_variants
//         SET
//         price=?,
//         mrp=?,
//         sku=?,
//         stock=?,
//         is_free_delivery=?,
//         is_today_deal=?,
//         quantity=?,
//         unit=?
//         WHERE id=?
//         `,
//         [
//           price,
//           mrp,
//           sku,
//           stock,
//           freeDelivery,
//           todayDeal,
//           quantity,
//           unit,
//           variantId
//         ]
//       );

//       console.log(
//         `♻️ Variant Updated: ${productName} - ${variantLabel}`
//       );

//     }

//     // ---------------- PRICE HISTORY ----------------

//     const [lastPrice] = await db.query(
//       `
//       SELECT selling_price
//       FROM product_prices
//       WHERE variant_id=?
//       ORDER BY created_at DESC
//       LIMIT 1
//       `,
//       [variantId]
//     );

//     if (
//       !lastPrice.length ||
//       Number(lastPrice[0].selling_price) !== price
//     ) {

//       await db.query(
//         `
//         INSERT INTO product_prices
//         (
//           variant_id,
//           selling_price,
//           mrp,
//           created_at
//         )
//         VALUES
//         (?, ?, ?, NOW())
//         `,
//         [
//           variantId,
//           price,
//           mrp
//         ]
//       );

//     }

//   } catch (err) {

//     console.error(err);

//     errors.push({
//       sheet: "Product_Variants",
//       product: v["Product Name"],
//       variant: v["Variant Label"],
//       error: err.message,
//     });

//   }
// }
        
// console.log("Bulk Upload Finished");
// console.log("Errors:", errors);

// res.json({
//   success: errors.length === 0,
//   message: "Bulk upload completed",
//   productsProcessed: Object.keys(productMap).length,
//   variantsProcessed: variants.length,
//   errors,
// });

// } catch (err) {
//   console.error("BULK UPLOAD ERROR:", err);
//   res.status(500).json({
//     message: err.message,
//   });
// }
// };

// export const updateProductPrice = async (req, res) => {
//   try {
//     const { variant_id, price, mrp } = req.body;

//     if (!variant_id || !price) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // ✅ UPDATE MAIN TABLE
//     await db.query(
//       `UPDATE product_variants SET price=?, mrp=? WHERE id=?`,
//       [price, mrp || null, variant_id]
//     );

//     // ✅ INSERT HISTORY
//     await db.query(
//       `INSERT INTO product_prices 
//        (variant_id, selling_price, mrp, created_at)
//        VALUES (?, ?, ?, NOW())`,
//       [variant_id, price, mrp || null]
//     );

//     res.json({ message: "Price updated successfully" });

//   } catch (err) {
//     console.error("PRICE UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// export const bulkUpdatePrice = async (req, res) => {
//   try {
//     const updates = req.body;

//     for (const item of updates) {
//       const { variant_id, price, mrp } = item;

//       // update main table
//       await db.query(
//         "UPDATE product_variants SET price=?, mrp=? WHERE id=?",
//         [price, mrp, variant_id]
//       );

//       // insert history
//       await db.query(
//         `INSERT INTO product_prices 
//          (variant_id, selling_price, mrp, created_at)
//          VALUES (?, ?, ?, NOW())`,
//         [variant_id, price, mrp]
//       );
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error("BULK UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= ADMIN: SET/UPDATE A DEAL (direct expiry, no duration math) ================= */
// export const setProductDeal = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { discount_percent, expires_at } = req.body;

//     if (!discount_percent || discount_percent <= 0 || discount_percent >= 100) {
//       return res.status(400).json({ message: "discount_percent must be between 1 and 99" });
//     }
//     if (!expires_at) {
//       return res.status(400).json({ message: "expires_at (a real date/time) is required" });
//     }

//     // "2026-07-27T11:30" (from <input type="datetime-local">) -> "2026-07-27 11:30:00" (MySQL DATETIME)
//     const mysqlExpiresAt = toMysqlDatetime(expires_at);

//     await db.query(
//       `UPDATE products
//        SET is_today_deal = 1,
//            deal_discount_percent = ?,
//            deal_expires_at = ?
//        WHERE id = ?`,
//       [discount_percent, mysqlExpiresAt, id]
//     );

//     res.json({ success: true, message: "Deal saved" });
//   } catch (err) {
//     console.error("SET DEAL ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// import db from "../config/db.js";
//  import XLSX from "xlsx";

// /* ================= COMMON PRICE QUERY ================= */
// const PRICE_QUERY = `
// (
//   SELECT COALESCE(
//     (
//       SELECT pp.selling_price
//       FROM product_prices pp
//       WHERE pp.variant_id = (
//         SELECT v.id FROM product_variants v
//         WHERE v.product_id = p.id
//         ORDER BY v.price ASC LIMIT 1
//       )
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
//       WHERE pp.variant_id = (
//         SELECT v.id FROM product_variants v
//         WHERE v.product_id = p.id
//         ORDER BY v.price ASC LIMIT 1
//       )
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

// /* ================= DATETIME HELPER ================= */
// /**
//  * Converts a browser <input type="datetime-local"> value
//  * ("2026-07-27T11:30" or "2026-07-27T11:30:45") into a
//  * MySQL-safe DATETIME string ("2026-07-27 11:30:00" / "2026-07-27 11:30:45").
//  * Returns null if given a falsy value.
//  */
// function toMysqlDatetime(localDatetimeStr) {
//   if (!localDatetimeStr) return null;
//   const withSpace = localDatetimeStr.replace("T", " ");
//   return withSpace.length === 16 ? `${withSpace}:00` : withSpace;
// }

// /* ================= IMAGE UPLOAD ================= */
// export const uploadImages = async (req, res) => {
//   try {
//     if (!req.files || !req.files.length) {
//       return res.status(400).json({ message: "No images uploaded" });
//     }

//     const images = req.files.map((file) => ({
//       url: `/uploads/products/${file.filename}`,
//     }));

//     res.json({ images });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// function parseVariantLabel(label) {
//   const cleaned = label.trim().toLowerCase();

//   const match = cleaned.match(
//     /^(\d+(?:\.\d+)?)\s*(kg|g|l|ml|pack|packs)$/i
//   );

//   if (!match) {
//     return {
//       quantity: null,
//       unit: null,
//     };
//   }

//   return {
//     quantity: Number(match[1]),
//     unit: match[2] === "packs" ? "pack" : match[2].toLowerCase(),
//   };
// }
// /* ================= CREATE PRODUCT ================= */

// export const createProductWithVariants = async (req, res) => {
//   try {

//     const {
//       name,
//       category_id,
//       subcategory_id,
//       description,
//       manufacture_date,
//       expiry_date,
//       brand,
//       images = [],
//       variants = [],
//     } = req.body;

//     /* ================= CREATE PRODUCT ================= */

//     const [result] = await db.query(
//       `
//       INSERT INTO products
//       (
//         name,
//         category_id,
//         subcategory_id,
//         description,
//         manufacture_date,
//         expiry_date,
//         brand,
//         images,
//         active
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         name,
//         category_id,
//         subcategory_id || null,
//         description || null,
//         manufacture_date || null,
//         expiry_date || null,
//         brand || null,
//         JSON.stringify(images),
//         1,
//       ]
//     );

//     const productId = result.insertId;

//     /* ================= CREATE VARIANTS ================= */

//     for (const v of variants) {

//       if (!v.variant_label) continue;

//       const { quantity, unit } =
//   parseVariantLabel(v.variant_label);

// await db.query(
//   `
//   INSERT INTO product_variants
//   (
//     product_id,
//     variant_label,
//     quantity,
//     unit,
//     price,
//     mrp,
//     stock,
//     is_free_delivery,
//     is_today_deal
//   )
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `,
//   [
//     productId,
//     v.variant_label,
//     quantity,
//     unit,
//     v.price ? Number(v.price) : 0,
//     v.mrp ? Number(v.mrp) : null,
//     v.stock ? Number(v.stock) : 0,
//     v.is_free_delivery || 0,
//     v.is_today_deal || 0,
//   ]
// );
//     }

//     res.json({
//       success: true,
//       productId,
//     });

//   } catch (err) {

//     console.log("CREATE PRODUCT ERROR:", err);

//     res.status(500).json({
//       message: err.message,
//     });

//   }
// };
 
// /* ================= GET PRODUCTS ================= */
// export const getProducts = async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 20;
//     const offset = (page - 1) * limit;

    
//     const [rows] = await db.query(
//   `
//   SELECT 
//     p.*,

//     c.name AS category_name,
//     s.name AS subcategory_name,

   
//     (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//     ${PRICE_QUERY}

//     (
//       SELECT SUM(v.stock) 
//       FROM product_variants v
//       WHERE v.product_id = p.id
//     ) AS stock

//   FROM products p

//   LEFT JOIN categories c
//   ON p.category_id = c.id

//   LEFT JOIN subcategories s
//   ON p.subcategory_id = s.id

//   WHERE p.active = 1
// ORDER BY p.id DESC


//   LIMIT ? OFFSET ?
//   `,
//   [limit, offset]
// );

//     res.json(normalizeProducts(rows));
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const getProductsByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,

       
//         (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//         (
//           SELECT COALESCE(
//             (
//               SELECT pp.selling_price
//               FROM product_prices pp
//               JOIN product_variants v ON v.id = pp.variant_id
//               WHERE v.product_id = p.id
//               ORDER BY pp.created_at DESC
//               LIMIT 1
//             ),
//             (
//               SELECT v.price
//               FROM product_variants v
//               WHERE v.product_id = p.id
//               ORDER BY v.price ASC
//               LIMIT 1
//             )
//           )
//         ) AS price,

//         (
//           SELECT COALESCE(
//             (
//               SELECT pp.mrp
//               FROM product_prices pp
//               JOIN product_variants v ON v.id = pp.variant_id
//               WHERE v.product_id = p.id
//               ORDER BY pp.created_at DESC
//               LIMIT 1
//             ),
//             (
//               SELECT v.mrp
//               FROM product_variants v
//               WHERE v.product_id = p.id
//               ORDER BY v.price ASC
//               LIMIT 1
//             )
//           )
//         ) AS mrp,

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p
//       WHERE p.category_id = ?
// AND p.active = 1
// ORDER BY p.id DESC`,
//       [categoryId]
//     );

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.error("CATEGORY PRODUCTS ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// /* ================= PRODUCTS BY SUBCATEGORY ================= */
// /* ================= PRODUCTS BY SUBCATEGORY ================= */
// export const getProductsBySubcategory = async (req, res) => {
//   try {
//     const { subcategoryId } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,

//         (
//           SELECT v.id
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS variant_id,

//         (
//           SELECT v.variant_label
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS variant_label,

//           COALESCE(
//             (
//               SELECT v.price
//               FROM product_variants v
//               WHERE v.product_id = p.id
//               ORDER BY v.price ASC
//               LIMIT 1
//             ), 0
//           ) AS price,

//           COALESCE(
//             (
//               SELECT SUM(v.stock)
//               FROM product_variants v
//               WHERE v.product_id = p.id
//             ), 0
//           ) AS stock

//         FROM products p
//         WHERE p.subcategory_id = ?
//         AND p.active = 1
//         `,
//         [subcategoryId]
//       );

//       res.json(normalizeProducts(rows));
//     } catch (err) {
//       console.error("SUBCATEGORY ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
//   export const getAdminProducts = async (req, res) => {
//     try {
//       const [rows] = await db.query(
//     `
//     SELECT
//       p.*,

//       c.name AS category_name,
//       s.name AS subcategory_name,

//       (
//         SELECT v.variant_label
//         FROM product_variants v
//         WHERE v.product_id = p.id
//         ORDER BY v.price ASC
//         LIMIT 1
//       ) AS variant_label,

//       ${PRICE_QUERY}

//       (
//         SELECT SUM(v.stock)
//         FROM product_variants v
//         WHERE v.product_id = p.id
//       ) AS stock

//     FROM products p

//     LEFT JOIN categories c
//       ON p.category_id = c.id

//     LEFT JOIN subcategories s
//       ON p.subcategory_id = s.id

//     ORDER BY p.id DESC
//     `
//   );

//       res.json(normalizeProducts(rows)); // no pagination needed for admin

//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   /* ================= SINGLE PRODUCT ================= */
//   /* ================= SINGLE PRODUCT ================= */
//   export const getProduct = async (req, res) => {
//     try {
//       const productId = req.params.id;

//       const [rows] = await db.query(
//         `
//         SELECT
//           p.*,
//           (
//             SELECT v.variant_label
//             FROM product_variants v
//             WHERE v.product_id = p.id
//             ORDER BY v.price ASC
//             LIMIT 1
//           ) AS variant_label,
//           (
//             SELECT v.price
//             FROM product_variants v
//             WHERE v.product_id = p.id
//             ORDER BY v.price ASC
//             LIMIT 1
//           ) AS price,
//           (
//             SELECT v.mrp
//             FROM product_variants v
//             WHERE v.product_id = p.id
//             ORDER BY v.price ASC
//             LIMIT 1
//           ) AS mrp
//         FROM products p
//         WHERE p.id = ?
//         `,
//         [productId]
//       );

//       if (!rows.length) {
//         return res.status(404).json({ message: "Product not found" });
//       }

//       const product = normalizeProducts(rows)[0];

//       /* GET ALL VARIANTS — ordered the same way as everywhere else,
//         so variants[0] always matches the "default variant" every
//         other endpoint (Home, Similar Products, etc.) resolves to. */
//       const [variants] = await db.query(
//         `
//         SELECT
//           id,
//           variant_label,
//           price,
//           mrp,
//           stock
//         FROM product_variants
//         WHERE product_id = ?
//         ORDER BY price ASC
//         `,
//         [productId]
//       );

//       product.variants = variants;

//       res.json(product);

//     } catch (err) {
//       console.error("GET PRODUCT ERROR:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
//   /* ================= GET PRODUCT VARIANTS ================= */
//   export const getProductVariants = async (req, res) => {
//     try {

//       const { id } = req.params;

//       const [rows] = await db.query(
//         `
//         SELECT
//           id,
//           variant_label,
//           price,
//           mrp,
//           stock
//         FROM product_variants
//         WHERE product_id = ?
//         ORDER BY quantity
//         `,
//         [id]
//       );

//       res.json(rows);

//     } catch (err) {

//       res.status(500).json({
//         message: err.message,
//       });

//     }
//   };
//   /* ================= UPDATE PRODUCT ================= */
//   export const updateProduct = async (req, res) => {
//     try {
//       const id = Number(req.params.id);
  
//       const {
//         name,
//         category_id,
//         subcategory_id,
//         description,
//         manufacture_date,
//         expiry_date,
//         images = [],
//         variants = [],
//         removedVariantIds = [],
//       } = req.body;
  
//       await db.query(
//     `
//     UPDATE products SET
//       name = ?,
//       category_id = ?,
//       subcategory_id = ?,
//       description = ?,
//       manufacture_date = ?,
//       expiry_date = ?,
//       images = ?
//     WHERE id = ?
//     `,
//     [
//       name,
//       category_id,
//       subcategory_id || null,
//       description || null,
//       manufacture_date || null,
//       expiry_date || null,
//       JSON.stringify(images),
//       id,
//     ]
//   );
//       if (removedVariantIds.length) {
//         await db.query(
//           "DELETE FROM product_variants WHERE id IN (?)",
//           [removedVariantIds]
//         );
//       }
  
//       for (const v of variants) {
//         if (!v.variant_label) continue;
  
//         if (v.id) {
//           const { quantity, unit } =
//     parseVariantLabel(v.variant_label);

//   await db.query(
//     `
//     UPDATE product_variants
//     SET
//       variant_label=?,
//       quantity=?,
//       unit=?,
//       price=?,
//       mrp=?,
//       stock=?,
//       is_free_delivery=?,
//       is_today_deal=?
//     WHERE id=?
//   `,
//   [
//     v.variant_label,
//     quantity,
//     unit,
//     v.price,
//     v.mrp,
//     v.stock,
//     v.is_free_delivery || 0,
//     v.is_today_deal || 0,
//     v.id
//   ]
// );
//       } else {
//         const { quantity, unit } =
//   parseVariantLabel(v.variant_label);

// await db.query(
//   `
//   INSERT INTO product_variants
//   (
//     product_id,
//     variant_label,
//     quantity,
//     unit,
//     price,
//     mrp,
//     stock,
//     is_free_delivery,
//     is_today_deal
//   )
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `,
//   [
//     id,
//     v.variant_label,
//     quantity,
//     unit,
//     v.price,
//     v.mrp,
//     v.stock,
//     v.is_free_delivery || 0,
//     v.is_today_deal || 0
//   ]
// );
//       }
//     }
 
//     res.json({ success: true });
//   } catch (err) {
//     console.error("UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
 
// /* ================= DELETE PRODUCT ================= */
// export const deleteProduct = async (req, res) => {
//   await db.query(
//     "DELETE FROM product_variants WHERE product_id = ?",
//     [req.params.id]
//   );
//   await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
//   res.json({ message: "Product deleted" });
// };
 
// /* ================= EXTRA ================= */
// export const getProductDetails = getProduct;
 
// export const getProductReviews = async (req, res) => {
//   const [rows] = await db.query(
//     "SELECT * FROM product_reviews WHERE product_id = ?",
//     [req.params.id]
//   );
//   res.json(rows);
// };
// /* ================= SIMILAR PRODUCTS ================= */
// /* ================= SIMILAR PRODUCTS ================= */
// export const getSimilarProducts = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const [productRows] = await db.query(
//       `
//       SELECT category_id, subcategory_id
//       FROM products
//       WHERE id = ?
//       `,
//       [productId]
//     );

//     if (productRows.length === 0) {
//       return res.status(404).json({
//         message: "Product not found",
//       });
//     }

//     const currentCategoryId = productRows[0].category_id;
//     const currentSubcategoryId = productRows[0].subcategory_id;

//     if (!currentSubcategoryId) {
//       return res.json([]);
//     }

//     const [rows] = await db.query(
//       `
//       SELECT 
//         p.*,

//         (
//           SELECT v.id
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS variant_id,

//         (
//           SELECT v.variant_label
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS variant_label,

//         ${PRICE_QUERY}

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p

//       WHERE
//         p.active = 1
//         AND p.id != ?
//         AND p.subcategory_id = ?

//       LIMIT 10
//       `,
//       [productId, currentSubcategoryId]
//     );

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.log("SIMILAR PRODUCTS ERROR:", err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };
// export const getSuggestedProducts = getSimilarProducts;
// /* ================= SEARCH ================= */

// export const searchProducts = async (req, res) => {

//   try {

//     const q =
//       req.query.q?.trim().toLowerCase() || "";

//     const [rows] = await db.query(

//       `
//       SELECT 
//         p.*,

//         c.name AS category_name,
//         s.name AS subcategory_name,

//         /* IMAGE */
//         p.image,

//         /* VARIANT */
        
// (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,
//         /* PRICE */
//         (
//           SELECT v.price
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           LIMIT 1
//         ) AS price,

//         /* MRP */
//         (
//           SELECT v.mrp
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           LIMIT 1
//         ) AS mrp,

//         /* STOCK */
//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

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

//       ORDER BY p.id DESC
//       `,

//       [
//         `%${q}%`,
//         `%${q}%`,
//         `%${q}%`
//       ]

//     );

//     res.json(rows);

//   } catch (err) {

//     console.log("SEARCH ERROR =>", err);

//     res.status(500).json({
//       message: "Search failed"
//     });

//   }

// };
// /* ================= TOP PICKS (HOME) ================= */
// export const getTopPicks = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         p.*,

        
//         (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//         (
//           SELECT v.price
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS price,

//         (
//           SELECT v.mrp
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS mrp,

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p
//       WHERE p.active = 1

// AND NOT EXISTS (
//   SELECT 1
//   FROM product_variants pv
//   WHERE pv.product_id = p.id
//     AND (
//       (pv.unit = 'kg' AND pv.quantity >= 3)
//       OR
//       (pv.unit = 'l' AND pv.quantity >= 3)
//       OR
//       (pv.unit = 'pack' AND pv.quantity >= 12)
//     )
// )

// ORDER BY p.id DESC
//       LIMIT 10
//     `);

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.error("TOP PICKS ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// }; 
// /* ================= OFFER ZONE PRODUCTS ================= */

// export const getOfferZoneProducts = async (req, res) => {
//   try {

//     const [offers] = await db.query(`
//      SELECT
//     bp.id AS id,
//     o.id AS offer_id,

//     bp.name,
//     bp.images,
//     bp.brand,
//     bp.description,
//     bp.category_id,
//     bp.subcategory_id,

//     o.buy_qty,
//     o.free_qty,

//     fp.name AS free_product_name,

    
//     (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,

//     (
//       SELECT price
//       FROM product_variants
//       WHERE product_id = bp.id
//       ORDER BY price
//       LIMIT 1
//     ) AS price,

//     (
//       SELECT mrp
//       FROM product_variants
//       WHERE product_id = bp.id
//       ORDER BY price
//       LIMIT 1
//     ) AS mrp,

//     (
//       SELECT SUM(stock)
//       FROM product_variants
//       WHERE product_id = bp.id
//     ) AS stock

// FROM offers o

// JOIN products bp
// ON bp.id = o.buy_product_id

// JOIN products fp
// ON fp.id = o.free_product_id

// WHERE o.active = 1;
//     `);

//     res.json(offers);

//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       message: err.message
//     });
//   }
// };
// export const getFreeDeliveryProducts = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT DISTINCT p.*, pv.variant_label, pv.price, pv.mrp, pv.stock
//       FROM products p
//       JOIN product_variants pv ON p.id = pv.product_id
//       WHERE p.active = 1
//       AND pv.is_free_delivery = 1
//     `);

//     res.json(normalizeProducts(rows));
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// export const getTodayDealsProducts = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         p.id,
//         p.name,
//         p.image,
//         p.images,
//         p.is_today_deal,
//         p.deal_discount_percent,
//         p.deal_expires_at,

//         pv.id AS variant_id,
//         pv.variant_label,
//         pv.price,
//         pv.mrp,
//         pv.stock

//       FROM products p
//       JOIN product_variants pv
//         ON p.id = pv.product_id

//       WHERE
//         p.active = 1
//         AND p.is_today_deal = 1
//         AND p.deal_expires_at IS NOT NULL
//         AND p.deal_expires_at > NOW()
//         AND pv.stock > 0

//       ORDER BY p.deal_expires_at ASC, p.id DESC
//     `);

//     res.json(normalizeProducts(rows));
//   } catch (err) {
//     console.log("TODAY DEALS ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getHalfPriceProducts = async (req, res) => {
//   try {

//     const [rows] = await db.query(`
//       SELECT DISTINCT
//         p.*,
//         pv.variant_label,
//         pv.price,
//         pv.mrp,
//         pv.stock,

//         ROUND(
//           ((pv.mrp - pv.price) / pv.mrp) * 100
//         ) AS discount_percentage

//       FROM products p

//       JOIN product_variants pv
//       ON p.id = pv.product_id

//       WHERE
//         p.active = 1
//         AND pv.mrp IS NOT NULL
//         AND pv.mrp > pv.price

//         AND ROUND(
//           ((pv.mrp - pv.price) / pv.mrp) * 100
//         ) >= 50

//       ORDER BY discount_percentage DESC
//     `);

//     res.json(normalizeProducts(rows));

//   } catch (err) {

//     console.log("50% OFF ERROR:", err);

//     res.status(500).json({
//       message: err.message
//     });

//   }
// };
// export const getSuperStoreProducts = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT DISTINCT p.*
//       FROM products p
//       JOIN product_variants pv
//         ON pv.product_id = p.id
//       WHERE p.active = 1
//         AND p.status = 'ACTIVE'
//         AND (
//           (pv.unit = 'kg' AND pv.quantity >= 3)
//           OR
//           (pv.unit = 'l' AND pv.quantity >= 3)
//           OR
//           (pv.unit = 'pack' AND pv.quantity >= 12)
//         )
//       ORDER BY p.created_at DESC
//     `);

//     console.log("SUPER STORE PRODUCTS:", rows);

//     return res.json(rows);

//   } catch (err) {
//     console.error("SUPER STORE ERROR:", err);

//     return res.status(500).json({
//       message: err.message
//     });
//   }
// };
// export const getGroupedProducts = async (req, res) => {
//   try {
//     const [categories] = await db.query(`SELECT * FROM categories`);

//     const [products] = await db.query(`
//       SELECT p.*, c.name AS category_name,

//       ${PRICE_QUERY}

//       (
//         SELECT SUM(v.stock)
//         FROM product_variants v
//         WHERE v.product_id = p.id
//       ) AS stock

//       FROM products p
//       JOIN categories c ON c.id = p.category_id
//       WHERE p.active = 1
//     `);

//     const grouped = {};

//     // initialize all categories
//     categories.forEach((c) => {
//       grouped[c.name] = [];
//     });

//     normalizeProducts(products).forEach((p) => {
//       grouped[p.category_name].push(p);
//     });

//     res.json(grouped);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// /* ================= REVENUE STATS ================= */
// const normalizeProducts = (rows) => {
//   return rows.map((p) => {
//     let images = [];

//     try {
//       images =
//         typeof p.images === "string"
//           ? JSON.parse(p.images)
//           : p.images || [];
//     } catch (e) {
//       console.log("Image parse error:", p.id);
//       images = [];
//     }

//     const formatted = images.map((img) => ({
//       url: img.url?.startsWith("http")
//         ? img.url
//         : `http://localhost:4000${img.url}`,
//     }));

//     return {
//       ...p,

//       images: formatted,

//       // 🔥 FIX: fallback added
//       image:
//         p.image
//           ? p.image.startsWith("http")
//             ? p.image
//             : `http://localhost:4000${p.image}`
//           : formatted[0]?.url || "/placeholder.png",

//       price: Number(p.price) || 0,
//       mrp: Number(p.mrp) || 0,
//       stock: Number(p.stock) || 0,
//     };
//   });
// };
// /* ================= CART SUGGESTIONS ================= */
// export const getCartSuggestions = async (req, res) => {
//   try {
//     const productId = req.params.id;

//     const [product] = await db.query(
//       "SELECT category_id FROM products WHERE id = ?",
//       [productId]
//     );

//     if (!product.length) {
//       return res.json([]);
//     }

//     const categoryId = product[0].category_id;

//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,

//        (
//   SELECT v.id
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_id,

// (
//   SELECT v.variant_label
//   FROM product_variants v
//   WHERE v.product_id = p.id
//   ORDER BY v.price ASC
//   LIMIT 1
// ) AS variant_label,


//         (
//           SELECT v.price
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS price,

//         (
//           SELECT v.mrp
//           FROM product_variants v
//           WHERE v.product_id = p.id
//           ORDER BY v.price ASC
//           LIMIT 1
//         ) AS mrp,

//         (
//           SELECT SUM(v.stock)
//           FROM product_variants v
//           WHERE v.product_id = p.id
//         ) AS stock

//       FROM products p
//       WHERE p.category_id = ?
//       AND p.id != ?
//       AND p.active = 1
//       LIMIT 10
//       `,
//       [categoryId, productId]
//     );

//     res.json(normalizeProducts(rows));

//   } catch (err) {
//     console.error("CART SUGGESTIONS ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// export const bulkUploadProducts = async (req, res) => {
//   try {
//     const excelFile = req.files["file"][0];
//     const imageFiles = req.files["images"] || [];

//     const workbook = XLSX.readFile(excelFile.path);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const rows = XLSX.utils.sheet_to_json(sheet);

//     // ✅ Map images
//     const imageMap = {};
//     imageFiles.forEach((file) => {
//       imageMap[file.originalname] = file.filename;
//     });

//     const errors = [];

//     for (const r of rows) {
//       try {
//         if (!r.name || !r.category_id || !r.variant_label) {
//           throw new Error("Missing required fields");
//         }

//         const category_id = Number(r.category_id);
//         const subcategory_id = r.subcategory_id
//           ? Number(r.subcategory_id)
//           : null;

//         const price = Number(r.price) || 0;
//         const mrp = Number(r.mrp) || 0;
//         const stock = Number(r.stock) || 0;

//         // ================= IMAGE LOGIC =================
//         let imagesArray = [];

//         if (r.images) {
//           const imageList = r.images.split(",").map((img) => img.trim());

//           imagesArray = imageList
//             .map((img) => {
//               if (img.startsWith("http")) return { url: img };

//               if (imageMap[img]) {
//                 return { url: `/uploads/products/${imageMap[img]}` };
//               }

//               return null;
//             })
//             .filter(Boolean);
//         }

//         if (imagesArray.length === 0) {
//           imagesArray.push({ url: "/uploads/products/default.png" });
//         }
//         // =================================================

//         // ✅ Check product
//         const [existingProduct] = await db.query(
//           "SELECT id FROM products WHERE name=? AND category_id=?",
//           [r.name, category_id]
//         );

//         let productId;

//         if (!existingProduct.length) {

//   const [productResult] = await db.query(
//     `
//     INSERT INTO products
//     (
//       name,
//       category_id,
//       subcategory_id,
//       brand,
//       images,
//       active
//     )
//     VALUES (?, ?, ?, ?, ?, ?)
//     `,
//     [
//       r.name,
//       category_id,
//       subcategory_id,
//       r.brand || null,
//       JSON.stringify(imagesArray),
//       1
//     ]
//   );

//   productId = productResult.insertId;

// } else {
//   productId = existingProduct[0].id;
// }

//         // ✅ Check if variant already exists
//         const [existingVariant] = await db.query(
//           `SELECT id FROM product_variants 
//            WHERE product_id = ? AND variant_label = ?`,
//           [productId, r.variant_label]
//         );

//         let variantId;

//         if (!existingVariant.length) {
//           // 👉 create new variant
//           const [variantResult] = await db.query(
//             `INSERT INTO product_variants
//             (product_id, variant_label, price, mrp, stock)
//             VALUES (?, ?, ?, ?, ?)`,
//             [productId, r.variant_label, price, mrp, stock]
//           );

//           variantId = variantResult.insertId;
//         } else {
//           // 👉 update existing variant
//           variantId = existingVariant[0].id;

//           await db.query(
//             `UPDATE product_variants
//              SET price=?, mrp=?, stock=?
//              WHERE id=?`,
//             [price, mrp, stock, variantId]
//           );
//         }

//         // ✅ SMART PRICE INSERT (ONLY IF CHANGED)
//         const [lastPrice] = await db.query(
//           `SELECT selling_price FROM product_prices
//            WHERE variant_id = ?
//            ORDER BY created_at DESC
//            LIMIT 1`,
//           [variantId]
//         );

//         if (
//           !lastPrice.length ||
//           Number(lastPrice[0].selling_price) !== price
//         ) {
//           await db.query(
//             `
//             INSERT INTO product_prices
//             (variant_id, selling_price, mrp, created_at)
//             VALUES (?, ?, ?, NOW())
//             `,
//             [variantId, price, mrp]
//           );
//         }

//       } catch (err) {
//         errors.push({
//           row: r,
//           error: err.message,
//         });
//       }
//     }

//     res.json({
//       message: "Bulk upload completed",
//       errors,
//     });

//   } catch (err) {
//     console.error("BULK UPLOAD ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// export const updateProductPrice = async (req, res) => {
//   try {
//     const { variant_id, price, mrp } = req.body;

//     if (!variant_id || !price) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // ✅ UPDATE MAIN TABLE
//     await db.query(
//       `UPDATE product_variants SET price=?, mrp=? WHERE id=?`,
//       [price, mrp || null, variant_id]
//     );

//     // ✅ INSERT HISTORY
//     await db.query(
//       `INSERT INTO product_prices 
//        (variant_id, selling_price, mrp, created_at)
//        VALUES (?, ?, ?, NOW())`,
//       [variant_id, price, mrp || null]
//     );

//     res.json({ message: "Price updated successfully" });

//   } catch (err) {
//     console.error("PRICE UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
// export const bulkUpdatePrice = async (req, res) => {
//   try {
//     const updates = req.body;

//     for (const item of updates) {
//       const { variant_id, price, mrp } = item;

//       // update main table
//       await db.query(
//         "UPDATE product_variants SET price=?, mrp=? WHERE id=?",
//         [price, mrp, variant_id]
//       );

//       // insert history
//       await db.query(
//         `INSERT INTO product_prices 
//          (variant_id, selling_price, mrp, created_at)
//          VALUES (?, ?, ?, NOW())`,
//         [variant_id, price, mrp]
//       );
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error("BULK UPDATE ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= ADMIN: SET/UPDATE A DEAL (direct expiry, no duration math) ================= */
// export const setProductDeal = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { discount_percent, expires_at } = req.body;

//     if (!discount_percent || discount_percent <= 0 || discount_percent >= 100) {
//       return res.status(400).json({ message: "discount_percent must be between 1 and 99" });
//     }
//     if (!expires_at) {
//       return res.status(400).json({ message: "expires_at (a real date/time) is required" });
//     }

//     // "2026-07-27T11:30" (from <input type="datetime-local">) -> "2026-07-27 11:30:00" (MySQL DATETIME)
//     const mysqlExpiresAt = toMysqlDatetime(expires_at);

//     await db.query(
//       `UPDATE products
//        SET is_today_deal = 1,
//            deal_discount_percent = ?,
//            deal_expires_at = ?
//        WHERE id = ?`,
//       [discount_percent, mysqlExpiresAt, id]
//     );

//     res.json({ success: true, message: "Deal saved" });
//   } catch (err) {
//     console.error("SET DEAL ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= ADMIN: REMOVE A PRODUCT FROM DEAL ================= */
// export const removeProductDeal = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await db.query(
//       `UPDATE products
//        SET is_today_deal = 0,
//            deal_discount_percent = NULL,
//            deal_expires_at = NULL
//        WHERE id = ?`,
//       [id]
//     );

//     res.json({ success: true, message: "Removed from deal" });
//   } catch (err) {
//     console.error("REMOVE DEAL ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// /* ================= ADMIN: SET SAME EXPIRY FOR ALL ACTIVE DEALS (direct datetime, not hours) ================= */
// export const syncDealExpiry = async (req, res) => {
//   try {
//     const { expires_at } = req.body;
//     if (!expires_at) {
//       return res.status(400).json({ message: "expires_at is required" });
//     }

//     // Same conversion as setProductDeal — keeps MySQL happy
//     const mysqlExpiresAt = toMysqlDatetime(expires_at);

//     await db.query(
//       `UPDATE products SET deal_expires_at = ? WHERE is_today_deal = 1`,
//       [mysqlExpiresAt]
//     );

//     res.json({ success: true, message: "All Today's Deal products now share the same expiry" });
//   } catch (err) {
//     console.error("SYNC EXPIRY ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

import db from "../config/db.js";
import XLSX from "xlsx";

/* ================= COMMON PRICE QUERY ================= */
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
`;

/* ================= DATETIME HELPER ================= */
/**
 * Converts a browser <input type="datetime-local"> value
 * ("2026-07-27T11:30" or "2026-07-27T11:30:45") into a
 * MySQL-safe DATETIME string ("2026-07-27 11:30:00" / "2026-07-27 11:30:45").
 * Returns null if given a falsy value.
 */
function toMysqlDatetime(localDatetimeStr) {
  if (!localDatetimeStr) return null;
  const withSpace = localDatetimeStr.replace("T", " ");
  return withSpace.length === 16 ? `${withSpace}:00` : withSpace;
}

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
    res.status(500).json({ message: err.message });
  }
};
function parseVariantLabel(label) {
  const cleaned = label.trim().toLowerCase();

  const match = cleaned.match(
    /^(\d+(?:\.\d+)?)\s*(kg|g|l|ml|pack|packs)$/i
  );

  if (!match) {
    return {
      quantity: null,
      unit: null,
    };
  }

  return {
    quantity: Number(match[1]),
    unit: match[2] === "packs" ? "pack" : match[2].toLowerCase(),
  };
}
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
      images = [],
      variants = [],
    } = req.body;

    /* ================= CREATE PRODUCT ================= */

    const [result] = await db.query(
      `
      INSERT INTO products
      (
        name,
        category_id,
        subcategory_id,
        description,
        manufacture_date,
        expiry_date,
        brand,
        images,
        active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        category_id,
        subcategory_id || null,
        description || null,
        manufacture_date || null,
        expiry_date || null,
        brand || null,
        JSON.stringify(images),
        1,
      ]
    );

    const productId = result.insertId;

    /* ================= CREATE VARIANTS ================= */

    for (const v of variants) {

      if (!v.variant_label) continue;

      const { quantity, unit } =
  parseVariantLabel(v.variant_label);

await db.query(
  `
  INSERT INTO product_variants
  (
    product_id,
    variant_label,
    quantity,
    unit,
    price,
    mrp,
    stock,
    is_free_delivery,
    is_today_deal
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    productId,
    v.variant_label,
    quantity,
    unit,
    v.price ? Number(v.price) : 0,
    v.mrp ? Number(v.mrp) : null,
    v.stock ? Number(v.stock) : 0,
    v.is_free_delivery || 0,
    v.is_today_deal || 0,
  ]
);
    }

    res.json({
      success: true,
      productId,
    });

  } catch (err) {

    console.log("CREATE PRODUCT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });

  }
};
 
/* ================= GET PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    
    const [rows] = await db.query(
  `
  SELECT 
    p.*,

    c.name AS category_name,
    s.name AS subcategory_name,

   
    (
  SELECT v.id
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_id,

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
  SELECT v.id
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_id,

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
ORDER BY p.id DESC`,
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

        (
          SELECT v.id
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS variant_id,

        (
          SELECT v.variant_label
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS variant_label,

          COALESCE(
            (
              SELECT v.price
              FROM product_variants v
              WHERE v.product_id = p.id
              ORDER BY v.price ASC
              LIMIT 1
            ), 0
          ) AS price,

          COALESCE(
            (
              SELECT SUM(v.stock)
              FROM product_variants v
              WHERE v.product_id = p.id
            ), 0
          ) AS stock

        FROM products p
        WHERE p.subcategory_id = ?
        AND p.active = 1
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

    /* GET ALL VARIANTS — ordered the same way as everywhere else,
      so variants[0] always matches the "default variant" every
      other endpoint (Home, Similar Products, etc.) resolves to. */
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
      ORDER BY price ASC
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
/* ================= GET PRODUCT VARIANTS ================= */
export const getProductVariants = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        id,
        variant_label,
        price,
        mrp,
        stock
      FROM product_variants
      WHERE product_id = ?
      ORDER BY quantity
      `,
      [id]
    );

    res.json(rows);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

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
        const { quantity, unit } =
  parseVariantLabel(v.variant_label);

await db.query(
  `
  UPDATE product_variants
  SET
    variant_label=?,
    quantity=?,
    unit=?,
    price=?,
    mrp=?,
    stock=?,
    is_free_delivery=?,
    is_today_deal=?
  WHERE id=?
`,
[
  v.variant_label,
  quantity,
  unit,
  v.price,
  v.mrp,
  v.stock,
  v.is_free_delivery || 0,
  v.is_today_deal || 0,
  v.id
]
);
    } else {
      const { quantity, unit } =
parseVariantLabel(v.variant_label);

await db.query(
`
INSERT INTO product_variants
(
  product_id,
  variant_label,
  quantity,
  unit,
  price,
  mrp,
  stock,
  is_free_delivery,
  is_today_deal
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
[
  id,
  v.variant_label,
  quantity,
  unit,
  v.price,
  v.mrp,
  v.stock,
  v.is_free_delivery || 0,
  v.is_today_deal || 0
]
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
  const connection = await db.getConnection();

  try {
    const productId = req.params.id;

    console.log("DELETE PRODUCT ID:", productId);

    await connection.beginTransaction();

    // 1. Delete product prices belonging to this product's variants
    await connection.query(
      `DELETE pp
       FROM product_prices pp
       INNER JOIN product_variants pv
       ON pp.variant_id = pv.id
       WHERE pv.product_id = ?`,
      [productId]
    );

    // 2. Delete product variants
    await connection.query(
      "DELETE FROM product_variants WHERE product_id = ?",
      [productId]
    );

    // 3. Delete the product
    const [result] = await connection.query(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (err) {
    await connection.rollback();

    console.error("DELETE PRODUCT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: err.message,
    });

  } finally {
    connection.release();
  }
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

    const [productRows] = await db.query(
      `
      SELECT category_id, subcategory_id
      FROM products
      WHERE id = ?
      `,
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const currentCategoryId = productRows[0].category_id;
    const currentSubcategoryId = productRows[0].subcategory_id;

    if (!currentSubcategoryId) {
      return res.json([]);
    }

    const [rows] = await db.query(
      `
      SELECT 
        p.*,

        (
          SELECT v.id
          FROM product_variants v
          WHERE v.product_id = p.id
          ORDER BY v.price ASC
          LIMIT 1
        ) AS variant_id,

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

      WHERE
        p.active = 1
        AND p.id != ?
        AND p.subcategory_id = ?

      LIMIT 10
      `,
      [productId, currentSubcategoryId]
    );

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.log("SIMILAR PRODUCTS ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};
export const getSuggestedProducts = getSimilarProducts;
/* ================= SEARCH ================= */

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
  SELECT v.id
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_id,

(
  SELECT v.variant_label
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
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
  SELECT v.id
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_id,

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

AND NOT EXISTS (
  SELECT 1
  FROM product_variants pv
  WHERE pv.product_id = p.id
    AND (
      (pv.unit = 'kg' AND pv.quantity >= 3)
      OR
      (pv.unit = 'l' AND pv.quantity >= 3)
      OR
      (pv.unit = 'pack' AND pv.quantity >= 12)
    )
)

ORDER BY p.id DESC
      LIMIT 10
    `);

    res.json(normalizeProducts(rows));

  } catch (err) {
    console.error("TOP PICKS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}; 
/* ================= OFFER ZONE PRODUCTS ================= */

export const getOfferZoneProducts = async (req, res) => {
  try {

    const [offers] = await db.query(`
     SELECT
    bp.id AS id,
    o.id AS offer_id,

    bp.name,
    bp.images,
    bp.brand,
    bp.description,
    bp.category_id,
    bp.subcategory_id,

    o.buy_qty,
    o.free_qty,

    fp.name AS free_product_name,

    
    (
  SELECT v.id
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_id,

(
  SELECT v.variant_label
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_label,

    (
      SELECT price
      FROM product_variants
      WHERE product_id = bp.id
      ORDER BY price
      LIMIT 1
    ) AS price,

    (
      SELECT mrp
      FROM product_variants
      WHERE product_id = bp.id
      ORDER BY price
      LIMIT 1
    ) AS mrp,

    (
      SELECT SUM(stock)
      FROM product_variants
      WHERE product_id = bp.id
    ) AS stock

FROM offers o

JOIN products bp
ON bp.id = o.buy_product_id

JOIN products fp
ON fp.id = o.free_product_id

WHERE o.active = 1;
    `);

    res.json(offers);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message
    });
  }
};
export const getFreeDeliveryProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT p.*, pv.variant_label, pv.price, pv.mrp, pv.stock
      FROM products p
      JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.active = 1
      AND pv.is_free_delivery = 1
    `);

    res.json(normalizeProducts(rows));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getTodayDealsProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.id,
        p.name,
        p.image,
        p.images,
        p.is_today_deal,
        p.deal_discount_percent,
        p.deal_expires_at,

        pv.id AS variant_id,
        pv.variant_label,
        pv.price,
        pv.mrp,
        pv.stock

      FROM products p
      JOIN product_variants pv
        ON p.id = pv.product_id

      WHERE
        p.active = 1
        AND p.is_today_deal = 1
        AND p.deal_expires_at IS NOT NULL
        AND p.deal_expires_at > NOW()
        AND pv.stock > 0

      ORDER BY p.deal_expires_at ASC, p.id DESC
    `);

    res.json(normalizeProducts(rows));
  } catch (err) {
    console.log("TODAY DEALS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getHalfPriceProducts = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT DISTINCT
        p.*,
        pv.variant_label,
        pv.price,
        pv.mrp,
        pv.stock,

        ROUND(
          ((pv.mrp - pv.price) / pv.mrp) * 100
        ) AS discount_percentage

      FROM products p

      JOIN product_variants pv
      ON p.id = pv.product_id

      WHERE
        p.active = 1
        AND pv.mrp IS NOT NULL
        AND pv.mrp > pv.price

        AND ROUND(
          ((pv.mrp - pv.price) / pv.mrp) * 100
        ) >= 50

      ORDER BY discount_percentage DESC
    `);

    res.json(normalizeProducts(rows));

  } catch (err) {

    console.log("50% OFF ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }
};
export const getSuperStoreProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT p.*
      FROM products p
      JOIN product_variants pv
        ON pv.product_id = p.id
      WHERE p.active = 1
        AND p.status = 'ACTIVE'
        AND (
          (pv.unit = 'kg' AND pv.quantity >= 3)
          OR
          (pv.unit = 'l' AND pv.quantity >= 3)
          OR
          (pv.unit = 'pack' AND pv.quantity >= 12)
        )
      ORDER BY p.created_at DESC
    `);

    console.log("SUPER STORE PRODUCTS:", rows);

    return res.json(rows);

  } catch (err) {
    console.error("SUPER STORE ERROR:", err);

    return res.status(500).json({
      message: err.message
    });
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
/* ================= REVENUE STATS ================= */
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
  SELECT v.id
  FROM product_variants v
  WHERE v.product_id = p.id
  ORDER BY v.price ASC
  LIMIT 1
) AS variant_id,

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

    // ================= IMAGE MAP =================
    // originalname -> saved filename, used to resolve any image
    // reference (single or comma-separated list) below.
    const imageMap = {};
    imageFiles.forEach((file) => {
      imageMap[file.originalname] = file.filename;
    });

    // Resolves a raw image cell ("a.jpg,https://x.com/b.png") into
    // a normalized array of { url } objects, falling back to the
    // default product image when nothing usable is found.
    const resolveImages = (raw) => {
      if (!raw) return [];
      return String(raw)
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean)
        .map((img) => {
          if (img.startsWith("http")) return { url: img };
          if (imageMap[img]) return { url: `/uploads/products/${imageMap[img]}` };
          return null;
        })
        .filter(Boolean);
    };

    const errors = [];

    // Supports two upload formats:
    //   1) Two-sheet workbook: "Products" + "Product_Variants" sheets
    //      (richer fields: brand, description, highlights, tags,
    //      return_policy, status, SKU, quantity, unit, free delivery,
    //      today deal — categories/subcategories resolved by name)
    //   2) Single flat sheet (first sheet in the workbook) with one
    //      row per variant and category_id/subcategory_id given directly
    const productsSheet = workbook.Sheets["Products"];
    const variantsSheet = workbook.Sheets["Product_Variants"];

    if (productsSheet && variantsSheet) {
      // ===================================================
      // FORMAT 1: TWO-SHEET WORKBOOK
      // ===================================================
      const products = XLSX.utils.sheet_to_json(productsSheet);
      const variants = XLSX.utils.sheet_to_json(variantsSheet);

      const productMap = {};

      // ---------------- INSERT / MATCH PRODUCTS ----------------
      for (const p of products) {
        try {
          const productName = String(p["Product Name"]).trim();
          const categoryName = String(p["Category"]).trim();

          // ---------- CATEGORY ----------
          const [category] = await db.query(
            "SELECT id FROM categories WHERE LOWER(name)=LOWER(?)",
            [categoryName]
          );

          if (!category.length) {
            throw new Error(`Category '${categoryName}' not found`);
          }

          const category_id = category[0].id;

          // ---------- SUBCATEGORY ----------
          let subcategory_id = null;

          if (p["Subcategory"]) {
            const [subcategory] = await db.query(
              `SELECT id FROM subcategories WHERE name=? AND category_id=?`,
              [p["Subcategory"], category_id]
            );

            if (subcategory.length) {
              subcategory_id = subcategory[0].id;
            }
          }

          // ---------- IMAGES ----------
          // Accepts either a single "Image URL" cell or a comma
          // separated "Images" cell referencing uploaded files/URLs.
          let imagesArray = resolveImages(p["Images"] || p["Image URL"]);

          if (imagesArray.length === 0) {
            imagesArray.push({ url: "/uploads/products/default.png" });
          }

          // ---------- CHECK PRODUCT ----------
          const [existingProduct] = await db.query(
            `SELECT id FROM products WHERE name=? AND category_id=?`,
            [productName, category_id]
          );

          let productId;

          if (!existingProduct.length) {
            const [productResult] = await db.query(
              `
              INSERT INTO products
              (
                name,
                category_id,
                subcategory_id,
                brand,
                description,
                highlights,
                tags,
                return_policy,
                images,
                active,
                status
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                productName,
                category_id,
                subcategory_id,
                p["Brand"] || "",
                p["Description"] || "",
                p["Highlights"] || "",
                p["Tags"] || "",
                p["Return Policy"] || "",
                JSON.stringify(imagesArray),
                Number(p["Active"]) || 1,
                p["Status"] || "ACTIVE",
              ]
            );

            productId = productResult.insertId;
          } else {
            productId = existingProduct[0].id;
          }

          productMap[productName] = productId;
        } catch (err) {
          errors.push({
            sheet: "Products",
            product: p["Product Name"],
            error: err.message,
          });
        }
      }

      // ---------------- INSERT / UPDATE VARIANTS ----------------
      for (const v of variants) {
        try {
          const productName = String(v["Product Name"]).trim();
          const productId = productMap[productName];

          if (!productId) {
            throw new Error(`Product '${productName}' not found in Products sheet`);
          }

          const variantLabel = String(v["Variant Label"]).trim();
          const quantity = Number(v["Quantity"]) || 0;
          const unit = String(v["Unit"] || "").trim().toLowerCase();
          const price = Number(v["Price"]) || 0;
          const mrp = Number(v["MRP"]) || 0;
          const stock = Number(v["Stock"]) || 0;
          const sku = v["SKU"] || "";
          const freeDelivery = Number(v["Free Delivery"]) === 1 ? 1 : 0;
          const todayDeal = Number(v["Today Deal"]) === 1 ? 1 : 0;

          const [existingVariant] = await db.query(
            `SELECT id FROM product_variants WHERE product_id=? AND variant_label=?`,
            [productId, variantLabel]
          );

          let variantId;

          if (!existingVariant.length) {
            const [variantResult] = await db.query(
              `
              INSERT INTO product_variants
              (
                product_id,
                variant_label,
                price,
                mrp,
                sku,
                stock,
                is_free_delivery,
                is_today_deal,
                quantity,
                unit
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [productId, variantLabel, price, mrp, sku, stock, freeDelivery, todayDeal, quantity, unit]
            );

            variantId = variantResult.insertId;
          } else {
            variantId = existingVariant[0].id;

            await db.query(
              `
              UPDATE product_variants
              SET
                price=?,
                mrp=?,
                sku=?,
                stock=?,
                is_free_delivery=?,
                is_today_deal=?,
                quantity=?,
                unit=?
              WHERE id=?
              `,
              [price, mrp, sku, stock, freeDelivery, todayDeal, quantity, unit, variantId]
            );
          }

          // ---------------- SMART PRICE HISTORY (ONLY IF CHANGED) ----------------
          const [lastPrice] = await db.query(
            `SELECT selling_price FROM product_prices WHERE variant_id=? ORDER BY created_at DESC LIMIT 1`,
            [variantId]
          );

          if (!lastPrice.length || Number(lastPrice[0].selling_price) !== price) {
            await db.query(
              `
              INSERT INTO product_prices (variant_id, selling_price, mrp, created_at)
              VALUES (?, ?, ?, NOW())
              `,
              [variantId, price, mrp]
            );
          }
        } catch (err) {
          errors.push({
            sheet: "Product_Variants",
            product: v["Product Name"],
            variant: v["Variant Label"],
            error: err.message,
          });
        }
      }

      return res.json({
        success: errors.length === 0,
        message: "Bulk upload completed",
        productsProcessed: Object.keys(productMap).length,
        variantsProcessed: variants.length,
        errors,
      });
    }

    // ===================================================
    // FORMAT 2: SINGLE FLAT SHEET (one row per variant)
    // ===================================================
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const r of rows) {
      try {
        if (!r.name || !r.category_id || !r.variant_label) {
          throw new Error("Missing required fields");
        }

        const category_id = Number(r.category_id);
        const subcategory_id = r.subcategory_id ? Number(r.subcategory_id) : null;

        const price = Number(r.price) || 0;
        const mrp = Number(r.mrp) || 0;
        const stock = Number(r.stock) || 0;
        const sku = r.sku || "";
        const quantity = Number(r.quantity) || 0;
        const unit = String(r.unit || "").trim().toLowerCase();
        const freeDelivery = Number(r.is_free_delivery) === 1 ? 1 : 0;
        const todayDeal = Number(r.is_today_deal) === 1 ? 1 : 0;

        // ================= IMAGE LOGIC =================
        let imagesArray = resolveImages(r.images);

        if (imagesArray.length === 0) {
          imagesArray.push({ url: "/uploads/products/default.png" });
        }
        // =================================================

        const [existingProduct] = await db.query(
          "SELECT id FROM products WHERE name=? AND category_id=?",
          [r.name, category_id]
        );

        let productId;

        if (!existingProduct.length) {
          const [productResult] = await db.query(
            `
            INSERT INTO products
            (
              name,
              category_id,
              subcategory_id,
              brand,
              images,
              active
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [r.name, category_id, subcategory_id, r.brand || null, JSON.stringify(imagesArray), 1]
          );

          productId = productResult.insertId;
        } else {
          productId = existingProduct[0].id;
        }

        const [existingVariant] = await db.query(
          `SELECT id FROM product_variants WHERE product_id = ? AND variant_label = ?`,
          [productId, r.variant_label]
        );

        let variantId;

        if (!existingVariant.length) {
          const [variantResult] = await db.query(
            `
            INSERT INTO product_variants
            (product_id, variant_label, price, mrp, sku, stock, is_free_delivery, is_today_deal, quantity, unit)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [productId, r.variant_label, price, mrp, sku, stock, freeDelivery, todayDeal, quantity, unit]
          );

          variantId = variantResult.insertId;
        } else {
          variantId = existingVariant[0].id;

          await db.query(
            `
            UPDATE product_variants
            SET price=?, mrp=?, sku=?, stock=?, is_free_delivery=?, is_today_deal=?, quantity=?, unit=?
            WHERE id=?
            `,
            [price, mrp, sku, stock, freeDelivery, todayDeal, quantity, unit, variantId]
          );
        }

        // ✅ SMART PRICE INSERT (ONLY IF CHANGED)
        const [lastPrice] = await db.query(
          `SELECT selling_price FROM product_prices WHERE variant_id = ? ORDER BY created_at DESC LIMIT 1`,
          [variantId]
        );

        if (!lastPrice.length || Number(lastPrice[0].selling_price) !== price) {
          await db.query(
            `
            INSERT INTO product_prices (variant_id, selling_price, mrp, created_at)
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
      success: errors.length === 0,
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

/* ================= ADMIN: SET/UPDATE A DEAL (direct expiry, no duration math) ================= */
export const setProductDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount_percent, expires_at } = req.body;

    if (!discount_percent || discount_percent <= 0 || discount_percent >= 100) {
      return res.status(400).json({ message: "discount_percent must be between 1 and 99" });
    }
    if (!expires_at) {
      return res.status(400).json({ message: "expires_at (a real date/time) is required" });
    }

    // "2026-07-27T11:30" (from <input type="datetime-local">) -> "2026-07-27 11:30:00" (MySQL DATETIME)
    const mysqlExpiresAt = toMysqlDatetime(expires_at);

    await db.query(
      `UPDATE products
       SET is_today_deal = 1,
           deal_discount_percent = ?,
           deal_expires_at = ?
       WHERE id = ?`,
      [discount_percent, mysqlExpiresAt, id]
    );

    res.json({ success: true, message: "Deal saved" });
  } catch (err) {
    console.error("SET DEAL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN: REMOVE A PRODUCT FROM DEAL ================= */
export const removeProductDeal = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE products
       SET is_today_deal = 0,
           deal_discount_percent = NULL,
           deal_expires_at = NULL
       WHERE id = ?`,
      [id]
    );

    res.json({ success: true, message: "Removed from deal" });
  } catch (err) {
    console.error("REMOVE DEAL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN: SET SAME EXPIRY FOR ALL ACTIVE DEALS (direct datetime, not hours) ================= */
export const syncDealExpiry = async (req, res) => {
  try {
    const { expires_at } = req.body;
    if (!expires_at) {
      return res.status(400).json({ message: "expires_at is required" });
    }

    // Same conversion as setProductDeal — keeps MySQL happy
    const mysqlExpiresAt = toMysqlDatetime(expires_at);

    await db.query(
      `UPDATE products SET deal_expires_at = ? WHERE is_today_deal = 1`,
      [mysqlExpiresAt]
    );

    res.json({ success: true, message: "All Today's Deal products now share the same expiry" });
  } catch (err) {
    console.error("SYNC EXPIRY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};