import Category from '../models/category.js';
import Product from '../models/product.js';
import { Op } from "sequelize";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
    try {
        const { q, categoryId, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        const whereClause = {};

        if (q) {
            whereClause.name = { [Op.like]: `%${q}%` };
        }
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }
        if (minPrice && maxPrice) {
            whereClause.price = { [Op.between]: [minPrice, maxPrice] };
        } else if (minPrice) {
            whereClause.price = { [Op.gte]: minPrice };
        } else if (maxPrice) {
            whereClause.price = { [Op.lte]: maxPrice };
        }

        const offset = (page - 1) * limit;

        const products = await Product.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            attributes: ['id', 'name', 'price', 'description', 'image', 'categoryId'],
            include: [
              {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
              }
            ],
        });

        return res.status(200).json({
            message: "Products fetched successfully",
            totalItems: products.count,
            totalPages: Math.ceil(products.count / limit),
            currentPage: parseInt(page),
            data: products.rows,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
