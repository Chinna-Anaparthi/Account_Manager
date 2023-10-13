const mongoose = require("mongoose");

const trainingWorkshopSchema = new mongoose.Schema({
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
  natureOfFieldWork: {
    type: String,
    required: true,
  },
  trainingConductedBy: String,
  trainingPlace: String,
  trainingSubject: String,
  personsAttended: String,
  briefReport: String,
  geoTaggedPhotos: [String], 
  uploadPetrolBill: String,
  vehicleNumber: String,
  openingReading: Number,
  closingReading: Number, 
  totalKmsTravelled: Number,
  status: String,
});

const TrainingWorkshop = mongoose.model("TrainingWorkshop", trainingWorkshopSchema);

module.exports = TrainingWorkshop;
