import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import response from "../../utils/response.js";
import CustomError from "../../utils/error.js";
import JWT from "../../utils/jwt.js";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Access the uploaded file (if any)
    const imageFile = req.file;

    // Validate that the required fields are provided
    if (!name || !email || !password) {
      throw new CustomError("Please provide all required fields", 400);
    }

    // Check if the user already exists
    const userExist = await prisma.user.findUnique({ where: { email } });
    if (userExist) {
      throw new CustomError("User already exists", 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user object with Cloudinary image info if available
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        bio,
        profileImage: imageFile ? imageFile.path : null, // Cloudinary URL
        profileImagePublicId: imageFile ? imageFile.filename : null, // Cloudinary public_id
      },
    });

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
