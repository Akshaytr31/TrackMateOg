const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");

// Debugging statement to check the import path
// console.log("Looking for userController.js in:", __dirname + "/../controllers/userController");

const { getUsers, getUserById, deleteUser } = require("../controllers/userController"); 

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, getUserById);
// router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
