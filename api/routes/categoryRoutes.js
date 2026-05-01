import express from "express";
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getAllCategories);       // Ambil semua
router.get("/categories/:id", getCategoryById);    // Ambil satu
router.post("/categories", createCategory);         // Tambah
router.patch("/categories/:id", updateCategory);    // Update
router.delete("/categories/:id", deleteCategory);   // Hapus

export default router;