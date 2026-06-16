import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import User from '../../models/user.js';
import Role from '../../models/role.js';

export const findAll = async (req, res) => {
  try {
    const {
      page = 1, limit = 10,
      sort = 'id', order = 'asc',
      q, name, email, role,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);

    const allowedSorts = ['id', 'name', 'email'];
    const sortField = allowedSorts.includes(sort) ? sort : 'id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const andConditions = [{ isRoot: false }];
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

    const roleInclude = {
      model: Role,
      as: 'role',
      attributes: ['id', 'name'],
      ...(role ? { where: { name: { [Op.like]: `%${role}%` } }, required: true } : { required: false }),
    };

    const orderClause = sort === 'role'
      ? [[{ model: Role, as: 'role' }, 'name', sortOrder]]
      : [[sortField, sortOrder]];

    const result = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'createdAt'],
      include: [roleInclude],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: orderClause,
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
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'createdAt'],
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const create = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashed,
      roleId: roleId ?? null,
    });
    res.status(201).json({ message: 'User created', data: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password, roleId } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (email !== undefined) updates.email = email.trim();
    if (roleId !== undefined) updates.roleId = roleId ?? null;
    if (password) updates.password = await bcrypt.hash(password, 10);

    await user.update(updates);
    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const bulkRemove = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No IDs provided' });
    }
    const deleted = await User.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: `${deleted} user(s) deleted` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting users' });
  }
};
