import express from "express";
import {
  forgetPassword,
  resetPassword,
} from "../controllers/loginController.js";

const router = express.Router();

router.post("forget-password", forgetPassword);
router.post("reset-password", resetPassword);

export const resetPasswordRoute = router;
