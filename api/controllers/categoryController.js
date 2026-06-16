import Category from "../models/category.js";
import { Op } from "sequelize";

export const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1, limit = 10,
      sort = 'id', order = 'asc',
      q, name,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 10);

    const allowedSorts = ['id', 'name'];
    const sortField = allowedSorts.includes(sort) ? sort : 'id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const andConditions = [];
    if (q) andConditions.push({ name: { [Op.like]: `%${q}%` } });
    if (name) andConditions.push({ name: { [Op.like]: `%${name}%` } });

    const where = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const { rows, count } = await Category.findAndCountAll({
      where,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: [[sortField, sortOrder]],
    });

    res.status(200).json({
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    await category.update(req.body);
    res.status(200).json({ message: "Category updated", data: category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    await category.destroy();
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bulkDeleteCategories = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No IDs provided' });
    }
    const deleted = await Category.destroy({ where: { id: { [Op.in]: ids } } });
    res.json({ message: `${deleted} category(s) deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
