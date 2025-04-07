const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  in: Date,
  out: Date,
});

const timeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  sessions: [sessionSchema],
});

const punchLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateTime: String,
});

module.exports = mongoose.model('TimeLog', timeLogSchema);
module.exports = mongoose.model('Punch', punchLogSchema);


////]