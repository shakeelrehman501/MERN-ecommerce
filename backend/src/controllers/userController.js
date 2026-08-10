import { User } from "../models/userModel.js";
import cloudinary from "../utils/cloudinary.js";

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
    
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;

    const { firstName, lastName, address, city, zipCode, phoneNo, role } =
      req.body;

    // Sirf apni profile ya admin update kar sakta hai
    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    const user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    // Agar new profile picture upload hui ho
    if (req.file) {
      // Purani image delete karo
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profiles",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    

    // User fields update
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.address = address ?? user.address;
    user.city = city ?? user.city;
    user.zipCode = zipCode ?? user.zipCode;
    user.phoneNo = phoneNo ?? user.phoneNo;

    // Sirf admin role change kar sakta hai
    if (loggedInUser.role === "admin" && role) {
      user.role = role;
    }

    // Profile picture update
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
