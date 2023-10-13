const mongoose = require('mongoose');

const officeTourSchema = new mongoose.Schema({
  employeeId: Number,
  employeeName: String,
  dateOfVisit: Date,
  natureOfFieldWork: String,
  officePlace: String,
  officePurpose: String,
  refMailLetterNo: String,
  officeBriefReport: String,
  officeGeoTaggedPhotos: [String], 
  officeMembersParticipated: String,
  officeUploadGeoTaggedPhotos: [String], 
  officeModeOfTransport: String,
  officeUploadBills: [String], 
  officeDuration: String,
  status: String,
});

const OfficeTour = mongoose.model('OfficeTour', officeTourSchema);

module.exports = OfficeTour;
