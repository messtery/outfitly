import Product from '../../models/product.js';
import Category from '../../models/category.js';
import { Op, literal } from 'sequelize';

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
      attributes: ['id', 'name', 'price', 'description', 'categoryId'],
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

export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const deleted = await Product.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: `${deleted} product(s) deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
