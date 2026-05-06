import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import CartItem from "./cartitem.js";

const Cart = sequelize.define('carts', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  customerId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'customers',
      key: 'id'
    },
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
  modelName: 'Cart',
  timestamps: true,
});

Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  as: 'items',
})

export default Cart