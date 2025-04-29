const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  in: { 
    type: String, 
    required: true 
  },
  out: { 
    type: String, 
    default: null 
  }
}, { _id: false });

// TaskSession schema - to track sessions for a specific task
const taskSessionSchema = new mongoose.Schema({
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task',
    required: true
  },
  sessions: [sessionSchema]
}, { _id: false }); // Prevent MongoDB from creating IDs for each taskSession

// Refactored TimeLog schema
const timeLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true // Add index for faster queries by user
  },
  date: { 
    type: String, 
    required: true,
    index: true // Add index for faster date-based queries
  },
  taskSessions: [taskSessionSchema]  // Renamed from taskIds for clarity
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});


const TimeLog = mongoose.model('TimeLog', timeLogSchema);

module.exports = TimeLog;