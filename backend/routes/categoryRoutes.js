

import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ==============================
   GET ALL CATEGORIES (ADMIN + DROPDOWNS)
============================== */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM categories ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET CATEGORIES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==============================
   GET CATEGORIES WITH SUBCATEGORIES (HOME PAGE)
============================== */
router.get("/with-subcategories", async (req, res) => {
  try {
    /* 1️⃣ Fetch categories */
    const [categories] = await db.query(
      `
      SELECT id, name
      FROM categories
      ORDER BY name
      `
    );

    /* 2️⃣ Fetch subcategories WITH image */
    const [subcategories] = await db.query(
      `
      SELECT id, name, image, category_id
      FROM subcategories
      ORDER BY name
      `
    );

    /* 3️⃣ Build category tree */
    const data = categories.map((cat) => ({
      ...cat,
      subcategories: subcategories.filter(
        (sub) => sub.category_id === cat.id
      ),
    }));

    res.json(data);
  } catch (err) {
    console.error("CATEGORY TREE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
