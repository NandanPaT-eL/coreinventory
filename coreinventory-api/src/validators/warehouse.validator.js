// backend/src/validators/warehouse.validator.js
import { body, param, validationResult } from "express-validator";

// This returns an array of express-validator checks
export const validateWarehouse = [
  body("name")
    .notEmpty().withMessage("Warehouse name is required")
    .isString().withMessage("Name must be a string")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters")
    .trim(),

  body("code")
    .notEmpty().withMessage("Warehouse code is required")
    .isString().withMessage("Code must be a string")
    .isLength({ max: 20 }).withMessage("Code cannot exceed 20 characters")
    .isAlphanumeric().withMessage("Code must contain only letters and numbers")
    .toUpperCase()
    .trim(),

  body("location.address")
    .optional()
    .isString().withMessage("Address must be a string")
    .isLength({ max: 200 }).withMessage("Address cannot exceed 200 characters")
    .trim(),

  body("location.city")
    .optional()
    .isString().withMessage("City must be a string")
    .isLength({ max: 50 }).withMessage("City cannot exceed 50 characters")
    .trim(),

  body("location.state")
    .optional()
    .isString().withMessage("State must be a string")
    .isLength({ max: 50 }).withMessage("State cannot exceed 50 characters")
    .trim(),

  body("location.country")
    .optional()
    .isString().withMessage("Country must be a string")
    .isLength({ max: 50 }).withMessage("Country cannot exceed 50 characters")
    .trim(),

  body("location.zipCode")
    .optional()
    .isString().withMessage("ZIP code must be a string")
    .isLength({ max: 20 }).withMessage("ZIP code cannot exceed 20 characters")
    .trim(),

  body("contact.phone")
    .optional()
    .isString().withMessage("Phone must be a string")
    .isLength({ max: 20 }).withMessage("Phone cannot exceed 20 characters")
    .trim(),

  body("contact.email")
    .optional()
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("contact.manager")
    .optional()
    .isString().withMessage("Manager name must be a string")
    .isLength({ max: 100 }).withMessage("Manager name cannot exceed 100 characters")
    .trim(),

  body("isActive")
    .optional()
    .isBoolean().withMessage("isActive must be a boolean")
];

export const validateWarehouseId = [
  param("id")
    .isMongoId().withMessage("Invalid warehouse ID format")
];