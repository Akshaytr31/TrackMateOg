// const { default: axiosInstance } = require("../../frontend/Task-Manager/src/utils/axiosInstance");
const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' }).select("-password");
        res.json(users);
    } catch (error) {
        console.error("Error in getUsers:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc    Get user by Id////]
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user=await User.findById(req.params.id).select("-password")
        if(!user)return res.status(404).json({message:"user not found"})
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// const updateProfile = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const { profileImageUrl } = req.body;
  
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { profileImageUrl },
//         { new: true }
//       );
  
//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role,
//         profileImageUrl: updatedUser.profileImageUrl,
//       });
//     } catch (err) {
//       res.status(500).json({ message: "Failed to update profile." });
//     }
//   };
  


module.exports = { getUsers, getUserById };

/////