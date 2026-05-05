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

    COALESCE(MIN(pv.price), p.price) AS price,
    COALESCE(SUM(pv.stock), p.stock) AS stock,
    MIN(pv.mrp) AS mrp,

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
        query = baseQuery + `
          WHERE p.is_free_delivery = 1
          GROUP BY p.id
        `;
        break;

      /* 🟠 TODAY DEAL */
      case "today-deal":
        query = baseQuery + `
          WHERE p.is_today_deal = 1
          GROUP BY p.id
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
        query = baseQuery + `
          GROUP BY p.id
        `;
        break;

      /* 🔴 50% OFF */
      case "half-price":
        query = baseQuery + `
          GROUP BY p.id
          HAVING discount >= 50
        `;
        break;

      default:
        return res.status(400).json({ message: "Invalid banner type" });
    }

    const [rows] = await db.query(query);
    res.json(rows);

  } catch (error) {
    console.error("Banner API Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;