import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import OrderItem from "./orderitem.js";

const Order = sequelize.define('orders', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  total: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'Order',
  timestamps: true,
});

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
})

export default Order;