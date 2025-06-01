import { User } from "../models/user.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: "Verification token is required." });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification token." });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    return res.status(200).json({ success: true, message: "✅ Email successfully verified. You can now log in." });
  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong during verification." });
  }
};
