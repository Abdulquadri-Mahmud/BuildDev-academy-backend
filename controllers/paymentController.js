import axios from "axios";

import { Payment } from "../models/payment.js";

import dotenv from "dotenv";

import { initializePaymentSchema } from "../middlewares/validator.js";

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

//Initialize payment
export const initializePayment = async (req, res) => {
  const { amount } = req.body;
  const email = req.user?.email;
  if (!email) {
    return res.status(400).json({ message: "Email not found in the token" });
  }
  try {
    const { value, error } = initializePaymentSchema.validate(amount);
    if (error) {
      return res.status(400).json({ message: error.details[1].message });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    //Payment Initialization to db
    await Payment.create({
      email,
      amount,
      reference: response.data.data.reference,
      paymentStatus: "pending",
    });

    res.status(200).json({
      success: true,
      message: "Payment Successful",
      authorization_url: response.data.data.authorization_url,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to initialize payment" });
  }
};

//Payment Verification
export const verifyPayment = async (req, res) => {
  const { reference } = req.params;
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${paystackSecretKey}` },
      }
    );

    const data = response.data.data;
    console.log("Paystack verification response:", data);

    if (data.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful yet",
      });
    }

    const payment = await Payment.findOneAndUpdate(
      { reference },
      {
        paymentStatus: "success",
        paid_at: data.paid_at,
        channel: data.channel,
        currency: data.currency,
      },
      { new: true }
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ success: false, error: "Server timeout" });
  }
};
