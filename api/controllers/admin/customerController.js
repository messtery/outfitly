import { Op } from 'sequelize';
import Customer from '../../models/customer.js';

export const create = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ message: 'Customer created', data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create customer' });
  }
};

export const findAll = async (req, res) => {
  try {
    const {
      page = 1, limit = 10,
      sort = 'id', order = 'asc',
      q, name, email,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);

    const allowedSorts = ['id', 'name', 'email'];
    const sortField = allowedSorts.includes(sort) ? sort : 'id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const andConditions = [];
    if (q) {
      andConditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
        ],
      });
    }
    if (name) andConditions.push({ name: { [Op.like]: `%${name}%` } });
    if (email) andConditions.push({ email: { [Op.like]: `%${email}%` } });

    const where = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const result = await Customer.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email'],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: [[sortField, sortOrder]],
    });

    res.status(200).json({
      data: result.rows,
      meta: {
        total: result.count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(result.count / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

export const findOne = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email'],
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer' });
  }
};

export const update = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.update(req.body);
    res.status(200).json({ message: 'Customer updated', data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update customer' });
  }
};

export const remove = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.destroy();
    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer' });
  }
};

export const bulkRemove = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const deleted = await Customer.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: `${deleted} customer(s) deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customers' });
  }
};
