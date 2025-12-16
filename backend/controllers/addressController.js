import Address from "../models/address.js";
import sequelize from "../config/sequelize.js";
import { Op } from "sequelize";
import ServiceablePincode from "../models/ServiceablePincode.js";  // ⭐ REQUIRED

export const getAddresses = async (req, res) => {
  try {
    const userId = req.userId;
    const list = await Address.findAll({
      where: { user_id: userId },
      order: [["is_default", "DESC"], ["created_at", "DESC"]],
    });

    return res.json({ success: true, addresses: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createAddress = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.userId;
    const { type, address, landmark, pincode, is_default } = req.body;

    if (!address || !type)
      return res.status(400).json({ success: false, message: "type and address required" });

    let created = await Address.create(
      {
        user_id: userId,
        type,
        address,
        landmark,
        pincode,
        is_default: Boolean(is_default),
      },
      { transaction: t }
    );

    if (is_default) {
      await Address.update(
        { is_default: false },
        {
          where: {
            user_id: userId,
            id: { [Op.ne]: created.id }, // ⭐ FIXED
          },
          transaction: t,
        }
      );
    } else {
      const hasDefault = await Address.count({
        where: { user_id: userId, is_default: true },
      });

      if (!hasDefault) {
        created.is_default = true;
        await created.save({ transaction: t });
      }
    }

    await t.commit();
    return res.status(201).json({ success: true, address: created });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAddress = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.userId;
    const id = req.params.id;
    const { type, address, landmark, pincode, is_default } = req.body;

    const addr = await Address.findOne({ where: { id, user_id: userId } });
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    await addr.update(
      { type, address, landmark, pincode, is_default: Boolean(is_default) },
      { transaction: t }
    );

    if (is_default) {
      await Address.update(
        { is_default: false },
        {
          where: {
            user_id: userId,
            id: { [Op.ne]: id }, // ⭐ FIXED
          },
          transaction: t,
        }
      );
    }

    await t.commit();
    return res.json({ success: true, address: addr });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.userId;
    const id = req.params.id;

    const addr = await Address.findOne({ where: { id, user_id: userId } });
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    const wasDefault = addr.is_default;

    await addr.destroy({ transaction: t });

    if (wasDefault) {
      const other = await Address.findOne({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
        transaction: t,
      });

      if (other) {
        other.is_default = true;
        await other.save({ transaction: t });
      }
    }

    await t.commit();
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.userId;
    const id = req.params.id;

    const addr = await Address.findOne({ where: { id, user_id: userId } });
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    await Address.update(
      { is_default: false },
      { where: { user_id: userId }, transaction: t }
    );

    addr.is_default = true;
    await addr.save({ transaction: t });

    await t.commit();
    return res.json({ success: true, address: addr });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const checkPincodeAvailability = async (req, res) => {
  try {
    const { pincode } = req.params;
    const exists = await ServiceablePincode.findOne({ where: { pincode } });

    if (exists) {
      return res.json({
        success: true,
        available: true,
        message: "Delivery available in your area 🎉",
      });
    }

    return res.json({
      success: true,
      available: false,
      message: "Sorry, we do not deliver to this pincode yet ❌",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
