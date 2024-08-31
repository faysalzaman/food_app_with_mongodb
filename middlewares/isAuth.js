import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import CustomError from "../utils/error.js";

dotenv.config();

const isAuth = async (req, res, next) => {
  try {
    // get bearer token from header
    const bearerToken = req.headers.authorization || req.headers.Authorization;
    if (!bearerToken) {
      throw new CustomError("Unauthorized", 401);
    }

    // remove bearer from token
    const token = bearerToken.split(" ")[1];
    if (!token) {
      throw new CustomError("Unauthorized", 401);
    }

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new CustomError("Unauthorized", 401);
      }

      // set user to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default isAuth;
