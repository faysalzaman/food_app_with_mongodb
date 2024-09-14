import FoodItem from "../models/food.js";
import CustomError from "../utils/error.js";
import response from "../utils/response.js";
import Category from "../models/category.js";
import { v2 as cloudinary } from "cloudinary";

// Create Food Item
export const createFoodItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      type,
      available,
      isVegetarian,
    } = req.body;

    // Access the uploaded file (if any)
    const imageFile = req.file;

    // Validation: Check if all required fields are provided
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !type ||
      isVegetarian === undefined
    ) {
      throw new CustomError(
        "Please provide all required fields including vegetarian status",
        400
      );
    }

    // Validate the existence of the category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new CustomError("Category not found", 404);
    }

    // Check if the food item already exists with the same name in the same category
    const foodItemExists = await FoodItem.findOne({
      name: name,
      category: category,
    });
    if (foodItemExists) {
      throw new CustomError(
        "Food item with this name already exists in this category",
        400
      );
    }

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    let imagePublicId = null;
    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = result.secure_url; // Store the URL of the uploaded image
      imagePublicId = result.public_id; // Store the public_id for later management
    }

    // Create a new food item
    const foodItem = new FoodItem({
      name,
      description,
      price,
      category,
      type,
      imageUrl,
      imagePublicId,
      available,
      isVegetarian,
    });

    // Save the food item to the database
    await foodItem.save();

    // Respond with success
    res
      .status(201)
      .json(response(201, true, "Food item created successfully", foodItem));
  } catch (error) {
    next(error);
  }
};

// Update Food Item
export const updateFoodItem = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const {
      name,
      description,
      price,
      category,
      type,
      available,
      isVegetarian,
    } = req.body;

    // Access the uploaded file (if any)
    const imageFile = req.file;

    const foodItem = await FoodItem.findById(foodId);

    if (!foodItem) {
      throw new CustomError("Food item not found", 404);
    }

    // Update fields if provided
    if (name) foodItem.name = name;
    if (description) foodItem.description = description;
    if (price) foodItem.price = price;
    if (category) foodItem.category = category;
    if (type) foodItem.type = type;
    if (available !== undefined) foodItem.available = available;
    if (isVegetarian !== undefined) foodItem.isVegetarian = isVegetarian;

    // Handle image updates
    if (imageFile) {
      // Delete the old image from Cloudinary if it exists
      if (foodItem.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(foodItem.imagePublicId);
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile.path);
      foodItem.imageUrl = result.secure_url; // Update the image URL
      foodItem.imagePublicId = result.public_id; // Update the image public_id
    }

    foodItem.updatedAt = Date.now();

    await foodItem.save();

    res
      .status(200)
      .json(response(200, true, "Food item updated successfully", foodItem));
  } catch (error) {
    next(error);
  }
};

// Delete Food Item
export const deleteFoodItem = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    // Find the food item
    const foodItem = await FoodItem.findById(foodId);

    if (!foodItem) {
      throw new CustomError("Food item not found", 404);
    }

    // Delete the image from Cloudinary if it exists
    if (foodItem.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(foodItem.imagePublicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    // Delete the food item from the database
    await FoodItem.findByIdAndDelete(foodId);

    res
      .status(200)
      .json(
        response(200, true, "Food item deleted successfully", {
          foodId: foodId,
        })
      );
  } catch (error) {
    next(error);
  }
};

// Get All Food Items
export const getAllFoodItems = async (req, res, next) => {
  try {
    const foodItems = await FoodItem.find().populate("category");

    res
      .status(200)
      .json(
        response(200, true, "Food items retrieved successfully", foodItems)
      );
  } catch (error) {
    next(error);
  }
};

// Get Food Item by Id
export const getFoodItemById = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    const foodItem = await FoodItem.findById(foodId).populate("category");

    if (!foodItem) {
      throw new CustomError("Food item not found", 404);
    }

    res
      .status(200)
      .json(response(200, true, "Food item retrieved successfully", foodItem));
  } catch (error) {
    next(error);
  }
};
