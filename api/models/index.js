import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { Sequelize } from 'sequelize';
import Customer from './customer.js';
import Product from './product.js';
import Category from './category.js';
import OrderItem from './orderitem.js';
import Order from './order.js';
import Cart from './cart.js';
import CartItem from './cartitem.js';
import Role from './role.js';
import User from './user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const configJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json'), 'utf8'));
const config = configJson[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
  Customer,
  Product,
  Category,
  sequelize,
  Sequelize,
};

Object.keys(db).forEach(modelName => {
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
})

CartItem.belongsTo(Cart, {
  foreignKey: 'cartId',
  as: 'cart',
})

export default db;
