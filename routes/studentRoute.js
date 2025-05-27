import express from "express";
import { verifyToken, verifyRole } from "../middlewares/checkToken.js";
import {
  registerStudent,
  updateStudent,
  getAllRegisteredStudent,
  getStudentById,
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

export const studentRoute = router;
