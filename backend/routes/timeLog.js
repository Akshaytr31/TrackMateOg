const express = require('express');
const router = express.Router();
const TimeLog = require('../models/TimeLog');
const { protect } = require("../middlewares/authMiddleware");
const { recordPunch, getPunchSummary } = require('../controllers/punchController');

router.get("/punch", protect, recordPunch);

router.post("/summary", protect, getPunchSummary);

router.post('/start', async (req, res) => {
    const { userId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    let log = await TimeLog.findOne({ userId, date: today });

    if (!log) {
        log = new TimeLog({ userId, date: today, sessions: [] });
    }

    if (!log.sessions.length || log.sessions[log.sessions.length - 1].out) {
        log.sessions.push({ in: new Date() });
        await log.save();
        return res.status(200).json({ message: "Check-in recorded." });
    } else {
        return res.status(400).json({ error: "You already checked in without checking out." });
    }
});


router.post('/stop', async (req, res) => {
    const { userId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const log = await TimeLog.findOne({ userId, date: today });

    if (!log || !log.sessions.length) {
        return res.status(400).json({ error: "No check-in found for today." });
    }

    const lastSession = log.sessions[log.sessions.length - 1];

    if (!lastSession.out) {
        lastSession.out = new Date();
        await log.save();
        return res.status(200).json({ message: "Check-out recorded." });
    } else {
        return res.status(400).json({ error: "Already checked out." });
    }
});


router.get('/summary/:userId', async (req, res) => {
    const logs = await TimeLog.find({ userId: req.params.userId });

    const summary = logs.map(log => {
        let totalMs = 0;
        log.sessions.forEach(session => {
            if (session.in && session.out) {
                totalMs += new Date(session.out) - new Date(session.in);
            }
        });

        const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(2);

        return {
            date: log.date,
            totalHours: parseFloat(totalHours)
        };
    });

    res.json(summary);
});

module.exports = router;




//////