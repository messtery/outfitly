import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Order = sequelize.define('orders', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  paymentStatus: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Failed', 'Refunded'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
  },
}, {
  sequelize,
  modelName: 'Order',
});

export default Order;
