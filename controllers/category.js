import Category from "../models/category.js";
import CustomError from "../utils/error.js";
import response from "../utils/response.js";

// Create Category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new CustomError("Name is required", 400);
    }

    console.log("Hello");

    const category = new Category({
      name,
      description,
    });

    await category.save();

    res
      .status(201)
      .json(response(201, true, "Category created successfully", category));
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

// Update Category
export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    // Update fields if provided
    if (name) category.name = name;
    if (description) category.description = description;

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

    // Find and delete the category
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    res.status(200).json(
      response(200, true, "Category deleted successfully", {
        categoryId: categoryId,
      })
    );
  } catch (error) {
    next(error);
  }
};
