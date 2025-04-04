const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { 
    getDashboardData, 
    getUserDashboardData, 
    getTasks, 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask, 
    updateTaskStatus, 
    updateTaskCheckList 
} = require("../controllers/taskController");

const router = express.Router();

// Dashboard Routes
router.get("/dashboard-data", protect, getDashboardData); // Admin dashboard data
router.get("/user-dashboard-data", protect, getUserDashboardData); // User-specific dashboard data

// Task Management Routes
router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get a task by ID
router.post("/", protect, adminOnly, createTask); // Create a task (Admin only)
router.put("/:id", protect, updateTask); // Update task details
router.delete("/:id", protect, adminOnly, deleteTask); // Delete a task (Admin only)
router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskCheckList); // Update task checklist

module.exports = router;






///////]]]




