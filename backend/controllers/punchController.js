const Punch = require("../models/TimeLog");

const recordPunch = async (req, res) => {
    try {
        const currentTime = Date.now();
        let punch;
        const lastPunch = await Punch.findOne({ userId: req.user.id }).sort({inTime: -1});
          
        
        if (lastPunch && lastPunch.outTime === null) {
            await Punch.updateOne(
              { _id: lastPunch._id },
              { $set: { outTime: currentTime } }
            );
            punch = { ...lastPunch._doc, outTime: JSON.stringify(currentTime)};
        }else{
            punch = await Punch.create({
                userId: req.user.id,
                inTime: currentTime,
                outTime: null
            })
        }

        res.status(201).json({ message: "Punch Recorded successfully.", punch});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getPunchSummary = async (req, res) => {
    try {
        const punches = await Punch.find({ userId: req.user.id }).sort({ inTime: 1 });
        const lastPunch = punches[punches.length - 1];
        const isPunchedOut = lastPunch?.outTime !== null;
        const grouped = {};

        punches.forEach(punch => {
            const date = new Date(parseInt(punch.inTime)).toISOString().split('T')[0];
            if (!grouped[date]) grouped[date] = [];

            grouped[date].push(punch);
        });

        const workedHoursPerDay = [];

        for (const [date, punchList] of Object.entries(grouped)) {
            let totalMs = 0;

            punchList.forEach(punch => {
                if (punch.outTime) {
                    const inTime = new Date(parseInt(punch.inTime));
                    const outTime = new Date(parseInt(punch.outTime? punch.outTime : Date.now()));
                    totalMs += outTime - inTime;
                }
            });

            const hours = totalMs / 1000 / 60 / 60; // convert ms to hours
            workedHoursPerDay.push({ date, hours});
        }

        res.status(200).json({workedHoursPerDay, isPunchedOut});

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

module.exports = { recordPunch, getPunchSummary };