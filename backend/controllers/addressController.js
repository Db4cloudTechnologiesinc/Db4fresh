
import db from "../config/db.js";

/* ================= ADD ADDRESS ================= */
export const addAddress = (req, res) => {
  const userId = req.user.id;
  const body = req.body;

  const sql = `
    INSERT INTO user_addresses
    (user_id, name, phone, address_line2, landmark, city, state, pincode, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    body.type || "Home",
    body.phone || "0000000000",

    // ✅ SUPPORT BOTH (IMPORTANT)
    body.address_line2 || body.address || null,

    body.landmark || null,
    body.city || null,
    body.state || null,
    body.pincode || null,
    body.is_default ? 1 : 0,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("🔥 ADD ADDRESS ERROR:", err);
      return res.status(500).json({
        success: false,
        mysqlMessage: err.message,
      });
    }

    res.status(201).json({
      success: true,
      insertId: result.insertId,
    });
  });
};

/* ================= GET ADDRESSES ================= */
export const getAddresses = (req, res) => {
  // const userId = req.user.id;//
  const userId = req.user?.id;

if (!userId) {
  return res.status(401).json({
    success: false,
    addresses: [],
    message: "User not authenticated",
  });
}


  db.query(
    "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("GET ADDRESS ERROR:", err);
        return res.status(500).json({
          success: false,
          addresses: [],
        });
      }

      // ✅ KEEP ORIGINAL RESPONSE SHAPE
      res.json({
        success: true,
        addresses: rows,
      });
    }
  );
};

/* ================= SET DEFAULT ADDRESS ================= */
export const setDefaultAddress = (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  db.query(
    "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?",
    [userId],
    (err) => {
      if (err) {
        console.error("RESET DEFAULT ERROR:", err);
        return res.status(500).json({ success: false });
      }

      db.query(
        "UPDATE user_addresses SET is_default = 1 WHERE id = ? AND user_id = ?",
        [addressId, userId],
        (err2) => {
          if (err2) {
            console.error("SET DEFAULT ERROR:", err2);
            return res.status(500).json({ success: false });
          }

          res.json({ success: true });
        }
      );
    }
  );
};

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  db.query(
    "DELETE FROM user_addresses WHERE id = ? AND user_id = ?",
    [addressId, userId],
    (err) => {
      if (err) {
        console.error("DELETE ADDRESS ERROR:", err);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    }
  );
};
/* ================= UPDATE ADDRESS ================= */
export const updateAddress = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  // Destructure but DO NOT trust undefined
  const {
    name,
    phone,
    address_line1,
    address_line2,
    landmark,
    city,
    state,
    pincode,
    address_type,
  } = req.body;

  try {
    // 🔒 First get existing address
    const [rows] = await db.query(
      "SELECT * FROM user_addresses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Address not found" });
    }

    const existing = rows[0];

    // ✅ Merge old + new values safely
    const payload = {
      name: name ?? existing.name,
      phone: phone ?? existing.phone,
      address_line1: address_line1 ?? existing.address_line1,
      address_line2: address_line2 ?? existing.address_line2,
      landmark: landmark ?? existing.landmark,
      city: city ?? existing.city,
      state: state ?? existing.state,
      pincode: pincode ?? existing.pincode,
      address_type: address_type ?? existing.address_type,
    };

    await db.query(
      `
      UPDATE user_addresses SET
        name = ?,
        phone = ?,
        address_line1 = ?,
        address_line2 = ?,
        landmark = ?,
        city = ?,
        state = ?,
        pincode = ?,
        address_type = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        payload.name,
        payload.phone,
        payload.address_line1,
        payload.address_line2,
        payload.landmark,
        payload.city,
        payload.state,
        payload.pincode,
        payload.address_type,
        id,
        userId,
      ]
    );

    // 🔁 Return updated row
    const [updated] = await db.query(
      "SELECT * FROM user_addresses WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      address: updated[0],
    });
  } catch (err) {
    console.error("UPDATE ADDRESS ERROR:", err);
    res.status(500).json({ message: "Address update failed" });
  }
};
/* ================= CHECK PINCODE ================= */
export const checkPincode = (req, res) => {
  const { pincode } = req.params;

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      available: false,
      message: "Invalid pincode",
    });
  }

  const serviceablePincodes = ["517619", "500081", "560001"];

  res.json({
    available: serviceablePincodes.includes(pincode),
  });
};
