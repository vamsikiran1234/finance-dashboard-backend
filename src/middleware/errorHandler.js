const AppError = require("../utils/AppError");

function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body"
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
