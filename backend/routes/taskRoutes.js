const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskCheckList
} = require("../controllers/taskController");

const Task = require('../models/Task'); // Ensure you import your Task model

const router = express.Router();

// Dashboard Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);

// Task Management Routes
router.get("/", protect, adminOnly, getTasks);
router.post("/", protect, adminOnly, createTask);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskCheckList);

// ✅ GET assigned tasks for a user
router.get('/assigned/:userId', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching assigned tasks' });
  }
});

router.delete("/api/task/:taskId",async (req,res)=>{
  const {taskId}=req.params
  try{
    await Task.findByIdAndDelete(taskId)
    res.status(200).json({message:"Task deleted"})
  }catch(error){
    console.error("Error dleting task:",error)
    res.status(500).json({message:"Failed to delete task"})
  }
})

// ✅ Assign users to a task
router.put('/:taskId/assign', protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignedTo } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Failed to assign users:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.patch("/:id/status", protect, updateTaskStatus);


module.exports = router;



///