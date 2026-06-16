import { Op } from 'sequelize';
import Role from '../../models/role.js';

export const findAll = async (req, res) => {
  try {
    const {
      page = 1, limit = 10,
      sort = 'id', order = 'asc',
      q, name, description,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);

    const allowedSorts = ['id', 'name', 'description'];
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

    const where = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const result = await Role.findAndCountAll({
      where,
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
    res.status(500).json({ message: 'Error fetching roles' });
  }
};

export const findAllSimple = async (_req, res) => {
  try {
    const roles = await Role.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] });
    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching roles' });
  }
};

export const findOne = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json({ data: role });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching role' });
  }
};

export const create = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const role = await Role.create({
      name: name.trim(),
      description: description?.trim() ?? null,
      permissions: Array.isArray(permissions) ? permissions : [],
    });
    res.status(201).json({ message: 'Role created', data: role });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Role name already exists' });
    }
    res.status(500).json({ message: 'Failed to create role' });
  }
};

export const update = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    const { name, description, permissions } = req.body;
    await role.update({
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description?.trim() ?? null }),
      ...(permissions !== undefined && { permissions: Array.isArray(permissions) ? permissions : [] }),
    });
    res.status(200).json({ message: 'Role updated', data: role });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Role name already exists' });
    }
    res.status(500).json({ message: 'Failed to update role' });
  }
};

export const remove = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    await role.destroy();
    res.status(200).json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting role' });
  }
};

export const bulkRemove = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided' });
    }
    const deleted = await Role.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: `${deleted} role(s) deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting roles' });
  }
};
