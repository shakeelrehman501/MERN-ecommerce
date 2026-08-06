import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../utils/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  verifyVerificationToken,
} from "../utils/token.js";
import {
  compareOTP,
  generateOTP,
  generateOTPExpiry,
  hashOTP,
} from "../utils/otp.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateVerificationToken(newUser._id);

    newUser.token = token;

    await newUser.save();

    try {
      await verifyEmail(token, email);
    } catch (error) {
      console.error("Email sending failed:", error);
    }

    const userResponse = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
    };

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const verify = async (req, res) => {
  try {
    const { token } = req.body;

    let decoded;

    try {
      decoded = verifyVerificationToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Verification token has expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.token !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified",
      });
    }

    user.isVerified = true;
    user.token = null;

    await user.save();

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Verify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const token = generateVerificationToken(user._id);

    user.token = token;

    await user.save();

    try {
      await verifyEmail(token, email);
    } catch (error) {
      console.error("Email sending failed:", error);
    }

    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("ReVerify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const loggedIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check Email Verification
    if (!existingUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // Compare Password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(existingUser._id);

    const refreshToken = generateRefreshToken(existingUser._id);

    // Refresh token expiry (30 days)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Update Login Status
    existingUser.isLoggedIn = true;
    await existingUser.save();

    // Create / Update Session
    await Session.findOneAndUpdate(
      { userId: existingUser._id },
      {
        userId: existingUser._id,
        refreshToken,
        expiresAt,
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    // Store Refresh Token in HttpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Safe User Response
    const userResponse = {
      _id: existingUser._id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      role: existingUser.role,
      isVerified: existingUser.isVerified,
    };

    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstName}`,
      user: userResponse,
      accessToken,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const loggedOut = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete User Session
    await Session.deleteOne({ userId });

    // Update Login Status
    user.isLoggedIn = false;
    await user.save();

    // Clear Refresh Token Cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Get Refresh Token From Cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // Verify Refresh Token
    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Check User
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check Login Status
    if (!user.isLoggedIn) {
      return res.status(401).json({
        success: false,
        message: "User is not logged in",
      });
    }

    // Check Session
    const session = await Session.findOne({
      userId: user._id,
      refreshToken,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session not found",
      });
    }

    // Check Session Expiry
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });

      return res.status(401).json({
        success: false,
        message: "Refresh token has expired",
      });
    }

    // Generate New Access Token
    const accessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find User
    const user = await User.findOne({ email }).select("+otp");

    /**
     * Prevent Email Enumeration
     * Always return the same response.
     */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists, an OTP has been sent to the registered email.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP
    const hashedOTP = await hashOTP(otp);

    // Save OTP
    user.otp = hashedOTP;
    user.otpExpiry = generateOTPExpiry();
    user.passwordResetVerified = false;

    await user.save();

    // Send OTP Email
    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists, an OTP has been sent to the registered email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find User
    const user = await User.findOne({ email }).select("+otp");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or email.",
      });
    }

    // Check OTP Exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    // Check OTP Expiry
    if (user.otpExpiry < new Date()) {
      user.otp = null;
      user.otpExpiry = null;
      user.passwordResetVerified = false;

      await user.save();

      return res.status(410).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Compare OTP
    const isOtpValid = await compareOTP(otp, user.otp);

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Mark Password Reset Verified
    user.passwordResetVerified = true;

    // Remove OTP
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find User
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // OTP must be verified first
    if (!user.passwordResetVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your OTP first.",
      });
    }

    // Prevent reusing current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your current password.",
      });
    }

    // Hash New Password
    user.password = await bcrypt.hash(newPassword, 10);

    // Reset Forgot Password Fields
    user.passwordResetVerified = false;
    user.otp = null;
    user.otpExpiry = null;
    user.isLoggedIn = false;

    await user.save();

    // Remove Active Session
    await Session.deleteOne({
      userId: user._id,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please login again.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your current password.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isLoggedIn = false;

    await user.save();

    await Session.deleteOne({
      userId: user._id,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const allUser = async (_, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // extract userId from request params
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user) {
      return res.status(404).json({
        sucess: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id; //user id for update user
    const loggedInUser = req.user; //from isAuthenticated middleware
    const { firstName, lastName, address, city, zipCode, phoneNo, role } =
      req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }
    let user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // if new file is uploaded
    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            console.log("Error:", error);
            console.log("Result:", result);
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    //update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const loggedOut = async (req, res) => {
//   try {
//    return res.status(400).json({
//      success: false,
//      message: "User not found",
//    });
//     return res.status(200).json({
//       success: true,
//       message: "User loggedOut successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
