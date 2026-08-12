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

        <p>Please click the button below to verify your email:</p>

        <p>
          <a href="${verificationUrl}"
            style="
            display:inline-block;
            padding:12px 24px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;">
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