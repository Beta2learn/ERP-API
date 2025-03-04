import Joi from "joi";

export const registerUserSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "The mame field is required.",
    }),
  email: Joi.string()
    .required()
    .email({ tlds: { allow: ["com", "net", "org", "fr", "uk", "lu", "ng"] } })
    .messages({
      "string.email": "The email must be a valid email address.",
      "any.required": "The email field is required.",
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp(/^[a-zA-Z0-9!@#$%^&*]{8,}$/))
    .messages({
      "string.pattern.base":
        "The password must be at least 8 characters long and can include letters, numbers, or special characters (!@#$%^&*).",
      "any.required": "The password field is required.",
    }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({ tlds: { allow: ["com", "net", "org", "fr", "uk", "lu", "ng"] } })
    .messages({
      "string.email": "The email must be a valid email address.",
      "any.required": "The email field is required.",
    }),
  password: Joi.string()
    .required()
    .pattern(new RegExp(/^[a-zA-Z0-9!@#$%^&*]{8,}$/))
    .messages({
      "string.pattern.base":
        "The password must be at least 8 characters long and can include letters, numbers, or special characters (!@#$%^&*).",
      "any.required": "The password field is required.",
    }),
});

export const updateUserRoleSchema = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[a-f\d]{24}$/i)
    .messages({
      "string.pattern.base": "The userId must be a valid ObjectId.",
      "any.required": "The userId field is required.",
    }),
  role: Joi.string()
    .required()
    .valid("Administrator", "Employee")
    .messages({
      "any.only": "The role must be either 'Administrator' or 'Employee'.",
      "any.required": "The role field is required.",
    }),
})