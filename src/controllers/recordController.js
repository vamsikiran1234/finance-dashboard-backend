const recordService = require("../services/recordService");
const { sendSuccess } = require("../utils/response");

async function createRecord(req, res, next) {
  try {
    const record = await recordService.createRecord(req.body);
    return sendSuccess(res, 201, record, "Record created successfully");
  } catch (error) {
    return next(error);
  }
}

async function getRecords(req, res, next) {
  try {
    const records = await recordService.getRecords(req.query);
    return sendSuccess(res, 200, records);
  } catch (error) {
    return next(error);
  }
}

async function updateRecord(req, res, next) {
  try {
    const recordId = Number(req.params.id);
    const record = await recordService.updateRecord(recordId, req.body);
    return sendSuccess(res, 200, record, "Record updated successfully");
  } catch (error) {
    return next(error);
  }
}

async function deleteRecord(req, res, next) {
  try {
    const recordId = Number(req.params.id);
    await recordService.deleteRecord(recordId);
    return sendSuccess(res, 200, null, "Record deleted successfully");
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
