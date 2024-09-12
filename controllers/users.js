import bcrypt from "bcryptjs";
import User from "../models/users.js";

import response from "../utils/response.js";
import CustomError from "../utils/error.js";
import JWT from "../utils/jwt.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, status } = req.body;

    // Access the uploaded file (if any)
    const imageFile = req.file;

    // Validate that the required fields are provided
    if (!name || !email || !password) {
      throw new CustomError("Please provide all required fields", 400);
    }

    // Check if the user already exists
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      throw new CustomError("User already exists", 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user object with the image path if available
    const user = new User({
      name,
      email,
      password: hashedPassword,
      status,
      image: imageFile ? imageFile.path : null, // Save image path
    });

    // Save the user to the database
    await user.save();

    // Respond with success
    res.status(201).json(
      response(201, true, "User created successfully", {
        name,
        email,
        status,
        image: imageFile ? imageFile.path : null, // Include image path in response
      })
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new CustomError("Invalid credentials", 401);
    }

    const token = JWT.createToken({ email: user.email, user: user });

    res.status(200).json(
      response(200, true, "User logged in successfully", {
        token: token,
        userId: user,
      })
    );
  } catch (error) {
    next(error);
  }
};

// get all the user;
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res
      .status(200)
      .json(response(200, true, "Users retrieved successfully", users));
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, password, status } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Update user fields if they are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (status) user.status = status;

    // If password is being updated, hash it before saving
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json(
      response(200, true, "User updated successfully", {
        userId: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    res.status(200).json(
      response(200, true, "User deleted successfully", {
        userId: user._id,
      })
    );
  } catch (error) {
    next(error);
  }
};
