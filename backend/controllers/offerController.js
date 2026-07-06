import db from "../config/db.js";

/* ================= GET ALL OFFERS ================= */

export const getOffers = async (req, res) => {
  try {
    const [offers] = await db.query(`
      SELECT
        o.id,
        o.title,

        o.buy_product_id,
        o.buy_variant_id,
        o.buy_qty,

        o.free_product_id,
        o.free_variant_id,
        o.free_qty,

        o.active,

        /* Buy Product */
        bp.name AS buy_product_name,
        bp.image AS buy_product_image,
        bp.images AS buy_product_images,

        /* Free Product */
        fp.name AS free_product_name,
        fp.image AS free_product_image,
        fp.images AS free_product_images,

        /* Buy Variant (used by ProductCard) */
        bpv.variant_label AS variant_label,
        bpv.variant_label AS buy_variant_label,
        bpv.price AS price,
        bpv.mrp AS mrp,
        bpv.stock AS stock,

        /* Free Variant */
        fpv.variant_label AS free_variant_label

      FROM offers o

      LEFT JOIN products bp
        ON bp.id = o.buy_product_id

      LEFT JOIN products fp
        ON fp.id = o.free_product_id

      LEFT JOIN product_variants bpv
        ON bpv.id = o.buy_variant_id

      LEFT JOIN product_variants fpv
        ON fpv.id = o.free_variant_id

      WHERE o.active = 1

      ORDER BY o.id DESC
    `);

    res.json(offers);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= CREATE OFFER ================= */

export const createOffer = async (req, res) => {
  try {

    const {
      title,

      buy_product_id,
      buy_variant_id,
      buy_qty,

      free_product_id,
      free_variant_id,
      free_qty,

    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO offers (
        title,

        buy_product_id,
        buy_variant_id,
        buy_qty,

        free_product_id,
        free_variant_id,
        free_qty,

        active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        title,

        buy_product_id,
        buy_variant_id,
        buy_qty,

        free_product_id,
        free_variant_id,
        free_qty,
      ]
    );

    res.json({
      success: true,
      offerId: result.insertId,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= DELETE OFFER ================= */

export const deleteOffer = async (req, res) => {
  try {

    await db.query(
      `DELETE FROM offers WHERE id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Offer deleted",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};