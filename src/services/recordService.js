const recordModel = require("../models/recordModel");
const AppError = require("../utils/AppError");

async function createRecord(payload) {
  return recordModel.createRecord({
    amount: payload.amount,
    type: payload.type.toUpperCase(),
    category: payload.category.trim(),
    date: payload.date,
    notes: typeof payload.notes === "string" ? payload.notes.trim() : null
  });
}

async function getRecords(filters) {
  const parsedLimit = typeof filters.limit !== "undefined" ? Number(filters.limit) : undefined;
  const parsedOffset = typeof filters.offset !== "undefined" ? Number(filters.offset) : undefined;

  const normalizedFilters = {
    type: filters.type ? String(filters.type).toUpperCase() : undefined,
    category: filters.category,
    startDate: filters.startDate ? String(filters.startDate) : undefined,
    endDate: filters.endDate ? String(filters.endDate) : undefined,
    searchTerm: filters.search ? String(filters.search).trim() : undefined,
    limit: Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined,
    offset: Number.isFinite(parsedOffset) && parsedOffset >= 0 ? parsedOffset : undefined
  };

  const records = await recordModel.getRecords(normalizedFilters);
  const totalCount = await recordModel.countRecords(normalizedFilters);

  return {
    records,
    pagination: {
      totalCount,
      limit: Number.isFinite(normalizedFilters.limit) ? normalizedFilters.limit : null,
      offset: Number.isFinite(normalizedFilters.offset) ? normalizedFilters.offset : null
    }
  };
}

async function updateRecord(id, patch) {
  const existing = await recordModel.getRecordById(id);

  if (!existing) {
    throw new AppError("Record not found", 404);
  }

  const normalizedPatch = {};

  if (typeof patch.amount !== "undefined") normalizedPatch.amount = patch.amount;
  if (typeof patch.type !== "undefined") normalizedPatch.type = patch.type.toUpperCase();
  if (typeof patch.category !== "undefined") normalizedPatch.category = patch.category.trim();
  if (typeof patch.date !== "undefined") normalizedPatch.date = patch.date;
  if (typeof patch.notes !== "undefined") normalizedPatch.notes = patch.notes.trim();

  return recordModel.updateRecord(id, normalizedPatch);
}

async function deleteRecord(id) {
  const wasDeleted = await recordModel.deleteRecord(id);

  if (!wasDeleted) {
    throw new AppError("Record not found", 404);
  }
}

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
