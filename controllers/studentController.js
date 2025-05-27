import { User } from "../models/user.js";

import { sendWelcomeMailMessage } from "../middlewares/sendMail.js";

import { registerSchema } from "../middlewares/validator.js";

import { doHash } from "../utilities/passwordHashing.js";

//Created User Registration Function
export const registerStudent = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    const { value, error } = registerSchema.validate({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    //Checking if the email is already exist
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }

    //Checking if the phone number is exist
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phonenumber already exist" });
    }

    // Hashing password
    const passwordHash = await doHash(password, 20);

    //Saving to Database
    const student = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: passwordHash,
      role: "student",
    });

    await student.save();
    //result.password = undefined; hide password
    //Send welcome message to user email
    await sendWelcomeMailMessage(email, `${firstName + " " + lastName}`);
    return res
      .status(200)
      .json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.log(error);
  }
};

//Update Student
export const updateStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { firstName, lastName, email, phoneNumber } = req.body;
    const updateStudent = await User.findOneAndUpdate(
      studentId,
      {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updateStudent) {
      return res.status(400).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Information updated successfully",
      student: updateStudent,
    });
  } catch (error) {
    console.log(error);
    return res.status(5000).json({ message: "Server timeout" });
  }
};

//Get All Registered Student
export const getAllRegisteredStudent = async () => {
  try {
    const students = await User.find()
      .sort({ firstName: 1 })
      .select("-password -_v");
    if (!students || students === null) {
      return res.status(400).json({ message: "Students not found" });
    }

    return res
      .status(200)
      .json({ message: "List of Registered Students", students });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Get Student By Id
export const getStudentById = async (req, res) => {
  const { id } = req.param;
  try {
    const student = await User.findOne({ id })
      .select("-password")
      .populate("courses");
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student details", student });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};
