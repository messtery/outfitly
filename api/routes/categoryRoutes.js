import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.delete("/categories/bulk", bulkDeleteCategories);
router.get("/categories/:id", getCategoryById);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

export default router;