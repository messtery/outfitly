import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import OrderItem from "./orderitem.js";
import Customer from "./customer.js";

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
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'qris', 'transfer'),
    allowNull: true,
  },
  orderStatus: {
    type: DataTypes.ENUM('processing', 'ready', 'completed'),
    allowNull: true,
    defaultValue: null,
  },
  invoiceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  invoiceUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
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

Order.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
})

export default Order;