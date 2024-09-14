import express from "express";
import multerUpload from "../config/multer_cloudinary.js"; // Import multer configuration
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

const router = express.Router();

// Create a category
router.post("/v1/categories", multerUpload.single("image"), createCategory);

// Update a category
router.put(
  "/v1/categories/:categoryId",
  multerUpload.single("image"),
  updateCategory
);

// Other routes
router.get("/v1/categories", getAllCategories);
router.get("/v1/categories/:categoryId", getCategoryById);
router.delete("/v1/categories/:categoryId", deleteCategory);

export default router;
