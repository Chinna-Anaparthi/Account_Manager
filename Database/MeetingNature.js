const mongoose = require('mongoose');

const meetingNatureSchema = new mongoose.Schema({
  employeeId: Number,
  employeeName: String,
  dateOfVisit: Date,
  natureOfFieldWork: String,
  meetingNature: String,
  meetingOther: String,
  meetingDeptProjectName: String,
  meetingAgenda: String,
  meetingMembers: [String], 
  meetingMinutes: String,
  meetingActionPoints: String,
  officeUploadGeoTaggedPhotos: String, 
  status: String
});

const MeetingNature = mongoose.model('MeetingNature', meetingNatureSchema);

module.exports = MeetingNature;
