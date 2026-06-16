import Product from '../../models/product.js';
import Category from '../../models/category.js';
import { Op, literal } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

function buildImageUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

function deleteUploadedFile(imageUrl) {
  if (!imageUrl) return;
  try {
    const filename = imageUrl.split('/uploads/').pop();
    if (filename) fs.unlinkSync(path.join(UPLOADS_DIR, filename));
  } catch {
    // ignore missing files
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    const image = req.file ? buildImageUrl(req, req.file.filename) : null;
    const product = await Product.create({ name, price, description, categoryId, image });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1, limit = 10,
      sort = 'id', order = 'asc',
      q, name, category, price, description,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);
    const offset = (pageNum - 1) * limitNum;

    const allowedSorts = ['id', 'name', 'price', 'description'];
    const sortField = allowedSorts.includes(sort) ? sort : 'id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const andConditions = [];
    if (q) {
      andConditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      });
    }
    if (name) andConditions.push({ name: { [Op.like]: `%${name}%` } });
    if (description) andConditions.push({ description: { [Op.like]: `%${description}%` } });
    if (price) {
      const safePrice = String(price).replace(/[^0-9]/g, '');
      if (safePrice) {
        andConditions.push(literal(`CAST(\`products\`.\`price\` AS CHAR) LIKE '%${safePrice}%'`));
      }
    }

    const productWhere = andConditions.length > 0 ? { [Op.and]: andConditions } : {};
    const categoryRequired = !!category;
    const orderClause =
      sort === 'category'
        ? [[{ model: Category, as: 'category' }, 'name', sortOrder]]
        : [[sortField, sortOrder]];

    const { rows, count } = await Product.findAndCountAll({
      where: productWhere,
      limit: limitNum,
      offset,
      attributes: ['id', 'name', 'price', 'description', 'image', 'categoryId'],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
        where: categoryRequired ? { name: { [Op.like]: `%${category}%` } } : undefined,
        required: categoryRequired,
      }],
      order: orderClause,
    });

    return res.status(200).json({
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
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

    const { name, price, description, categoryId } = req.body;
    const updates = { name, price, description, categoryId };

    if (req.file) {
      deleteUploadedFile(product.image);
      updates.image = buildImageUrl(req, req.file.filename);
    }

    await product.update(updates);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    deleteUploadedFile(product.image);
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const products = await Product.findAll({ where: { id: { [Op.in]: ids } } });
    products.forEach((p) => deleteUploadedFile(p.image));
    const deleted = await Product.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: `${deleted} product(s) deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
