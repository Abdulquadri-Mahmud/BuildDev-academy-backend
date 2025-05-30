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

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Check for existing phone number
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists" });
    }

    // Hash password
    const passwordHash = await doHash(password, 12); // Consider lowering to 10-12 rounds

    // Save user to DB
    const student = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: passwordHash,
      role: "student",
    });

    await student.save();

    // Send fast response
    res.status(200).json({ success: true, message: "Registration successful" });

    // Send welcome email in the background
    sendWelcomeMailMessage(email, `${firstName} ${lastName}`)
      .then(() => console.log("Welcome email sent"))
      .catch(err => console.error("Failed to send email:", err));

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Update Student Details
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    const existingStudent = await User.findById(id);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    existingStudent.firstName = firstName || existingStudent.firstName;
    existingStudent.lastName = lastName || existingStudent.lastName;
    existingStudent.email = email || existingStudent.email;
    existingStudent.phoneNumber = phoneNumber || existingStudent.phoneNumber;

    await existingStudent.save();

    return res.status(200).json({ message: "Updated Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Get All Registered Student Details
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

//Get Studen Details By Id
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

//Delete student
export const deleteStudent = async (res, req) => {
  const { id } = req.params;
  try {
    const existingStudent = await User.findByIdAndDelete(id);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

// Dectivate Student
export const deactivateStudent = async (res, req) => {
  const { id } = req.params;
  try {
    const existingStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student dectivated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Activate Student
export const activateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const existingStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student activated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Get Active Students
export const getAllActiveStudents = async (req, res) => {
  try {
    const getAllActiveStudent = await Student.find({ isDeleted: false });
    if (!getAllActiveStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(getAllActiveStudent);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Get All Deactivated Student
export const getAllDeactivatedStudents = async (req, res) => {
  try {
    const getAllDeactivatedStudent = await Student.find({ isDeleted: true });
    if (!getAllDeactivatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(getAllDeactivatedStudent);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Get Student With Enroll Courses
export const getStudentWithEnrolledCourses = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id).populate("courses");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.courses.length === 0) {
      return res
        .status(200)
        .json({
          message: "Student found but not enrolled in any course yet",
          student,
        });
    }

    return res.status(200).json(student);
  } catch (error) {}
};
