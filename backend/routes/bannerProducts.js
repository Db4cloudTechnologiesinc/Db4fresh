import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ===============================
   COMMON BASE QUERY
================================ */
const baseQuery = `
  SELECT
    p.id,
    p.name,
    p.brand,
    p.image,
    p.images,
    p.expiry_date,
    p.category_id,

    MIN(pv.price) AS price,
    SUM(pv.stock) AS stock,
    MIN(pv.mrp) AS mrp,
    MIN(pv.variant_label) AS variant_label,

    ROUND(
      ((MIN(pv.mrp) - MIN(pv.price)) / MIN(pv.mrp)) * 100
    ) AS discount

  FROM products p
  LEFT JOIN product_variants pv
    ON pv.product_id = p.id
`;

/* ===============================
   GET PRODUCTS BY BANNER TYPE
================================ */
router.get("/:type", async (req, res) => {
  const { type } = req.params;

  try {
    let query = "";

    switch (type) {

      /* =====================================================
         🟢 FREE DELIVERY
         Existing Free Delivery + ALL FRUITS + VEGETABLES
      ===================================================== */
      case "free-delivery":
        query = `
          SELECT
            p.*,
            pv.id AS variant_id,
            pv.variant_label,
            pv.price,
            pv.mrp,
            pv.stock

          FROM products p

          JOIN product_variants pv
            ON pv.product_id = p.id

          LEFT JOIN categories c
            ON c.id = p.category_id

          WHERE
            p.active = 1
            AND p.status = 'ACTIVE'
            AND pv.stock > 0

            AND
            (
              /* Existing Free Delivery products */
              (
                pv.is_free_delivery = 1
                AND pv.price = (
                  SELECT MIN(pv2.price)
                  FROM product_variants pv2
                  WHERE pv2.product_id = p.id
                    AND pv2.is_free_delivery = 1
                )
              )

              OR

              /* ALL Fruits and Vegetables */
              (
                c.name IN ('Fruits', 'Vegetables')
                AND pv.id = (
                  SELECT pv2.id
                  FROM product_variants pv2
                  WHERE pv2.product_id = p.id
                    AND pv2.stock > 0
                  ORDER BY pv2.price ASC, pv2.id ASC
                  LIMIT 1
                )
              )
            )

          ORDER BY p.id DESC
        `;
        break;


      /* =====================================================
         🟠 TODAY'S DEAL
         Existing Today's Deal + ALL FRUITS + VEGETABLES
      ===================================================== */
      case "todays-deal":
        query = `
          SELECT
            p.id,
            p.name,
            p.brand,
            p.image,
            p.images,
            p.category_id,

            pv.id AS variant_id,
            pv.price,
            pv.mrp,
            pv.stock,
            pv.variant_label,

            p.deal_discount,
            p.deal_expires_at

          FROM products p

          JOIN product_variants pv
            ON pv.product_id = p.id

          LEFT JOIN categories c
            ON c.id = p.category_id

          WHERE
            p.active = 1
            AND p.status = 'ACTIVE'
            AND pv.stock > 0

            AND
            (
              /* Existing Today's Deal products */
              (
                p.today_deal = 1
                AND (
                  p.deal_expires_at IS NULL
                  OR p.deal_expires_at > NOW()
                )
                AND pv.id = (
                  SELECT pv2.id
                  FROM product_variants pv2
                  WHERE pv2.product_id = p.id
                    AND pv2.stock > 0
                  ORDER BY pv2.price ASC, pv2.id ASC
                  LIMIT 1
                )
              )

              OR

              /* ALL Fruits and Vegetables */
              (
                c.name IN ('Fruits', 'Vegetables')
                AND pv.id = (
                  SELECT pv2.id
                  FROM product_variants pv2
                  WHERE pv2.product_id = p.id
                    AND pv2.stock > 0
                  ORDER BY pv2.price ASC, pv2.id ASC
                  LIMIT 1
                )
              )
            )

          ORDER BY p.id DESC
        `;
        break;


      /* =====================================================
         🟣 OFFER ZONE
         Existing Offer Zone + ALL FRUITS + VEGETABLES
      ===================================================== */
      case "offer-zone":
        query = `
          SELECT
            p.id,
            p.name,
            p.brand,
            p.image,
            p.images,
            p.expiry_date,
            p.category_id,

            pv.id AS variant_id,
            pv.price,
            pv.mrp,
            pv.stock,
            pv.variant_label,

            ROUND(
              ((pv.mrp - pv.price) / pv.mrp) * 100
            ) AS discount

          FROM products p

          JOIN product_variants pv
            ON pv.product_id = p.id

          LEFT JOIN categories c
            ON c.id = p.category_id

          WHERE
            p.active = 1
            AND p.status = 'ACTIVE'
            AND pv.stock > 0

            AND
            (
              /* Existing Offer Zone products */
              (
                p.expiry_date IS NOT NULL
                AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)

                AND pv.id = (
                  SELECT pv2.id
                  FROM product_variants pv2
                  WHERE pv2.product_id = p.id
                    AND pv2.stock > 0
                  ORDER BY pv2.price ASC, pv2.id ASC
                  LIMIT 1
                )
              )

              OR

              /* ALL Fruits and Vegetables */
              (
                c.name IN ('Fruits', 'Vegetables')

                AND pv.id = (
                  SELECT pv2.id
                  FROM product_variants pv2
                  WHERE pv2.product_id = p.id
                    AND pv2.stock > 0
                  ORDER BY pv2.price ASC, pv2.id ASC
                  LIMIT 1
                )
              )
            )

          ORDER BY p.id DESC
        `;
        break;


      /* =====================================================
         🟡 SUPER STORE
         Existing Super Store + ALL FRUITS + VEGETABLES
      ===================================================== */
      case "super-store":
        query = `
          SELECT
            p.*,
            MIN(pv.id) AS variant_id,
            MIN(pv.price) AS price,
            SUM(pv.stock) AS stock,
            MIN(pv.mrp) AS mrp,
            MIN(pv.variant_label) AS variant_label

          FROM products p

          JOIN product_variants pv
            ON pv.product_id = p.id

          LEFT JOIN categories c
            ON c.id = p.category_id

          WHERE
            p.active = 1
            AND p.status = 'ACTIVE'
            AND pv.stock > 0

            AND
            (
              /* Existing Super Store logic */
              (
                (pv.unit = 'kg' AND pv.quantity >= 3)
                OR
                (pv.unit = 'l' AND pv.quantity >= 3)
                OR
                (pv.unit = 'pack' AND pv.quantity >= 12)
              )

              OR

              /* ALL Fruits and Vegetables */
              (
                c.name IN ('Fruits', 'Vegetables')
              )
            )

          GROUP BY p.id
          ORDER BY p.id DESC
        `;
        break;


      /* =====================================================
         🔴 50% OFF
         DO NOT CHANGE THIS LOGIC
      ===================================================== */
      case "50-off":
        query = `
          SELECT
            p.*,
            c.name AS category_name,

            MIN(pv.price) AS price,
            COALESCE(SUM(pv.stock),0) AS stock,
            MIN(pv.mrp) AS mrp,
            MIN(pv.variant_label) AS variant_label,

            ROUND(
              ((MIN(pv.mrp) - MIN(pv.price)) / MIN(pv.mrp)) * 100
            ) AS mrp_discount,

            CASE
              WHEN p.expiry_date IS NOT NULL
                AND DATEDIFF(p.expiry_date, CURDATE()) <= 1 THEN 60

              WHEN p.expiry_date IS NOT NULL
                AND DATEDIFF(p.expiry_date, CURDATE()) <= 2 THEN 50

              WHEN p.expiry_date IS NOT NULL
                AND DATEDIFF(p.expiry_date, CURDATE()) <= 3 THEN 30

              ELSE 0
            END AS expiry_discount,

            GREATEST(
              ROUND(
                ((MIN(pv.mrp) - MIN(pv.price)) / MIN(pv.mrp)) * 100
              ),
              CASE
                WHEN p.expiry_date IS NOT NULL
                  AND DATEDIFF(p.expiry_date, CURDATE()) <= 1 THEN 60

                WHEN p.expiry_date IS NOT NULL
                  AND DATEDIFF(p.expiry_date, CURDATE()) <= 2 THEN 50

                WHEN p.expiry_date IS NOT NULL
                  AND DATEDIFF(p.expiry_date, CURDATE()) <= 3 THEN 30

                ELSE 0
              END
            ) AS final_discount

          FROM products p

          LEFT JOIN product_variants pv
            ON pv.product_id = p.id

          LEFT JOIN categories c
            ON c.id = p.category_id

          WHERE
            p.active = 1

          GROUP BY p.id

          HAVING
            stock > 0
            AND final_discount >= 50

          ORDER BY final_discount DESC
        `;
        break;


      /* =====================================================
         INVALID BANNER TYPE
      ===================================================== */
      default:
        return res.status(400).json({
          message: "Invalid banner type"
        });
    }

    /* ===============================
       EXECUTE QUERY
    ================================ */
    const [rows] = await db.query(query);

    console.log(
      `Banner [${type}] → ${rows.length} products`
    );

    res.json(rows);

  } catch (error) {
    console.error("Banner API Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});

export default router;