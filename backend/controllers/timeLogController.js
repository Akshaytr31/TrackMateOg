const TimeLog = require("../models/TimeLog");
const User = require("../models/User");
const { DateTime } = require('luxon');

// summary

const getSummary = async (userId) => {
  const timeLogs = await TimeLog.find({
    userId: userId
  });

  const lastPunches = {};
  const workedHoursPerDay = [];
  
  timeLogs.forEach((log) => {
    // const istTime = DateTime.now().setZone('Asia/Kolkata');
    let date = DateTime.fromISO(log.date);
    let hours = 0;
    log.taskSessions.forEach((task) => {
      lastPunches[task.taskId] = task.sessions[task.sessions.length - 1];
      task.sessions.forEach((session) => {
        const inTime = DateTime.fromMillis(parseInt(session.in));
        const outTime = session.out ? DateTime.fromMillis(parseInt(session.out)) : date.endOf('day'); 
        hours += (outTime - inTime) / (1000 * 60 * 60); // ms to hours
      });      
    })
    date = log.date;
    workedHoursPerDay.push({date, hours});
  });
  return { lastPunches, workedHoursPerDay };



  // const punches = await Punch.find({ userId: userId }).sort({ inTime: 1 });
  // const lastPunch = punches[punches.length - 1];
  // const isPunchedOut = lastPunch?.outTime !== null;
  // const grouped = {};

  // punches.forEach((punch) => {
  //   const date = new Date(parseInt(punch.inTime)).toISOString().split("T")[0];
  //   if (!grouped[date]) grouped[date] = [];

  //   grouped[date].push(punch);
  // });

  // const workedHoursPerDay = [];

  // for (const [date, punchList] of Object.entries(grouped)) {
  //   let totalMs = 0;

  //   punchList.forEach((punch) => {
  //     if (punch.outTime) {
  //       const inTime = new Date(parseInt(punch.inTime));
  //       const outTime = new Date(
  //         parseInt(punch.outTime ? punch.outTime : Date.now())
  //       );
  //       totalMs += outTime - inTime;
  //     }
  //   });

  //   const hours = totalMs / 1000 / 60 / 60;
  //   workedHoursPerDay.push({ date, hours });
  // }
  // return { workedHoursPerDay, isPunchedOut };
};

const getAdminSummary = async (req) => {
  
  const userIds = req?.body.userIds;
  const timeLogs = await TimeLog.find({ userId: { $in: userIds } });

  const workedHoursMap = {};
  const userMap = {};
  const allDatesSet = new Set();

  timeLogs.forEach((log) => {
    const userId = log.userId.toString();
    const date = log.date; 
    allDatesSet.add(date);

    let hours = 0;

    log.taskSessions.forEach((task) => {
      task.sessions.forEach((session) => {
        const inTime = DateTime.fromMillis(parseInt(session.in));
        const outTime = session.out ? DateTime.fromMillis(parseInt(session.out)) : DateTime.now().setZone('Asia/Kolkata');
        hours += (outTime - inTime) / (1000 * 60 * 60);
      });
    });

    if (!workedHoursMap[userId]) workedHoursMap[userId] = {};
    workedHoursMap[userId][date] = (workedHoursMap[userId][date] || 0) + hours;
  });


  const users = await User.find({ _id: { $in: userIds } });
  users.forEach((user) => {
    userMap[user._id.toString()] = user.name;
  });

  const allDates = Array.from(allDatesSet).sort();

  const workedHoursPerDay = allDates.map((date) => {
    const row = { date };
    userIds.forEach((userId) => {
      const name = userMap[userId];
      row[name] = workedHoursMap[userId]?.[date] || 0;
    });
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

// register timelog

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
  return result;
};

const getTimeLog = async (req, istTime) => {
  const timeLogcheck = await checkTimeLog(req, istTime);
  let result = null;
  if (timeLogcheck){
    const taskCheck = await checkTaskSession(req, istTime);
    if (taskCheck){
      result = await checkAndUpdateSession(req, istTime);
    } else {
      result = await createNewTaskSession(req, istTime);
    }
  } else {
    result = await createNewTimeLog(req, istTime);
  }
  return result;
};

const registerTime = async (req, res) => {
  const istTime = DateTime.now().setZone('Asia/Kolkata');
  const timeLog = await getTimeLog(req, istTime);
  return res.status(200).json(timeLog);
};

module.exports = { getPunchSummary, registerTime };
