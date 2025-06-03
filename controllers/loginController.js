import {
  signInSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../middlewares/validator.js";

import jwt from "jsonwebtoken";

import { doHashValidation } from "../utilities/passwordHashing.js";

import { User } from "../models/user.js";

import { sendForgetPasswordCode } from "../middlewares/sendMail.js";

import bcrypt from "bcryptjs";

//Login User
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { value, error } = signInSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    //Checking if the user exist
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    console.log("Hashed password from DB:", existingUser.password);

    //Comparing the hashed password
    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res.status(400).json({ message: "Invalid credential" });
    }

    // Create JWT Authentication
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.TOKEN_SECRET
    );
    
    res
      .cookie("Authorization", "Bearer" + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, token, message: "Login successful!", data: existingUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Logout User
export const logout = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ success: true, message: "Logout succesful" });
};

//Forget Password
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const { value, error } = forgetPasswordSchema.validate({ email });
    if (error) {
      return res.status(400).json({ message: error.details[1].message });
    }

    //Checking existing emsil
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    //Generate random number for code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    user.resetCode = resetCode;
    user.resetCodeExpires = expires;

    await user.save();

    await sendForgetPasswordCode(user.email, resetCode);

    return res.status(200).json({ message: "Code sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword, code } = req.body;

  try {
    const { value, error } = resetPasswordSchema.validate(
      email,
      newPassword,
      code
    );
    if (error) {
      return res.status(400).json({ message: error.details[1].message });
    }
    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid email or expired code" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 20);
    user.password = hashPassword;
    (user.restCode = null), (user.resetCodeExpires = null);

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};
