import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "course name is required"],
      unique: true,
    },

    price: {
      type: Number,
      required: [true, "price is required"],
    },

    category: {
      type: String,
      required: [true, "Specify the category"],
      enum: ["BackEnd", "FrontEnd"],
    },
  },
  {
    timesStamp: true,
  }
);

export default mongoose.model("Course", courseSchema);
