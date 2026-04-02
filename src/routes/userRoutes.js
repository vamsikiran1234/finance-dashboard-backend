const express = require("express");
const userController = require("../controllers/userController");
const { requireRoles } = require("../middleware/roleMiddleware");
const { validateCreateUser, validateUpdateUserStatus } = require("../middleware/validation");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.post("/", requireRoles([ROLES.ADMIN]), validateCreateUser, userController.createUser);
router.get("/", requireRoles([ROLES.ADMIN]), userController.getUsers);
router.patch(
  "/:id/status",
  requireRoles([ROLES.ADMIN]),
  validateUpdateUserStatus,
  userController.updateUserStatus
);

module.exports = router;
