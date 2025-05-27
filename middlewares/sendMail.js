import nodeMailer from "nodemailer";
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.BUILD_DEV_SEND_EMAIL_ADDRESS,
    pass: process.env.BUILD_DEV_SEND_EMAIL_PASSWORD,
  },

  logger: true, // Enable debug logging
  debug: true, // Show SMTP traffic
});

export const sendWelcomeMailMessage = async (email, username) => {
  try {
    const mailOption = {
      from: `"BuildDev Accademy" <${process.env.BUILD_DEV_SEND_EMAIL_ADDRESS}>`,
      to: email,
      subject: "Welcome to BuildDev Accademy",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                  <h2 style="color: #4CAF50;">Welcome to BuildDev Accademy, ${username}!</h2>
                  <p style="font-size: 16px; color: #333;">
                    Thank you for registering with us. We're excited to have you on board!
                  </p>
                  <hr style="border: none; border-top: 1px solid #eee;" />
                  <p style="font-size: 14px; color: #777;">
                    If you have any questions, feel free to reply to this email.
                  </p>
                  <p style="font-size: 14px; color: #777;">– The Team</p>
                </div>
              `,
    };

    const info = await transporter.sendMail(mailOption);
    console.log("Email sent successfully", info.response);
  } catch (error) {
    console.log(error);
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
