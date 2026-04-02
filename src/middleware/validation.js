const { ROLES, USER_STATUS, RECORD_TYPES } = require("../config/constants");
const AppError = require("../utils/AppError");

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function hasEmptyBody(body) {
  return !isObject(body) || Object.keys(body).length === 0;
}

function isValidRole(role) {
  return Object.values(ROLES).includes(String(role).toUpperCase());
}

function isValidUserStatus(status) {
  return Object.values(USER_STATUS).includes(String(status).toUpperCase());
}

function isValidRecordType(type) {
  return Object.values(RECORD_TYPES).includes(String(type).toUpperCase());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCreateUser(req, res, next) {
  const requestBody = req.body;

  if (hasEmptyBody(requestBody)) {
    return next(new AppError("Request body is required", 400));
  }

  const { name, email, role } = requestBody;

  if (!name || !email || !role) {
    return next(new AppError("name, email, and role are required", 400));
  }

  if (typeof name !== "string" || !name.trim()) {
    return next(new AppError("name must be a non-empty string", 400));
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return next(new AppError("email must be a valid email address", 400));
  }

  if (!isValidRole(role)) {
    return next(new AppError("role must be one of VIEWER, ANALYST, ADMIN", 400));
  }

  return next();
}

function validateUpdateUserStatus(req, res, next) {
  const requestBody = req.body;

  if (hasEmptyBody(requestBody)) {
    return next(new AppError("Request body is required", 400));
  }

  const { status } = requestBody;

  if (!status) {
    return next(new AppError("status is required", 400));
  }

  if (!isValidUserStatus(status)) {
    return next(new AppError("status must be ACTIVE or INACTIVE", 400));
  }

  return next();
}

function validateRecordCreate(req, res, next) {
  const requestBody = req.body;

  if (hasEmptyBody(requestBody)) {
    return next(new AppError("Request body is required", 400));
  }

  const { amount, type, category, date, notes } = requestBody;

  if (
    typeof amount === "undefined" ||
    typeof type === "undefined" ||
    typeof category === "undefined" ||
    typeof date === "undefined"
  ) {
    return next(new AppError("amount, type, category, and date are required", 400));
  }

  if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
    return next(new AppError("amount must be a non-negative number", 400));
  }

  if (!isValidRecordType(type)) {
    return next(new AppError("type must be INCOME or EXPENSE", 400));
  }

  if (typeof category !== "string" || !category.trim()) {
    return next(new AppError("category must be a non-empty string", 400));
  }

  if (typeof date !== "string" || !date.trim()) {
    return next(new AppError("date must be a non-empty string", 400));
  }

  if (typeof notes !== "undefined" && typeof notes !== "string") {
    return next(new AppError("notes must be a string", 400));
  }

  return next();
}

function validateRecordUpdate(req, res, next) {
  const requestBody = req.body;

  if (hasEmptyBody(requestBody)) {
    return next(new AppError("Request body is required", 400));
  }

  const { amount, type, category, date, notes } = requestBody;

  if (typeof amount !== "undefined") {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
      return next(new AppError("amount must be a non-negative number", 400));
    }
  }

  if (typeof type !== "undefined") {
    if (!isValidRecordType(type)) {
      return next(new AppError("type must be INCOME or EXPENSE", 400));
    }
  }

  if (typeof category !== "undefined") {
    if (typeof category !== "string" || !category.trim()) {
      return next(new AppError("category must be a non-empty string", 400));
    }
  }

  if (typeof date !== "undefined") {
    if (typeof date !== "string" || !date.trim()) {
      return next(new AppError("date must be a non-empty string", 400));
    }
  }

  if (typeof notes !== "undefined" && typeof notes !== "string") {
    return next(new AppError("notes must be a string", 400));
  }

  return next();
}

module.exports = {
  validateCreateUser,
  validateUpdateUserStatus,
  validateRecordCreate,
  validateRecordUpdate
};
