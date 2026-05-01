import Category from "../models/category.js";
import { Op } from "sequelize";

// GET ALL dengan filter q, page, limit
export const getAllCategories = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = q
      ? { name: { [Op.like]: `%${q}%` } }
      : {};

    const { rows, count } = await Category.findAndCountAll({
      where: whereClause,
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      totalData: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET BY ID: Ambil satu kategori berdasarkan ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. POST: Tambah kategori baru
export const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "Gagal menambah data: " + error.message });
  }
};

// 4. PATCH: Update data kategori (ID dikirim lewat URL, data lewat Body)
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    
    await category.update(req.body);
    res.status(200).json({ message: "Kategori berhasil diupdate", data: category });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. DELETE: Hapus kategori berdasarkan ID
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });

    await category.destroy();
    res.status(200).json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};