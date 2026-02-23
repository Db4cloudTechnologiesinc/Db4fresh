import express from "express";
import db from "../../config/db.js";

const router = express.Router();

/* =====================================================
   GET ALL SLOTS + BOOKED COUNT + ACTIVE SLOT
===================================================== */
router.get("/:partnerId", async (req, res) => {
  const { partnerId } = req.params;

  try {
    // Get all active slots with today's booking count
    const [slots] = await db.query(`
      SELECT 
        s.id,
        s.slot_time,
        s.start_time,
        s.end_time,
        s.peak,
        s.max_capacity,
        COUNT(p.id) AS booked_count
      FROM delivery_slots s
      LEFT JOIN partner_booked_slots p
        ON s.id = p.slot_id
        AND p.booking_date = CURDATE()
        AND p.status = 'active'
      WHERE s.is_active = 1
      GROUP BY s.id
      ORDER BY s.start_time ASC
    `);

    // Get active slot of this partner
    const [active] = await db.query(`
      SELECT slot_id 
      FROM partner_booked_slots
      WHERE partner_id = ?
      AND booking_date = CURDATE()
      AND status = 'active'
    `, [partnerId]);

    res.json({
      success: true,
      slots,
      activeSlot: active.length > 0 ? active[0].slot_id : null
    });

  } catch (err) {
    console.error("GET SLOTS ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


/* =====================================================
   BOOK SLOT (VALIDATION + CAPACITY + TIME CHECK)
===================================================== */
router.post("/book", async (req, res) => {
  const { partnerId, slotId } = req.body;

  try {
    // Check already booked
    const [existing] = await db.query(`
      SELECT id FROM partner_booked_slots
      WHERE partner_id = ?
      AND booking_date = CURDATE()
      AND status = 'active'
    `, [partnerId]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already have an active slot"
      });
    }

    // Get slot details
    const [slotData] = await db.query(`
      SELECT start_time, end_time, max_capacity
      FROM delivery_slots
      WHERE id = ? AND is_active = 1
    `, [slotId]);

    if (!slotData.length) {
      return res.status(404).json({
        success: false,
        message: "Slot not found or inactive"
      });
    }

    // Prevent booking past slot end time
    const [timeCheck] = await db.query(`
      SELECT CURTIME() AS now_time
    `);

    if (timeCheck[0].now_time > slotData[0].end_time) {
      return res.status(400).json({
        success: false,
        message: "This slot has already ended"
      });
    }

    // Check capacity
    const [capacity] = await db.query(`
      SELECT COUNT(*) AS booked
      FROM partner_booked_slots
      WHERE slot_id = ?
      AND booking_date = CURDATE()
      AND status = 'active'
    `, [slotId]);

    if (capacity[0].booked >= slotData[0].max_capacity) {
      return res.status(400).json({
        success: false,
        message: "Slot is full"
      });
    }

    // Insert booking
    await db.query(`
      INSERT INTO partner_booked_slots
      (partner_id, slot_id, booking_date, status)
      VALUES (?, ?, CURDATE(), 'active')
    `, [partnerId, slotId]);

    res.json({
      success: true,
      message: "Slot activated successfully"
    });

  } catch (err) {
    console.error("BOOK SLOT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


/* =====================================================
   CANCEL SLOT
===================================================== */
router.post("/cancel", async (req, res) => {
  const { partnerId } = req.body;

  try {
    const [result] = await db.query(`
      UPDATE partner_booked_slots
      SET status = 'cancelled'
      WHERE partner_id = ?
      AND booking_date = CURDATE()
      AND status = 'active'
    `, [partnerId]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "No active slot found"
      });
    }

    res.json({
      success: true,
      message: "Slot cancelled successfully"
    });

  } catch (err) {
    console.error("CANCEL SLOT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
