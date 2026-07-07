
import nodemailer from "nodemailer";
import "dotenv/config";
export const sendOTPMail = (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: `OTP verification`, 
    html:`<p>Your otp is: <b>${otp}</b></p>`
  };

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) throw error;
    console.log("Otp Sent");
    // console.log(response);
  });
};

