import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Customer = sequelize.define(
  "customers",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

export default Customer;