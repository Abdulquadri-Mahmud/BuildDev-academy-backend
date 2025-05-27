import joi from "joi";

export const registerSchema = joi.object({
  firstName: joi.string().min(3).max(20).required(),
  lastName: joi.string().min(3).max(20).required(),
  email: joi
    .string()
    .min(5)
    .max(65)
    .email({ tlds: { allow: ["com", "net"] } }),
  phoneNumber: joi.string().min(11).max(11).required(),
  password: joi
    .string()
    .min(8)
    .max(25)
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/))
    .required(),
});

export const enrollForCoursesSchema = joi.object({
  courses: joi.array().min(1).max(10).required(),
});

export const signInSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  password: joi.string().min(8).required().messages({
    "password.min": "Password must be 8 charcters long",
    "any.required": "Password is required",
  }),
});

export const resetPasswordSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please enter valid email address",
    "any.required": "Email is required",
  }),

  resetCode: joi.string().min(6).max(6).required().messages({
    "string.min": "Code must be 6 digits",
    "string.max": "Code must not be longer than 6 digits",
    "any.required": "Reset code is required",
  }),

  newPassword: joi.string().min(8).max(25).required().messages({
    "string.min": "Password must not be less than 8 characters",
    "string.max": "Password must not be longer than 25 characters",
    "any.required": "New password is required",
  }),
});

export const forgetPasswordSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Please enter valid email",
    "any.required": "Email is required",
  }),
});

export const createCourseSchema = joi.object({
  courseName: joi.string().min(1).max(20).required().messages({
    "string.min": "course name must not less than 2 charcters",
    "string.max": "course name must not greater than 20 character",
    "any.required": "Course name is required",
  }),

  price: joi.number().positive().precision(2).required().messages({
    "number.price": "Enter valid price",
    "any.required": "Price is required",
  }),

  category: joi
    .string()
    .required()
    .messages({ "any.required": "Category is required" }),
});

export const initializePaymentSchema = joi.object({
  amount: joi.number().positive().precision(2).required().messages({
    "number.amount": "Invalid amount",
    "any.required": "Amount is required",
  }),
});
