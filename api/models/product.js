import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  categoryId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'categoryId',
  },
}, {
  sequelize,
  modelName: 'Product',
});

export default Product;