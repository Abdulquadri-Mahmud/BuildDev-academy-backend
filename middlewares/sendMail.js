import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
  
export const sendWelcomeMailMessage = async (email, firstName, lastName, verifyUrl) => {
  try {
    console.log(`Preparing to send welcome email to ${email} (${firstName})`);

    const mailOption = {
      from: `"BuildDev Academy" <${process.env.EMAIL}>`,
      to: email,
      subject: "Welcome to BuildDev Academy",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden; background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
          <div style="background-color: #4CAF50; padding: 20px; color: white; text-align: center;">
            <img src="https://res.cloudinary.com/dypn7gna0/image/upload/v1748696272/gojauquxzfa8axima1hf.png" alt="BuildDev Logo" style="height: 60px; margin-bottom: 20px;" />
            <h1 style="margin: 0; font-size: 24px;">🎉 Welcome to BuildDev Academy!</h1>
          </div>

          <div style="padding: 30px;">
            <h2 style="color: #333;">Hi ${firstName} ${lastName},</h2>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Thank you for registering with <strong>BuildDev Academy</strong>. We're thrilled to have you join our growing community of learners and innovators!
            </p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              To get started, please verify your email address by clicking the button below:
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Click on the link below to verify your account, 
              </p>
              ${verifyUrl}
            </div>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              Once verified, you’ll be able to explore our platform, enroll in courses, and start building your tech career.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 14px; color: #999; text-align: center;">
              If you have any questions or need help, just reply to this email — we're here for you.
            </p>
            <p style="font-size: 14px; color: #999; text-align: center;">– The BuildDev Academy Team</p>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
            © ${new Date().getFullYear()} BuildDev Academy. All rights reserved.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOption);
    console.log("✅ Welcome email sent to:", info.response);

  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};


export const sendForgetPasswordCode = async (email, code) => {
  const mailOptions = {
    from: `"BuildDev Accademy <${process.env.BUILD_DEV_SEND_EMAIL_ADDRESS}>"`,
    to: email,
    subject: "Reset Password",
    html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                 h2 style="color: #4CAF50;">Your Password Reset Code</h2>
                <p style="font-size: 16px; color: #333;">Use this code to reset your password: <strong>${code}</strong></p>
                  <hr style="border: none; border-top: 1px solid #eee;" />
                  <p style="font-size: 14px; color: #777;">
                    If you have any questions, feel free to reply to this email.
                  </p>
                  <p style="font-size: 14px; color: #777;">– The Team</p>
                </div>
              `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Reset code email sent:", info.response);
};
