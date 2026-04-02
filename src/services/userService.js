const userModel = require("../models/userModel");
const { USER_STATUS } = require("../config/constants");
const AppError = require("../utils/AppError");

async function createUser(payload) {
  const existing = await userModel.getUserByEmail(payload.email.toLowerCase());

  if (existing) {
    throw new AppError("Email already exists", 409);
  }

  return userModel.createUser({
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    role: payload.role.toUpperCase(),
    status: USER_STATUS.ACTIVE
  });
}

async function getUsers() {
  return userModel.getAllUsers();
}

async function updateUserStatus(userId, status) {
  const user = await userModel.getUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return userModel.updateUserStatus(userId, status.toUpperCase());
}

module.exports = {
  createUser,
  getUsers,
  updateUserStatus
};
