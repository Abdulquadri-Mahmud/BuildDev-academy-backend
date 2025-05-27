import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "successfu", "failed"],
      default: "pending",
    },

    channel: String,
    currency: { type: String, default: "NGN" },
    paid_at: Date,
  },
  {
    timestaps: true,
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);
