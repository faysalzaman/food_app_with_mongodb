import bcrypt from "bcryptjs";
import User from "../models/users.js";
import response from "../utils/response.js";
import CustomError from "../utils/error.js";
import JWT from "../utils/jwt.js";
import { v2 as cloudinary } from "cloudinary";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, bio } = req.body;

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

    // Create the new user object with Cloudinary image info if available
    const user = new User({
      name,
      email,
      password: hashedPassword,
      bio,
      profileImage: imageFile ? imageFile.path : null, // Cloudinary URL
      profileImagePublicId: imageFile ? imageFile.filename : null, // Cloudinary public_id
    });

    // Save the user to the database
    await user.save();

    // Respond with success
    res.status(201).json(
      response(201, true, "User created successfully", {
        name,
        email,
        bio,
        profileImage: imageFile ? imageFile.path : null, // Include Cloudinary image URL in response
      })
    );
  } catch (error) {
    next(error);
  }
};

// User login Api
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

// Get all users
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

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, password, bio } = req.body;

    // Access the uploaded file (if any)
    const imageFile = req.file;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Update user fields if they are provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    // If password is being updated, hash it before saving
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
    }

    // Handle image updates
    if (imageFile) {
      // If the user already has an image, delete the old one from Cloudinary
      if (user.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(user.profileImagePublicId);
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
          // Optionally handle this error (e.g., send a response to the client)
        }
      }

      // Save the new image details from multer-storage-cloudinary
      user.profileImage = imageFile.path; // Cloudinary URL
      user.profileImagePublicId = imageFile.filename; // Cloudinary public_id
    }

    // Save the updated user
    await user.save();

    res.status(200).json(
      response(200, true, "User updated successfully", {
        userId: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage, // Include updated profile image in response
      })
    );
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find and delete the user
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // If the user has a profile image in Cloudinary, delete it
    if (user.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profileImagePublicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json(
      response(200, true, "User deleted successfully", {
        userId: user._id,
      })
    );
  } catch (error) {
    next(error);
  }
};
