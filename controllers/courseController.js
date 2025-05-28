import { status } from "init";
import {
  enrollForCoursesSchema,
  createCourseSchema,
} from "../middlewares/validator.js";
//import { course } from "../models/course.js";
import Course from "../models/course.js";
import { User } from "../models/user.js";
import { mongoose } from "mongoose";
//Create Course
export const createCourse = async (req, res) => {
  const { courseName, price, category } = req.body;
  console.log("Request body:", req.body);
  try {
    const { value, error } = createCourseSchema.validate({
      courseName,
      price,
      category,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    //Check if the course already exist
    const existingCourse = await Course.findOne({ courseName });
    if (existingCourse) {
      return res.status(400).json({ message: "Course already exist" });
    }

    //Add course to the database
    const newCourse = new Course({
      courseName: courseName,
      price: price,
      category: category,
    });

    await newCourse.save();

    return res.status(200).json({ message: "course created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Enroll for courses
export const enrollForCourses = async (req, res) => {
  const userId = req.user.userId;
  const { courseIds } = req.body;

  try {
    const { value, error } = enrollForCoursesSchema.validate(userId, courseIds);
    if (error) {
      return res.status(400).json({ message: error.details[1].message });
    }

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: "Ids must not empty" });
    }

    //Validate the course Ids
    const validCourseIds = courseIds.filter((id) => {
      mongoose.Types.isValid(id);
    });

    if (validCourseIds.length !== courseIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more course IDs are invalid",
      });
    }

    const user = await User.findById({ userId });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const courses = await Course.find({ _id: { $in: validCourseIds } });
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: "Course not found" });
    }

    //Check if user is already enrolled
    const alreadyEnrolled = courses.filter((course) =>
      user.courses.include(course._id.toString())
    );

    if (alreadyEnrolled > 0) {
      const enrolledCourse = alreadyEnrolled.map((c) => c.courseName);
      return res.status(400).json({
        message: `You've already enrolled in: ${enrolledCourse.join(", ")}`,
      });
    }

    // Enroll new courses (add ObjectIds to user.courses)
    const newCourseIds = courses.map((course) => course._id);
    user.courses.push(...newCourseIds);
    await user.save();

    const courseNames = courses.map((course) => course.courseName);
    const totalCoursesSelected = courseNames.length;
    const totalPrice = courses.reduce((sum, course) => sum + course.price, 0);

    // Send success response
    return res.status(200).json({
      success: true,
      message: "You've enrolled for the course(s)",
      totalCoursesSelected,
      totalPrice,
      enrolledCourses: courseNames,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Get Course with Category
export const getCourseWithCategory = async (req, res) => {
  try {
    const groupedCourses = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          courses: {
            $push: {
              _id: "$_id",
              courseName: "$courseName",
              price: "$price",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: groupedCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses by category",
    });
  }
};

//Get Course By Id
export const getCourseById = async (req, res) => {
  const { id } = req.param;
  try {
    const course = await Course.findOne({ id });
    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course details", course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Get Course By Name
export const getCourseByName = async (req, res) => {
  const { courseName } = req.body;
  try {
    const course = await Course.findOne({ courseName });
    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course found", course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};

//Delete Course

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteCourse = await Course.findByIdAndDelete(id);

    if (!deleteCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout..." });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { courseName, price, category } = req.body;

  try {
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    existingCourse.courseName = courseName || existingCourse.courseName;
    existingCourse.price = price || existingCourse.price;
    existingCourse.category = category || existingCourse.category;

    existingCourse.save();

    return res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server timeout" });
  }
};
