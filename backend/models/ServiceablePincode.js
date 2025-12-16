import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const ServiceablePincode = sequelize.define(
  "ServiceablePincode",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: "serviceable_pincodes",
    timestamps: false
  }
);

// ⭐ THIS IS THE PART YOU WERE MISSING
export default ServiceablePincode;
