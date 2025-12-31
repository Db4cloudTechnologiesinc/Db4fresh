import db from "../config/db.js";

/* ================= ADD ADDRESS ================= */
export const addAddress = (req, res) => {
  const userId = req.user.id;
  const body = req.body;

  console.log("📦 ADDRESS PAYLOAD:", body);
  console.log("👤 USER ID:", userId);

  const sql = `
    INSERT INTO user_addresses
    (user_id, name, phone, address_line2, landmark, city, state, pincode, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    body.type || "Home",
    body.phone || "0000000000",
    body.address,
    body.landmark || "",
    body.city || "NA",
    body.state || "NA",
    body.pincode,
    body.is_default ? 1 : 0,
  ];

  console.log("🧾 SQL VALUES:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      // 🔥 DO NOT HIDE THIS
      console.error("🔥 MYSQL INSERT ERROR:", err);
      return res.status(500).json({
        mysqlMessage: err.message,
        mysqlCode: err.code,
        sqlState: err.sqlState,
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
  const userId = req.user.id;

  db.query(
    "SELECT * FROM user_addresses WHERE user_id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("GET ADDRESS ERROR:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to fetch addresses" });
      }

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
    "UPDATE user_addresses SET is_default = false WHERE user_id = ?",
    [userId],
    (err) => {
      if (err) {
        console.error("RESET DEFAULT ERROR:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to reset default" });
      }

      db.query(
        "UPDATE user_addresses SET is_default = true WHERE id = ? AND user_id = ?",
        [addressId, userId],
        (err2) => {
          if (err2) {
            console.error("SET DEFAULT ERROR:", err2);
            return res
              .status(500)
              .json({ success: false, message: "Failed to set default" });
          }

          res.json({
            success: true,
            message: "Default address updated",
          });
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
        return res
          .status(500)
          .json({ success: false, message: "Failed to delete address" });
      }

      res.json({
        success: true,
        message: "Address deleted",
      });
    }
  );
};
/* ================= CHECK PINCODE ================= */
export const checkPincode = (req, res) => {
  const { pincode } = req.params;

  // Simple validation
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      available: false,
      message: "Invalid pincode format",
    });
  }

  // Demo serviceable pincodes
  const serviceablePincodes = ["517619", "500081", "560001"];

  if (serviceablePincodes.includes(pincode)) {
    return res.json({ available: true });
  }

  return res.json({
    available: false,
    message: "Delivery not available at this pincode",
  });
};
