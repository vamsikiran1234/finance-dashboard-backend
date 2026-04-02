function sendSuccess(res, statusCode, data, message) {
  const payload = { success: true };

  if (message) {
    payload.message = message;
  }

  if (typeof data !== "undefined") {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendSuccess
};
