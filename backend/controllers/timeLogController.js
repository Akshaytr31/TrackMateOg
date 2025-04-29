const TimeLog = require("../models/TimeLog");
const User = require("../models/User");
const { DateTime } = require('luxon');

const getSummary = async (userId) => {
  const punches = await Punch.find({ userId: userId }).sort({ inTime: 1 });
  const lastPunch = punches[punches.length - 1];
  const isPunchedOut = lastPunch?.outTime !== null;
  const grouped = {};

  punches.forEach((punch) => {
    const date = new Date(parseInt(punch.inTime)).toISOString().split("T")[0];
    if (!grouped[date]) grouped[date] = [];

    grouped[date].push(punch);
  });

  const workedHoursPerDay = [];

  for (const [date, punchList] of Object.entries(grouped)) {
    let totalMs = 0;

    punchList.forEach((punch) => {
      if (punch.outTime) {
        const inTime = new Date(parseInt(punch.inTime));
        const outTime = new Date(
          parseInt(punch.outTime ? punch.outTime : Date.now())
        );
        totalMs += outTime - inTime;
      }
    });

    const hours = totalMs / 1000 / 60 / 60;
    workedHoursPerDay.push({ date, hours });
  }
  return { workedHoursPerDay, isPunchedOut };
};

const getAdminSummary = async (req) => {
  const userIds = req?.body;
  const punches = await Punch.find({ userId: { $in: userIds } }).sort({
    inTime: 1,
  });
  const groupedByUser = {};
  const userMap = {};

  punches.forEach((punch) => {
    const date = new Date(parseInt(punch.inTime)).toISOString().split("T")[0];
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
      punchList.forEach((punch) => {
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
  users.forEach((user) => {
    userMap[user._id] = user.name;
  });

  const allDates = Array.from(allDatesSet).sort();

  const workedHoursPerDay = allDates.map((date) => {
    const row = { date };
    for (const userId of userIds) {
      const name = userMap[userId];
      row[name] = workedHoursMap[userId]?.[date] || 0;
    }
    return row;
  });

  return {
    workedHoursPerDay,
    users: users.map((u) => ({ _id: u._id.toString(), name: u.name })),
  };
};

const getPunchSummary = async (req, res) => {
  try {
    let result;
    if (req.user.role !== "admin") {
      result = await getSummary(req.user.id);
    } else {
      result = await getAdminSummary(req);
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const checkTimeLog = async (req, istTime) => {
  const date = istTime.toFormat('yyyy-MM-dd');
  const timeLog = await TimeLog.findOne({
    userId: req.user.id, 
    date: date   
  });
  return timeLog ? true : false
};

const createNewTimeLog = async (req, istTime) => {
  const date = istTime.toFormat('yyyy-MM-dd');
  const TimeLogData = {
    userId: req.user.id,
    date: date,
    taskSessions: [
      {
        taskId: req.params.taskId,
        sessions: [
          {
            in: istTime.toMillis(),
            out: null
          }
        ]
      }
    ]
  } 
  const timeLog = await TimeLog.create(TimeLogData);
  return timeLog;
};

const checkTaskSession = async (req, istTime) => {
  const date = istTime.toFormat('yyyy-MM-dd');
  const timeLog = await TimeLog.findOne({
    userId: req.user.id, 
    date: date, 
    'taskSessions.taskId': req.params.taskId
  });
  return timeLog ? true : false
};

const createNewTaskSession = async (req, istTime) => {
  const date = istTime.toFormat('yyyy-MM-dd');
  const query = {
    userId: req.user.id,
    date: date
  };
  const newTaskSession = {
    taskId: req.params.taskId,
    sessions: [
      {
        in: istTime.toMillis(),
        out: null
      }
    ]
  }
  const result = await TimeLog.findOneAndUpdate(
    query, 
    {
      $push: {taskSessions: newTaskSession}
    },
    {new: true}
  )
  return result;
};

const checkAndUpdateSession = async (req, istTime) => {
  const date = istTime.toFormat('yyyy-MM-dd');
  const timeLog = await TimeLog.findOne({
    userId: req.user.id, 
    date: date, 
    'taskSessions.taskId': req.params.taskId,
  })
  
  if (!timeLog) return null;
  
  const taskSession = timeLog.taskSessions.find(
    ts => ts.taskId.toString() === req.params.taskId
  );
  
  if (!taskSession) return null;
  
  // Find the active session (where out is null)
  const sessionIndex = taskSession.sessions.findIndex(session => session.out === null);
  let result = null;
  if (sessionIndex === -1){
    result = await TimeLog.findOneAndUpdate(
      {
        userId: req.user.id,
        date: date,
        'taskSessions.taskId': req.params.taskId
      },
      {
        $push: { 'taskSessions.$.sessions': { in: istTime.toMillis(), out: null } }
      },
      { new: true }
    );
  } else {
    // Set the out time
    const updatePath = `taskSessions.$[task].sessions.${sessionIndex}.out`;
    
    result = await TimeLog.findOneAndUpdate(
      { 
        userId: req.user.id,
        date: date
      },
      { 
        $set: { [updatePath]: istTime.toMillis() }
      },
      {
        arrayFilters: [{ 'task.taskId': req.params.taskId }],
        new: true
      }
    );
  };
  console.log(result);
  return result;
};

const getTimeLog = async (req, istTime) => {
  const timeLogcheck = await checkTimeLog(req, istTime);
  let result = null;
  if (timeLogcheck){
    console.log('TimeLog Already exist.')
    const taskCheck = await checkTaskSession(req, istTime);
    if (taskCheck){
      console.log('Task already exist')
      result = await checkAndUpdateSession(req, istTime);
    } else {
      result = await createNewTaskSession(req, istTime);
      console.log('Task session', result);
    }
  } else {
    result = await createNewTimeLog(req, istTime);
    console.log('Time log session', result);
  }
  return result;
};

const registerTime = async (req, res) => {
  const istTime = DateTime.now().setZone('Asia/Kolkata');
  const timeLog = await getTimeLog(req, istTime);
  return res.status(200).json(timeLog);
};

module.exports = { getPunchSummary, registerTime };




///////