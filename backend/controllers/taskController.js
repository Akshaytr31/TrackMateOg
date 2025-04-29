const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    console.log("Incoming task data:", req.body);

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



// Dummy routes (placeholders)
const getDashboardData = (req, res) => {
  res.json({ message: "Dashboard data placeholder" });
};

const getUserDashboardData = (req, res) => {
  res.json({ message: "User dashboard data placeholder" });
};

const getTaskById = (req, res) => {
  res.json({ message: `Fetching task with ID ${req.params.id}` });
};

const updateTask = (req, res) => {
  res.json({ message: `Updating task with ID ${req.params.id}` });
};



const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};


const updateTaskStatus=async (req,res)=>{
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
}

const updateTaskCheckList = (req, res) => {
  res.json({ message: `Updating checklist for task with ID ${req.params.id}` });
};

module.exports = {
  createTask,
  getTasks,
  getDashboardData,
  getUserDashboardData,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskCheckList,
  assignUsersToTask
};

