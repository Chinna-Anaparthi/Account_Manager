const mongoose = require("mongoose");

const adminRegistrationSchema = new mongoose.Schema({
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
    Adminid: {
        type: String, 
    },
    
});

const AdminRegistration = mongoose.model("AdminReg", adminRegistrationSchema);

module.exports = AdminRegistration;


