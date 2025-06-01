import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is required"],
    },

    lastName: {
      type: String,
      required: [true, "LastName is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: [true, "PhoneNumber is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    resetCode: {
      type: String,
    },
    resetCodeExpires: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false, // more logical default
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: false,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
    },
  },
  {
    timestamps: true, // corrected spelling
  }
);

export const User = mongoose.model("User", userSchema);
