import Joi from "joi";

export const userRegistrationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  gender: Joi.string().valid("Male", "Female").required(),

  dateOfBirth: Joi.date(),

  image: Joi.string().uri().optional(),

  role: Joi.string().valid("Admin", "User").default("User"),
});
