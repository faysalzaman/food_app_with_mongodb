import express from "express";
import multerUpload from "../config/multer_cloudinary.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

const router = express.Router();

// Create a new category
router.post("/v1/categories", multerUpload.single("image"), createCategory);

// Get all categories
router.get("/v1/categories", getAllCategories);

// Get a category by ID
router.get("/v1/categories/:categoryId", getCategoryById);

// Update a category by ID
router.put("/v1/categories/:categoryId", updateCategory);

// Delete a category by ID
router.delete("/v1/categories/:categoryId", deleteCategory);

export default router;
