const express = require("express");
const recordController = require("../controllers/recordController");
const { requireRoles } = require("../middleware/roleMiddleware");
const { validateRecordCreate, validateRecordUpdate } = require("../middleware/validation");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.get("/", requireRoles([ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN]), recordController.getRecords);
router.post("/", requireRoles([ROLES.ADMIN]), validateRecordCreate, recordController.createRecord);
router.put("/:id", requireRoles([ROLES.ADMIN]), validateRecordUpdate, recordController.updateRecord);
router.delete("/:id", requireRoles([ROLES.ADMIN]), recordController.deleteRecord);

module.exports = router;
