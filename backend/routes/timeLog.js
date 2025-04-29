const express = require("express");
const router = express.Router();
const TimeLog = require("../models/TimeLog");
const { protect } = require("../middlewares/authMiddleware");
const { getPunchSummary, registerTime } = require("../controllers/timeLogController");

router.post("/summary", protect, getPunchSummary);

router.get("/register/time/:taskId", protect, registerTime);

module.exports = router;



