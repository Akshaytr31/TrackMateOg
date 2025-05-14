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

const taskSessionSchema = new mongoose.Schema({
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task',
    required: true
  },
  sessions: [sessionSchema]
}, { _id: false }); 


const timeLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true 
  },
  date: { 
    type: String, 
    required: true,
    index: true 
  },
  taskSessions: [taskSessionSchema]  
}, {
  timestamps: true
});


const TimeLog = mongoose.model('TimeLog', timeLogSchema);

module.exports = TimeLog;