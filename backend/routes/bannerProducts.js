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

    MIN(pv.price) AS price,
SUM(pv.stock) AS stock,
    MIN(pv.mrp) AS mrp,
MIN(pv.variant_label) AS variant_label,

    ROUND(
      ((MIN(pv.mrp) - MIN(pv.price)) / MIN(pv.mrp)) * 100
    ) AS discount

  FROM products p
  LEFT JOIN product_variants pv ON pv.product_id = p.id
`;

/* ===============================
   GET PRODUCTS BY BANNER TYPE
================================ */
router.get("/:type", async (req, res) => {
  const { type } = req.params;

  try {
    let query = "";

    switch (type) {

      /* 🟢 FREE DELIVERY */
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

    WHERE
      pv.is_free_delivery = 1
      AND pv.price = (
        SELECT MIN(price)
        FROM product_variants
        WHERE product_id = p.id
          AND is_free_delivery = 1
      )
  `;
  break;

    
    /* 🟠 TODAY DEAL */
    /* 🟠 TODAY DEAL */
case "todays-deal":
  query = `
    SELECT
      p.id,
      p.name,
      p.brand,
      p.image,
      p.images,

      MIN(pv.id) AS variant_id,
      MIN(pv.price) AS price,
      MIN(pv.mrp) AS mrp,
      SUM(pv.stock) AS stock,
      MIN(pv.variant_label) AS variant_label,

      p.deal_discount,
      p.deal_expires_at

    FROM products p

    JOIN product_variants pv
      ON pv.product_id = p.id

    WHERE
      p.active = 1
      AND p.today_deal = 1
      AND (
        p.deal_expires_at IS NULL
        OR p.deal_expires_at > NOW()
      )

    GROUP BY p.id

    HAVING
      SUM(pv.stock) > 0

    ORDER BY p.id DESC
  `;
  break;
  
        /* 🟣 OFFER ZONE (EXPIRY) */
      case "offer-zone":
        query = baseQuery + `
          WHERE p.expiry_date IS NOT NULL
          AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
          GROUP BY p.id
        `;
        
        break;

      /* 🟡 SUPER STORE */
      case "super-store":
  query = `
    SELECT
      p.*,
      MIN(pv.price) AS price,
      SUM(pv.stock) AS stock,
      MIN(pv.mrp) AS mrp
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
    GROUP BY p.id
  `;
  break;

      /* 🔴 50% OFF */
       /* 🔴 50% OFF */
    /* 🔴 50% OFF */
/* 🔴 50% OFF */
/* 🔴 50% OFF */
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
      default:
        return res.status(400).json({ message: "Invalid banner type" });
    }

    const [rows] = await db.query(query);
    console.log(rows);
    res.json(rows);

  } catch (error) {
    console.error("Banner API Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;