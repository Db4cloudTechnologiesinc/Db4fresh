
import express from "express";
import db from "../config/db.js";
import upload from "../middleware/upload.js";
 
const router = express.Router();
/* ======================================
   GET ALL SUBCATEGORIES (ADMIN)
====================================== */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT id, name, category_id, image
      FROM subcategories
      ORDER BY name
      `
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
/* ======================================
   GET SUBCATEGORIES BY CATEGORY ID
====================================== */
router.get("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    const [rows] = await db.query(
      `
      SELECT id, name, image
      FROM subcategories
      WHERE category_id = ?
      ORDER BY name
      `,
      [categoryId]
    );

    res.json(rows);
  } catch (err) {
    console.error("SUBCATEGORY FETCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


 
/* ======================================
   ADMIN: CREATE SUBCATEGORY
====================================== */
 
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, category_id } = req.body;
      const image = req.file ? req.file.filename : null;

      if (!name || !category_id || !image) {
        return res.status(400).json({
          message: "Name, category and image are required",
        });
      }

      const [result] = await db.query(
        `
        INSERT INTO subcategories (name, category_id, image)
        VALUES (?, ?, ?)
        `,
        [name, category_id, image]
      );

      res.json({ id: result.insertId });
    } catch (err) {
      console.error("CREATE SUBCATEGORY ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);
/* ===============================
   UPDATE / REPLACE SUBCATEGORY ICON
================================ */
router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, category_id } = req.body;
      const { id } = req.params;
      const newImage = req.file?.filename;

      const [rows] = await db.query(
        "SELECT image FROM subcategories WHERE id=?",
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Not found" });
      }

      await db.query(
        `
        UPDATE subcategories
        SET name=?, category_id=?, image=?
        WHERE id=?
        `,
        [
          name,
          category_id,
          newImage || rows[0].image,
          id,
        ]
      );

      res.json({ message: "Subcategory updated" });
    } catch (err) {
      console.error("UPDATE SUBCATEGORY ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);
 
/* ===============================
   DELETE SUBCATEGORY (WITH IMAGE)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
 
    const [rows] = await db.query(
      "SELECT image FROM subcategories WHERE id=?",
      [id]
    );
 
    if (!rows.length) {
      return res.status(404).json({ message: "Not found" });
    }
 
    // delete image from folder
    if (rows[0].image) {
      fs.unlinkSync(`uploads/subcategories/${rows[0].image}`);
    }
 
    await db.query(
      "DELETE FROM subcategories WHERE id=?",
      [id]
    );
 
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
export default router;
 