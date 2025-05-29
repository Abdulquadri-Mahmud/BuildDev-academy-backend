import express from "express";
import { verifyToken, verifyRole } from "../middlewares/checkToken.js";
import {
  registerStudent,
  updateStudent,
  getAllRegisteredStudent,
  getStudentById,
  deleteStudent,
  deactivateStudent,
  activateStudent,
  getAllActiveStudents,
  getAllDeactivatedStudents,
  getStudentWithEnrolledCourses,
} from "../controllers/studentController.js";
const router = express.Router();

router.post("/register", registerStudent);

router.put("update-details", updateStudent);

router.get(
  "get-all-student",
  verifyToken,
  verifyRole("admin"),
  getAllRegisteredStudent
);

router.get(
  "get-student-by-id",
  verifyToken,
  verifyRole("admin", getStudentById)
);

router.delete(
  "/delete-student",
  verifyToken,
  verifyRole("admin"),
  deleteStudent
);

router.get(
  "/deactivate-student",
  verifyToken,
  verifyRole("admin"),
  deactivateStudent
);

router.get(
  "/activate-student",
  verifyToken,
  verifyRole("admin"),
  activateStudent
);

router.get(
  "/get-all-active-students",
  verifyToken,
  verifyRole("admin"),
  getAllActiveStudents
);

router.get(
  "get-all-deactivated-student",
  verifyToken,
  verifyRole("admin"),
  getAllDeactivatedStudents
);

router.get("/get-student-with-enrolled-courses", getStudentWithEnrolledCourses);
export const studentRoute = router;
