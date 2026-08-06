
import jwt from "jsonwebtoken";


// Generate Email Verification Token
export const generateVerificationToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.EMAIL_VERIFICATION_SECRET,
    {
      expiresIn: "1d",
    }
  );
};


// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

// Verify Email Verification Token
export const verifyVerificationToken = (token) => {
  return jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
};

// Generate Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
      // expiresIn: "15m",
    }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );
};