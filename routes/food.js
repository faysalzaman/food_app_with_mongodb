import express from "express";
import multerUpload from "../config/multer_cloudinary.js";
import {
  createFoodItem,
  getAllFoodItems,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/food.js";

const router = express.Router();

// Create a new food item
router.post("/v1/foodItems", multerUpload.single("image"), createFoodItem);

// Get all food items
router.get("/v1/foodItems", getAllFoodItems);

// Get a food item by ID
router.get("/v1/foodItems/:foodId", getFoodItemById);

// Update a food item by ID
router.put("/v1/foodItems/:foodId", updateFoodItem);

// Delete a food item by ID
router.delete("/v1/foodItems/:foodId", deleteFoodItem);

export default router;
