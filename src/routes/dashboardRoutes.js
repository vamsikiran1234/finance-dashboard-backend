const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { requireRoles } = require("../middleware/roleMiddleware");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.get(
  "/summary",
  requireRoles([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getSummary
);
router.get(
  "/categories",
  requireRoles([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getCategoryBreakdown
);
router.get(
  "/trends",
  requireRoles([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getMonthlyTrends
);
router.get(
  "/recent",
  requireRoles([ROLES.ANALYST, ROLES.ADMIN]),
  dashboardController.getRecentActivity
);

module.exports = router;
