const Punch = require("../models/TimeLog");

const recordPunch = async (req, res) => {
    try {
        // const currentTime = Date.now();
        const currentTime = new Date('2025-04-04 19:30:15').getTime();

        const punch = await Punch.create({
            userId: req.user.id,
            dateTime: currentTime
        })

        res.status(201).json({ message: "Punch Recorded successfully.", punch });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getPunchSummery = async (req, res) => {
    try {
        const punches = await Punch.find({ userId: req.user.id }).sort({ dateTime: 1 });

        const grouped = {};

        punches.forEach(punch => {
            const date = new Date(parseInt(punch.dateTime)).toISOString().split('T')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(punch.dateTime);
        });

        console.log('grouped', grouped);

        const workedHoursPerDay = [];

        for (const [date, timestamps] of Object.entries(grouped)) {
            let totalMs = 0;
            for (let i = 0; i < timestamps.length; i += 2) {
                const inTime = new Date(parseInt(timestamps[i]));
                const outTime = timestamps[i + 1] ? new Date(parseInt(timestamps[i + 1])) : null;
                if (outTime) {
                    totalMs += outTime - inTime;
                }
                console.log('inTime, outTime, totalMs', inTime, outTime, totalMs)
            }
            // const hours = Math.round(totalMs / 1000 / 60 / 60); // convert ms to hours
            const hours = totalMs / 1000 / 60 / 60; // convert ms to hours
            console.log('hours', hours);
            workedHoursPerDay.push({date: date, hours: hours});
        }

        res.status(200).json(workedHoursPerDay);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

module.exports = { recordPunch, getPunchSummery };