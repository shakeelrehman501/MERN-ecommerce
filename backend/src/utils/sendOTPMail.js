import "dotenv/config";
import { transporter } from "../config/mail.js";

export const sendOTPMail = async (otp, email) => {
  try {
    const mailOptions = {
      from: `"E-commerce App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - OTP Verification",

      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Reset OTP</title>
      </head>

      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">

              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff;margin:30px auto;border-radius:10px;overflow:hidden;">

                <tr>
                  <td
                    style="background:#2563eb;color:#ffffff;padding:25px;text-align:center;">
                    <h1 style="margin:0;">
                      Password Reset
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px;">

                    <h2 style="margin-top:0;color:#333;">
                      Please use the following One-Time Password (OTP):
                    </h2>



                    <div
                      style="
                      background:#f3f4f6;
                      border:2px dashed #2563eb;
                      text-align:center;
                      padding:18px;
                      border-radius:8px;
                      margin:30px 0;
                    ">

                      <span
                        style="
                        font-size:36px;
                        font-weight:bold;
                        letter-spacing:10px;
                        color:#2563eb;
                      ">
                        ${otp}
                      </span>

                    </div>

                    <p
                      style="
                      color:#e11d48;
                      font-size:15px;
                    ">
                      Note: This OTP will expire in <strong>10 minutes</strong>.
                    </p>

                    <p
                      style="
                      color:#555;
                      font-size:15px;
                      line-height:26px;
                    ">
                      For your security, never share this OTP with anyone.
                    </p>

                    <hr
                      style="
                      margin:35px 0;
                      border:none;
                      border-top:1px solid #ddd;
                    ">

                  </td>
                </tr>

                <tr>
                  <td
                    style="
                    background:#f8f8f8;
                    padding:20px;
                    text-align:center;
                    color:#888;
                    font-size:13px;
                  ">
                    © ${new Date().getFullYear()} E-commerce App. All Rights Reserved.
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);

    throw new Error("Failed to send OTP email");
  }
};
