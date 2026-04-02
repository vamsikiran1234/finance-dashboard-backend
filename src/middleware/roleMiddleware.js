const { ROLES } = require("../config/constants");
const AppError = require("../utils/AppError");

const allowedRoles = Object.values(ROLES);

function getRoleFromHeaders(req) {
  return (req.headers["x-role"] || req.headers.role || "").toString().trim().toUpperCase();
}

function requireRoles(roles) {
  return (req, res, next) => {
    const role = getRoleFromHeaders(req);

    if (!role) {
      return next(new AppError("Role header is required", 401));
    }

    if (!allowedRoles.includes(role)) {
      return next(new AppError("Invalid role", 401));
    }

    if (!roles.includes(role)) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }

    req.userRole = role;
    return next();
  };
}

module.exports = {
  requireRoles
};
