import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
//import { seedAdmin } from "../SAMKA-BACKEND_CODE/seedAdmin/seed.js";
import { courseRouter } from "./routes/courseRoute.js";
import { loginRoute } from "./routes/loginRoute.js";
import { logoutRoute } from "./routes/logoutRoute.js";
import { studentRoute } from "./routes/studentRoute.js";
import { paymentRoute } from "./routes/paymentRoute.js";
import { resetPasswordRoute } from "./routes/resetPasswordRoute.js";
const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Listen to the PORT
app.listen(process.env.PORT, () => {
  console.log("Listen.............");
});

//Connected to the Database//
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// if (process.env.NODE_ENV !== "production") {
//   await seedAdmin();
// }

//Routes
app.use("/api/registration", studentRoute);
app.use("/api/make-payment", paymentRoute);
app.use("/api/user", loginRoute);
app.use("/api/user", logoutRoute);
app.use("/api/course", courseRouter);
app.use("/api/reset-password", resetPasswordRoute);
