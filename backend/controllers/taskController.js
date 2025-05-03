const Task = require("../models/Task");
const TimeLog = require('../models/TimeLog');
const { DateTime } = require('luxon');

// Create Task
const createTask = async (req, res) => {
  try {

    if (!req.body.title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error in createTask:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Tasks
// GET /api/tasks?userId=abc123
const getTasks = async (req, res) => {
  const { userId } = req.query;

  const filter = userId ? { assignedTo: userId } : {};

  try {
    const tasks = await Task.find(filter).populate("assignedTo");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

// PUT /api/tasks/:taskId/assign
const assignUsersToTask = async (req, res) => {
  const { taskId } = req.params;
  const { assignedTo } = req.body;

  try {
      const task = await Task.findByIdAndUpdate(taskId, { assignedTo }, { new: true });
      res.json(task);
  } catch (err) {
      res.status(500).json({ error: "Failed to assign users" });
  }
};


const getUserDashboardData = (req, res) => {
  res.json({ message: "User dashboard data placeholder" });
};

const updateTask = (req, res) => {
  res.json({ message: `Updating task with ID ${req.params.id}` });
};

const updateTaskStatus=async (req,res) => {
  const {id}=req.params
  const {status}=req.body

  try{
    const updatedTask=await Task.findByIdAndUpdate(
      id,
      {status},
      {new:true}
    );
    if (!updatedTask){
      return res.status(404).json({message:"Task not found"})
    }
    res.json(updatedTask)
  }catch(error){
    console.error("Error updating task status:",error)
    res.status(500).json({message:"Failed to update task status"})
  }
};

const updateTaskCheckList = (req, res) => {
  res.json({ message: `Updating checklist for task with ID ${req.params.id}` });
};

const deleteTask =  async (req, res) => {
  const {taskId}=req.params
  try{
    await Task.findByIdAndDelete(taskId)
    res.status(200).json({message:"Task deleted"})
  }catch(error){
    console.error("Error dleting task:",error)
    res.status(500).json({message:"Failed to delete task"})
  }
};

const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id }).populate("assignedTo");
    
    const timeLogs = await TimeLog.find({ userId: req.user.id });

    let taskTimeMap = {};

    timeLogs.forEach((log) => {
      log.taskSessions.forEach((taskSession) => {
        const taskId = taskSession.taskId.toString();
  
        taskSession.sessions.forEach((session) => {
          const time = 0;
          const isRunning = false;
          const start = DateTime.fromMillis(parseInt(session.in));
          const end = session.out ? DateTime.fromMillis(parseInt(session.out)) : DateTime.fromISO(log.date).endOf('day');
          const durationMs = end - start;

          if (!taskTimeMap[taskId]) {
            taskTimeMap[taskId] = { time, isRunning };
          }

          taskTimeMap[taskId].time += durationMs;
        });

        const lastSession = taskSession.sessions[taskSession.sessions.length-1]
        taskTimeMap[taskId].isRunning = lastSession.out ? false : true

      });
    });

    const tasksWithTime = tasks.map((task) => {
      const time = taskTimeMap[task.id]?.time || 0;
      const isRunning = taskTimeMap[task.id]?.isRunning || false;
      return {
        ...task.toObject(),
        time,
        isRunning
      };
    });

    res.json(tasksWithTime);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks"+error });
  }
}

module.exports = {
  createTask,
  getTasks,
  getUserDashboardData,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskCheckList,
  assignUsersToTask, 
  getAssignedTasks
};
