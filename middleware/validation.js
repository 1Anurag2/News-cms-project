const { body } = require("express-validator");

const loginValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .matches(/^\S+$/)
    .withMessage("Username must not contain spaces")
    .isLength({ min: 5, max: 15 })
    .withMessage("Username must be 5 to 15 characters long"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),

  // .isStrongPassword()
  // .withMessage('Password must be strong, including upper, lower, special, and numeric characters')
];
const userValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 5, max: 25 })
    .withMessage("Fullname must be 5 to 25 characters long"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["Author", "Admin"])
    .withMessage("Only Author or Admin are selected"),
];

const userUpdateValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 5, max: 25 })
    .withMessage("Fullname must be 5 to 25 characters long"),

  body("password")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 12 })
    .withMessage("Password must be 5 to 12 characters long"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["Author", "Admin"])
    .withMessage("Only Author or Admin are selected"),
];

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 7, max: 15 })
    .withMessage("Category name must be 7 to 15 charector long"),

  body("description")
    .isLength({ max: 100 })
    .withMessage("Description must be 100 charactor long"),
];

const articalValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 7, max: 50 })
    .withMessage("Title must be 7 to 50 charactor long"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 50, max: 1500 })
    .withMessage("Content must be 50 to 1500 charactor long"),

  body("category").trim().notEmpty().withMessage("Category is required"),
];
module.exports = {
  loginValidation,
  userValidation,
  userUpdateValidation,
  categoryValidation,
  articalValidation,
};
