import express from "express";
import multerUpload from "../config/multer_cloudinary.js"; // Import multer configuration
import {
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getAllFoodItems,
  getFoodItemById,
} from "../controllers/food.js";

const router = express.Router();

// Create a food item
router.post("/v1/food", multerUpload.single("image"), createFoodItem);

// Update a food item
router.put("/v1/food/:foodId", multerUpload.single("image"), updateFoodItem);

// Delete a food item
router.delete("/v1/food/:foodId", deleteFoodItem);

// Get all food items
router.get("/v1/food", getAllFoodItems);

// Get food item by id
router.get("/v1/food/:foodId", getFoodItemById);

export default router;
