const userService = require("../services/userService");
const { sendSuccess } = require("../utils/response");

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return sendSuccess(res, 201, user, "User created successfully");
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    return sendSuccess(res, 200, users);
  } catch (error) {
    return next(error);
  }
}

async function updateUserStatus(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const user = await userService.updateUserStatus(userId, req.body.status);
    return sendSuccess(res, 200, user, "User status updated successfully");
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  updateUserStatus
};
