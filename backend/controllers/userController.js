import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";


export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });


    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "2m",
    });

    verifyEmail(token, email); //Sent email here
    newUser.token = token;

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Token ")) {
      res.status(400).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1]; // [Bearer, fwe2s]
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        succes: false,
        message: "User not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "2m",
    });

    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Token created",
      token: user.token,
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

export const loggedIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Find existing User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not existed. Please sign up first then login",
      });
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    // Check Verified is false
    if (user.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Verify your acount then login",
      })
    }

    // Generate access token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" },
    );
    // LoggedIn true & save
    user.isLoggedIn = true;
    await user.save();
    // check existing session & delete it
    const existingSession = await Session.findOne({ userId: user._id })
    if (existingSession) {
      await Session.deleteOne({ userId: user._id })
    }
    // Create session
    await Session.create({ userId: user._id })

    // Send Success message
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      user: user,
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loggedOut = async (req, res) => {
  try {
    const userId = req.id;
    await Session.deleteMany({ userId: userId })
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "User loggedOut successfully",
      user: userId
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      })
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()
    await sendOTPMail(otp, email)
    return res.status(200).json({
      success: true,
      message: "OTP send successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

}

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is required"
      })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Otp is not generated or already verified"
      })
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Otp has expired, request new one"
      })
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is invalid"
      })
    }
    user.otp = null
    user.otpExpiry = null
    await user.save()
    return res.status(200).json({
      success: true,
      message: "Otp verified successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body
    const { email } = req.params
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password do not matchz"
      })
    }

    const hassPassword = await bcrypt.hash(newPassword, 10)
    user.password = hassPassword
    await user.save()
    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const allUser = async (_, res) => {
  try {
    const users = await User.find()
    return res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })

  }
}

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params // extract userId from request params
    const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
    if (!user) {
      return res.status(404).json({
        sucess: false,
        message: "User not found"
      })
    }
    return res.status(200).json({
      succes: true,
      user,
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: error.message
    })
  }
}