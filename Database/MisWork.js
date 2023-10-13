const mongoose = require('mongoose');

const misWorkSchema = new mongoose.Schema({
  employeeId: Number,
  employeeName: String,
  dateOfVisit: Date,
  natureOfFieldWork: String,
  misDeptProjectName: String,
  misDetails: String,
  status: String,
});

const MISWork = mongoose.model('MISWork', misWorkSchema);

module.exports = MISWork;
