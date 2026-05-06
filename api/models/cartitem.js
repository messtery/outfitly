import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Product from './product.js';

const CartItem = sequelize.define('cart_items', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  cartId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'carts',
      key: 'id',
    }
  },
  productId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id',
    }
  },
  qty: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  price: {
    allowNull: false,
    type: DataTypes.INTEGER
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
  modelName: 'CartItem',
  timestamps: true,
})

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

export default CartItem