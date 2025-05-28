import express from "express";
import { logout } from "../controllers/loginController.js";
import { loginRoute } from "./loginRoute.js";
const router = express.Router();

router.post("/logout", logout);
export const logoutRoute = router;
