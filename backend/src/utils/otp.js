
import bcrypt from "bcryptjs";

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP
export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

// Compare OTP
export const compareOTP = async (otp, hashedOTP) => {
  return await bcrypt.compare(otp, hashedOTP);
};

// OTP Expiry (10 Minutes)
export const generateOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};