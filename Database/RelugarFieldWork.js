const mongoose = require('mongoose');

const regularFieldWorkSchema = new mongoose.Schema({
  employeeId: {
    type: Number,
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
  },
  dateOfVisit: {
    type: Date,
    required: true,
  },
  natureOfFieldWork: String,
  placesOfVisit: [String],
  purposeOfVisit: String,
  briefReport: String,
  villageWiseKeyPersons: [String], 
  contactNumbers: [String], 
  geoTaggedPhotos: [String], 
  uploadPetrolBill: String,
  vehicleNumber: String,
  openingReading: Number,
  closingReading: Number,
  totalKmsTravelled: Number,
  status: String,
});

const RegularFieldWork = mongoose.model('RegularFieldWork', regularFieldWorkSchema);

module.exports = RegularFieldWork;
