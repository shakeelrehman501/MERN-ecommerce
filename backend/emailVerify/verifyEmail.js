
import nodemailer from "nodemailer";
import "dotenv/config";
export const verifyEmail = (token, email) => {
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
    subject: "Email Verification",
  html: `
    <h2>Email Verification</h2>
    <p>Please click the link below to verify your email:</p>
    <p>http://localhost:5173/verify/${token}</p>

    <br>
    <p>Thanks!</p>
  `,
  };

  transporter.sendMail(mailOptions, function (error, response) {
    if (error) throw error;
    // console.log("Email Sent");
    // console.log(response);
  });
};

