import express from "express";
import {
  initializePayment,
  verifyPayment,
} from "../controllers/paymentController.js";
const router = express.Router();

router.post("initialize-payment", initializePayment);
router.post("verify-payment", verifyPayment);

export const paymentRoute = router;
