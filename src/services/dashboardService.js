const dashboardModel = require("../models/dashboardModel");

async function getSummary() {
  return dashboardModel.getSummary();
}

async function getCategoryBreakdown() {
  return dashboardModel.getCategoryBreakdown();
}

async function getMonthlyTrends() {
  return dashboardModel.getMonthlyTrends();
}

async function getRecentActivity() {
  return dashboardModel.getRecentActivity();
}

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity
};
