const Punch = require("../models/TimeLog");
const User=require("../models/User");

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

const getSummary = async (userId) => {
    const punches = await Punch.find({ userId: userId }).sort({ inTime: 1 });
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
    return {workedHoursPerDay, isPunchedOut};
}

const getAdminSummary = async (req) => {
    const userIds = req?.body
    const punches = await Punch.find({ userId: { $in: userIds } }).sort({ inTime: 1 });
    const groupedByUser = {};
    const userMap = {}; // for collecting user names

    punches.forEach(punch => {
        const date = new Date(parseInt(punch.inTime)).toISOString().split('T')[0];
        const userId = punch.userId.toString();

        if (!groupedByUser[userId]) groupedByUser[userId] = {};
        if (!groupedByUser[userId][date]) groupedByUser[userId][date] = [];

        groupedByUser[userId][date].push(punch);
    });

    const allDatesSet = new Set();

    const workedHoursMap = {};

    for (const [userId, datePunches] of Object.entries(groupedByUser)) {
        workedHoursMap[userId] = {};
        for (const [date, punchList] of Object.entries(datePunches)) {
            allDatesSet.add(date);

            let totalMs = 0;
            punchList.forEach(punch => {
                if (punch.outTime) {
                    const inTime = new Date(parseInt(punch.inTime));
                    const outTime = new Date(parseInt(punch.outTime));
                    totalMs += outTime - inTime;
                }
            });

            const hours = totalMs / 1000 / 60 / 60;
            workedHoursMap[userId][date] = hours;
        }
    }

    // Get user details
    const users = await User.find({ _id: { $in: userIds } });
    users.forEach(user => {
        userMap[user._id] = user.name;
    });

    const allDates = Array.from(allDatesSet).sort();

    const workedHoursPerDay = allDates.map(date => {
        const row = { date };
        for (const userId of userIds) {
            const name = userMap[userId];
            row[name] = workedHoursMap[userId]?.[date] || 0;
        }
        return row;
    });

    const lastUserPunches = punches.filter(p => p.userId.toString() === userIds[userIds.length - 1]);
    const lastPunch = lastUserPunches[lastUserPunches.length - 1];
    const isPunchedOut = lastPunch?.outTime !== null;

    return {
        workedHoursPerDay,
        users: users.map(u => ({ _id: u._id.toString(), name: u.name })),
        isPunchedOut
    };
};


const getPunchSummary = async (req, res) => {
    try {
        let result;
        if(req.user.role!=='admin'){
            result = await getSummary(req.user.id);
        }else{
            result = await getAdminSummary(req);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message})
    }
}

module.exports = { recordPunch, getPunchSummary };