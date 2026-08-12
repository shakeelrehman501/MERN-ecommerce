import "dotenv/config";
import { transporter } from "../config/mail.js";

export const verifyEmail = async (token, email) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`;

    const mailOptions = {
      from: `"E-commerce App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email Verification",

      html: `
        <h2>Email Verification</h2>

        <p>Please click the link below to verify your email:</p>

        <p>
          <a href="${verificationUrl}">
            Verify Your Email
          </a>
        </p>

        <br>

        <p>Thanks!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw error;
  }
};

// import nodemailer from "nodemailer";
// import "dotenv/config";
// export const verifyEmail = (token, email) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.MAIL_USER,
//       pass: process.env.MAIL_PASS,
//     },
//   });
//   const mailOptions = {
//     from: process.env.MAIL_USER,
//     to: email,
//     subject: "Email Verification",
//   html: `
//     <h2>Email Verification</h2>
//     <p>Please click the link below to verify your email:</p>
//     <p>http://localhost:5173/verify/${token}</p>

//     <br>
//     <p>Thanks!</p>
//   `,
//   };

//   transporter.sendMail(mailOptions, function (error, response) {
//     if (error) throw error;
//     // console.log("Email Sent");
//     // console.log(response);
//   });
// };

