import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Product = sequelize.define('products', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Customer',
});

export default Product;