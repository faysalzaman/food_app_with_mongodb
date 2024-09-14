import Category from "../models/category.js";
import CustomError from "../utils/error.js";
import response from "../utils/response.js";
import { v2 as cloudinary } from "cloudinary";

// Create Category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const imageFile = req.file;

    // Validation: Check if the required fields are provided
    if (!name) {
      throw new CustomError("Name is required", 400);
    }

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    let imagePublicId = null;
    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = result.secure_url; // Store the URL of the uploaded image
      imagePublicId = result.public_id; // Store the public_id for later management
    }

    // Create a new category object with the image details if available
    const category = new Category({
      name,
      description,
      imageUrl,
      imagePublicId,
    });

    // Save the category to the database
    await category.save();

    // Respond with success
    res
      .status(201)
      .json(response(201, true, "Category created successfully", category));
  } catch (error) {
    next(error);
  }
};

// Update Category
export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;
    const imageFile = req.file;

    const category = await Category.findById(categoryId);

    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    // Update fields if provided
    if (name) category.name = name;
    if (description) category.description = description;

    // Handle image updates
    if (imageFile) {
      // Delete the old image from Cloudinary if it exists
      if (category.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(category.imagePublicId);
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile.path);
      category.imageUrl = result.secure_url; // Update the image URL
      category.imagePublicId = result.public_id; // Update the image public_id
    }

    category.updatedAt = Date.now();

    await category.save();

    res
      .status(200)
      .json(response(200, true, "Category updated successfully", category));
  } catch (error) {
    next(error);
  }
};

// Delete Category
export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    // Find the category
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    // Delete the image from Cloudinary if it exists
    if (category.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(category.imagePublicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    // Delete the category from the database
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json(
      response(200, true, "Category deleted successfully", {
        categoryId: categoryId,
      })
    );
  } catch (error) {
    next(error);
  }
};

// Get All Categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res
      .status(200)
      .json(
        response(200, true, "Categories retrieved successfully", categories)
      );
  } catch (error) {
    next(error);
  }
};

// Get Category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    res
      .status(200)
      .json(response(200, true, "Category retrieved successfully", category));
  } catch (error) {
    next(error);
  }
};
