import jwt from "jsonwebtoken";
import "dotenv/config";

import { User } from "../models/userModel.js";
import { verifyAccessToken } from "../utils/token.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access token has expired.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
    }

    // Find User
    const user = await User.findById(decoded.id)
      .select("_id firstName lastName email role isVerified isLoggedIn")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    req.id = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  next();
};
