const mongoose = require("mongoose");

const userRegistrationSchema = new mongoose.Schema({
    First_name: {
        type: String,
        required: true,
    },
    Last_name: {
        type: String,
        required: true,
    },
    Role: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Phone: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Image: String, 
    Emp_ID: {
        type: String, 
    },
});

const UserRegistration = mongoose.model("UserRegistration", userRegistrationSchema);

module.exports = UserRegistration;
