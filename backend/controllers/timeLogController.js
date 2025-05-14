const TimeLog = require("../models/TimeLog");
const User = require("../models/User");
const { DateTime } = require('luxon');

// summary//
const getSummary = async (userId) => {
  const timeLogs = await TimeLog.find({userId: userId});

  const lastPunches = {};
  const workedHoursPerDay = [];
  
  timeLogs.forEach((log) => {
    let date = DateTime.fromISO(log.date).endOf('day');
    const endTime = date < DateTime.now() ? date : DateTime.now();
    let hours = 0;
    log.taskSessions.forEach((task) => {
      task.sessions.forEach((session) => {
        const inTime = DateTime.fromMillis(parseInt(session.in));
        const outTime = session.out ? DateTime.fromMillis(parseInt(session.out)) : endTime; // first we are getting sessions.out, then if not available get endtime.
        hours += (outTime - inTime) / (1000 * 60 * 60); //
      });      
    })
    date = log.date;
    workedHoursPerDay.push({date, hours});
  });
  return { workedHoursPerDay };
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
    const logDate = DateTime.fromISO(log.date).endOf('day');
    const endTime = logDate < DateTime.now() ? logDate : DateTime.now();

    allDatesSet.add(date);

    let hours = 0;

    log.taskSessions.forEach((task) => {
      task.sessions.forEach((session) => {
        const inTime = DateTime.fromMillis(parseInt(session.in));
        const outTime = session.out ? DateTime.fromMillis(parseInt(session.out)) : endTime;
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

//register timelog//

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
  
  const taskSession = timeLog.taskSessions.find(
    ts => ts.taskId.toString() === req.params.taskId
  );
  
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

///