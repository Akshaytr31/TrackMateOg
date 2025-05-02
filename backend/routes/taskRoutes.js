const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getUserDashboardData,
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskCheckList, 
  getAssignedTasks
} = require("../controllers/taskController");

const Task = require('../models/Task'); // Ensure you import your Task model

const router = express.Router();

// Dashboard Routes

router.get("/user-dashboard-data", protect, getUserDashboardData);

// Task Management Routes
router.get("/", protect, adminOnly, getTasks);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.put("/:id/status", protect, updateTaskStatus );
router.put("/:id/todo", protect, updateTaskCheckList );
router.get('/assigned', protect, getAssignedTasks );
router.delete("/api/task/:taskId", protect, adminOnly, deleteTask );


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

