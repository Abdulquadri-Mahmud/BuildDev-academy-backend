import express from "express";
import {
  createCourse,
  getCourseWithCategory,
  getCourseById,
  enrollForCourses,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController.js";
import { verifyToken, verifyRole } from "../middlewares/checkToken.js";
const router = express.Router();

router.post("/create-course", verifyToken, verifyRole("admin"), createCourse);

router.post(
  "/enroll-courses",
  verifyToken,
  verifyRole("student"),
  enrollForCourses
);

router.get("/get-course-by-id", getCourseById);

router.get("/get-course-category", getCourseWithCategory);

router.delete(
  "/delete-course/:id",
  verifyToken,
  verifyRole("admin"),
  deleteCourse
);
router.put(
  "/update-course/:id",
  verifyToken,
  verifyRole("admin"),
  updateCourse
);

export const courseRouter = router;
