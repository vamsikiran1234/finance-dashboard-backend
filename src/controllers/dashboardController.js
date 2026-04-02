const dashboardService = require("../services/dashboardService");
const { sendSuccess } = require("../utils/response");

async function getSummary(req, res, next) {
  try {
    const summary = await dashboardService.getSummary();
    return sendSuccess(res, 200, summary);
  } catch (error) {
    return next(error);
  }
}

async function getCategoryBreakdown(req, res, next) {
  try {
    const breakdown = await dashboardService.getCategoryBreakdown();
    return sendSuccess(res, 200, breakdown);
  } catch (error) {
    return next(error);
  }
}

async function getMonthlyTrends(req, res, next) {
  try {
    const trends = await dashboardService.getMonthlyTrends();
    return sendSuccess(res, 200, trends);
  } catch (error) {
    return next(error);
  }
}

async function getRecentActivity(req, res, next) {
  try {
    const recent = await dashboardService.getRecentActivity();
    return sendSuccess(res, 200, recent);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
};
