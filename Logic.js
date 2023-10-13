const UserRegistration = require("./Database/UserRegistration");
const AdminRegistration = require("./Database/AdminRegistration")
const RegularFieldWork = require('./Database/RelugarFieldWork');
const TrainingWorkshop = require("./Database/TrainingWorkshop");
const OfficeTour = require('./Database/OfficeTour');
const MeetingNature = require('./Database/MeetingNature');
const MISWork = require('./Database/MisWork');


const multer = require('multer');
const path = require('path');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const jwtSecret = 'chinna';


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
});

const upload = multer({ storage: storage });

const getNextEmpID = async () => {
    const latestUser = await UserRegistration.findOne({}, { Emp_ID: 1 }, { sort: { Emp_ID: -1 } });
    if (latestUser) {
        const latestEmpID = parseInt(latestUser.Emp_ID);
        return (latestEmpID + 1).toString().padStart(4, '0');
    } else {
        return '1000';
    }
};

const getNextId = async () => {
    const latestUser = await AdminRegistration.findOne({}, { Adminid: 1 }, { sort: { Adminid: -1 } });
    if (latestUser) {
        const latestEmpID = parseInt(latestUser.Adminid);
        return (latestEmpID + 1).toString().padStart(4, '0');
    } else {
        return '1000';
    }
};

const UserregisterPost = async (req, res) => {
    try {
        upload.single('Image')(req, res, async (error) => {
            if (error) {
                console.error('Error uploading profile image:', error);
                return res.status(500).json({ message: 'Error uploading profile image' });
            }

            const { First_name, Last_name, Role, Email, Phone, Password } = req.body;
            const Image = req.file ? req.file.filename : '';

            if (!First_name || !Last_name || !Role || !Email || !Phone || !Password) {
                throw new Error(
                    "All fields (First_name, Last_name, Role, Email, Phone, and Password) are required."
                );
            }
            const existingUser = await UserRegistration.findOne({ Email });
            const existingPhoneNumber = await UserRegistration.findOne({ Phone });
            if (existingUser) {
                return res.status(400).json({
                    message: "This Email is already registered. Please use a different email.",
                });
            }
            if (existingPhoneNumber) {
                return res.status(400).json({
                    message: "This phone number is already registered. Please use a different phone number.",
                });
            }
            const Emp_ID = await getNextEmpID(); // Get the next Emp_ID in order
            const newUserRegistration = new UserRegistration({
                First_name,
                Last_name,
                Role,
                Email,
                Phone,
                Password,
                Image,
                Emp_ID,
            });

            sendEmail(
                Email,
                'Registration Successful',
                `Welcome to our platform! Your registration was successful as ${Role}. Now you can log in with the following credentials:\n\nPhone number: ${Phone}\nPassword: ${Password}`
            );
            await newUserRegistration.save();

            res.status(201).json({
                message: "User Successfully Registered...! Now You Can Login",
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while registering user",
            error: error.message,
        });
    }
};

function sendEmail(Email, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'barnbastelagareddy123@gmail.com',
            pass: 'bfeokdbsgiixadtm',
        },
    });

    const mailOptions = {
        from: 'barnbastelagareddy123@gmail.com',
        to: Email,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

const AdminregisterPost = async (req, res) => {
    try {
        upload.single('Image')(req, res, async (error) => {
            if (error) {
                console.error('Error uploading profile image:', error);
                return res.status(500).json({ message: 'Error uploading profile image' });
            }

            const { First_name, Last_name, Role, Email, Phone, Password } = req.body;
            const Image = req.file ? req.file.filename : '';

            if (!First_name || !Last_name || !Role || !Email || !Phone || !Password) {
                throw new Error(
                    "All fields (First_name, Last_name, Role, Email, Phone, and Password) are required."
                );
            }
            const existingUser = await AdminRegistration.findOne({ Email });
            const existingPhoneNumber = await AdminRegistration.findOne({ Phone });
            if (existingUser) {
                return res.status(400).json({
                    message: "This Email is already registered. Please use a different email.",
                });
            }
            if (existingPhoneNumber) {
                return res.status(400).json({
                    message: "This phone number is already registered. Please use a different phone number.",
                });
            }
            const Adminid = await getNextId(); // Get the next Emp_ID in order
            const newAdminRegistration = new AdminRegistration({
                First_name,
                Last_name,
                Role,
                Email,
                Phone,
                Password,
                Image,
                Adminid
                
            });

            await newAdminRegistration.save();

            res.status(201).json({
                message: "User Successfully Registered...! Now You Can Login",
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error occurred while registering user",
            error: error.message,  
        });
    }
};


const UserLogin = async (req, res) => {
    const { Password, Phone } = req.body;

    if (!Password || !Phone) {
        return res.status(400).json({ error: 'Password and phone number are required.' });
    }

    try {
        const user = await UserRegistration.findOne({ Phone });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (user.Password !== Password) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                First_name: user.First_name,
                Last_name: user.Last_name,
                Phone: user.Phone,
                Email: user.Email,
                Role: user.Role,
                Image: user.Image,
                Emp_ID: user.Emp_ID
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Authentication successful.', token });
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'An error occurred while checking user.' });
    }
} 

const AdminGet = async (req, res) => {
    try {
        const adminData = await AdminRegistration.find();

        if (!adminData || adminData.length === 0) {
            return res.status(404).json({ error: 'No data found.' });
        }

        res.status(200).json({ message: 'Data retrieved successfully.', users: adminData });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'An error occurred while retrieving data.' });
    }
}

const AdminDeleteEmail = async (req, res) => {
    try {
        const userEmail = req.params.Email; // Use 'Email' parameter as the user's email
        const deletedUser = await AdminRegistration.findOneAndRemove({ Email: userEmail }); // Use 'Email' to find the user

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Sending a success response
        res.status(200).json({ message: 'User deleted successfully.' });

        // Send the decline email
        const emailSubject = 'Declined';
        const emailText = 'Your account has been declined.';

        sendDeclineEmail(userEmail, emailSubject, emailText, (error, info) => {
            if (error) {
                console.error('Error sending decline email:', error);
            } else {
                console.log('Decline email sent:', info.response);
            }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};

function sendDeclineEmail(Email, subject, text, callback) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'barnbastelagareddy123@gmail.com',
            pass: 'bfeokdbsgiixadtm',
        },
    });

    const mailOptions = {
        from: 'barnbastelagareddy123@gmail.com',
        to: Email,
        subject: "Declined",
        text: "Your registration has been declined.",
    };

    transporter.sendMail(mailOptions, callback);
}

const AdminDeleteId = async (req, res) => {
    try {
        const userId = req.params.Adminid;
        const deletedUser = await AdminRegistration.findOneAndRemove({ Adminid: userId });

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};

// const FieldworkPost = async (req, res) => {
//     try {
//         const {
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             placesOfVisit,
//             purposeOfVisit,
//             briefReport,
//             villageWiseKeyPersons,
//             contactNumbers,
//             geoTaggedPhotos,
//             uploadPetrolBill,
//             vehicleNumber,
//             openingReading,
//             closingReading,
//             totalKmsTravelled,
//             status,
//         } = req.body;

//         const newRecord = new RegularFieldWork({
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             placesOfVisit,
//             purposeOfVisit,
//             briefReport,
//             villageWiseKeyPersons,
//             contactNumbers,
//             geoTaggedPhotos,
//             uploadPetrolBill,
//             vehicleNumber,
//             openingReading,
//             closingReading,
//             totalKmsTravelled,
//             status,
//         });

//         await newRecord.save();

//         res.status(200).json({ message: 'Data saved to MongoDB successfully.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error inserting data into MongoDB' });
//     }
// }

const FieldworkPost = async (req, res) => {
    try {
        upload.any()(req, res, async (error) => {
          if (error) {
            console.error('Error uploading files:', error);
            return res.status(500).json({ error: 'Error uploading files' });
          }
          if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files were uploaded.' });
          }
          const geoTaggedPhotos = [];
          let uploadPetrolBill = '';
    
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            if (file.fieldname === 'geoTaggedPhotos') {
              geoTaggedPhotos.push(file.path);
            } else if (file.fieldname === 'uploadPetrolBill') {
              uploadPetrolBill = file.path;
            }
          }
          const {
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            placesOfVisit,
            purposeOfVisit,
            briefReport,
            villageWiseKeyPersons,
            contactNumbers,
            vehicleNumber,
            openingReading,
            closingReading,
            totalKmsTravelled,
            status,
          } = req.body;
    
          const newRecord = new RegularFieldWork({
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            placesOfVisit,
            purposeOfVisit,
            briefReport,
            villageWiseKeyPersons,
            contactNumbers,
            geoTaggedPhotos,
            uploadPetrolBill,
            vehicleNumber,
            openingReading,
            closingReading,
            totalKmsTravelled,
            status,
          });
    
          await newRecord.save();
    
          res.status(200).json({ message: 'RegularFieldWork Data saved to MongoDB successfully.' });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting data into MongoDB' });
      }
  };
  

const FieldworkStatusUpdate = async (req, res) => {
    try {
        const { status } = req.body; // Get status from the request body
        const { employeeId } = req.params; // Get employeeId from URL parameters

        const updatedRecord = await RegularFieldWork.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedRecord) {
            res.status(404).json({ error: 'Record with the provided employeeId not found in the database.' });
        } else {
            res.status(200).json({ message: 'Status updated successfully.', updatedRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating status in MongoDB' });
    }
}

const FieldworkGet = async (req, res) => {
    try {
        const results = await RegularFieldWork.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
}

// const TrainingWorkshopPost = async (req, res) => {
//     try {
//         const {
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             trainingConductedBy,
//             trainingPlace,
//             trainingSubject,
//             personsAttended,
//             briefReport,
//             geoTaggedPhotos,
//             uploadPetrolBill,
//             vehicleNumber,
//             openingReading,
//             closingReading,
//             totalKmsTravelled,
//             status,
//         } = req.body;

//         const newTrainingWorkshop = new TrainingWorkshop({
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             trainingConductedBy,
//             trainingPlace,
//             trainingSubject,
//             personsAttended,
//             briefReport,
//             geoTaggedPhotos,
//             uploadPetrolBill,
//             vehicleNumber,
//             openingReading,
//             closingReading,
//             totalKmsTravelled,
//             status,
//         });

//         await newTrainingWorkshop.save();

//         res.status(200).json({ message: "Data saved to MongoDB successfully." });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error inserting data into MongoDB" });
//     }
// }

const TrainingWorkshopPost = async(req,res)=>
{
    try {
        upload.any()(req, res, async (error) => {
          if (error) {
            console.error('Error uploading files:', error);
            return res.status(500).json({ error: 'Error uploading files' });
          }
          if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files were uploaded.' });
          }
          const geoTaggedPhotos = [];
          let uploadPetrolBill = '';
    
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            if (file.fieldname === 'geoTaggedPhotos') {
              geoTaggedPhotos.push(file.path);
            } else if (file.fieldname === 'uploadPetrolBill') {
              uploadPetrolBill = file.path;
            }
          }
    
          const {
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            trainingConductedBy,
            trainingPlace,
            trainingSubject,
            personsAttended,
            briefReport,
            vehicleNumber,
            openingReading,
            closingReading,
            totalKmsTravelled,
            status,
          } = req.body;
    
          const newRecord = new TrainingWorkshop({
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            trainingConductedBy,
            trainingPlace,
            trainingSubject,
            personsAttended,
            briefReport,
            geoTaggedPhotos,
            uploadPetrolBill,
            vehicleNumber,
            openingReading,
            closingReading,
            totalKmsTravelled,
            status,
          });
    
          await newRecord.save();
    
          res.status(200).json({ message: 'TrainingWorkshop Data saved to MongoDB successfully.' });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting data into MongoDB' });
      }
}

const TrainingWorkshopstatusUpdate = async (req, res) => {
    try {
        const { status } = req.body; // Get status from the request body
        const { employeeId } = req.params; // Get employeeId from URL parameters

        const updatedRecord = await TrainingWorkshop.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedRecord) {
            res.status(404).json({ error: 'Record with the provided employeeId not found in the database.' });
        } else {
            res.status(200).json({ message: 'Status updated successfully.', updatedRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating status in MongoDB' });
    }
}

const TrainingWorkshopGet = async (req, res) => {
    try {
        const results = await TrainingWorkshop.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
}

// const OfficeTourPost = async (req, res) => {
//     try {
//         const {
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             officePlace,
//             officePurpose,
//             refMailLetterNo,
//             officeBriefReport,
//             officeGeoTaggedPhotos,
//             officeMembersParticipated,
//             officeUploadGeoTaggedPhotos,
//             officeModeOfTransport,
//             officeUploadBills,
//             officeDuration,
//             status,
//         } = req.body;

//         // Create a new OfficeTour document
//         const newOfficeTour = new OfficeTour({
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             officePlace,
//             officePurpose,
//             refMailLetterNo,
//             officeBriefReport,
//             officeGeoTaggedPhotos,
//             officeMembersParticipated,
//             officeUploadGeoTaggedPhotos,
//             officeModeOfTransport,
//             officeUploadBills,
//             officeDuration,
//             status,
//         });

//         await newOfficeTour.save();

//         res.status(201).json({ message: 'Data saved to MongoDB successfully.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error inserting data into MongoDB' });
//     }
// }

const OfficeTourPost = async(req,res)=>
{
    try {
        upload.any()(req, res, async (error) => {
          if (error) {
            console.error('Error uploading files:', error);
            return res.status(500).json({ error: 'Error uploading files' });
          }
          if (!req.files || !req.files.length) {
            return res.status(400).json({ error: 'No files were uploaded.' });
          }
          const officeGeoTaggedPhotos = [];
          const officeUploadGeoTaggedPhotos = [];
          const officeUploadBills = [];
    
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            if (file.fieldname === 'officeGeoTaggedPhotos') {
              officeGeoTaggedPhotos.push(file.path);
            } else if (file.fieldname === 'officeUploadGeoTaggedPhotos') {
              officeUploadGeoTaggedPhotos.push(file.path);
            } else if (file.fieldname === 'officeUploadBills') {
              officeUploadBills.push(file.path);
            }
          }
    
          const {
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            officePlace,
            officePurpose,
            refMailLetterNo,
            officeBriefReport,
            officeMembersParticipated,
            officeModeOfTransport,
            officeDuration,
            status,
          } = req.body;
    
          const newRecord = new OfficeTour({
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            officePlace,
            officePurpose,
            refMailLetterNo,
            officeBriefReport,
            officeGeoTaggedPhotos,
            officeMembersParticipated,
            officeUploadGeoTaggedPhotos,
            officeModeOfTransport,
            officeUploadBills,
            officeDuration,
            status,
          });
    
          await newRecord.save();
    
          res.status(200).json({ message: 'OfficeTour Data saved to MongoDB successfully.' });
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting data into MongoDB' });
      }
}

const officeTourstatusUpdate = async (req, res) => {
    try {
        const { status } = req.body; // Get status from the request body
        const { employeeId } = req.params; // Get employeeId from URL parameters

        const updatedRecord = await OfficeTour.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedRecord) {
            res.status(404).json({ error: 'Record with the provided employeeId not found in the database.' });
        } else {
            res.status(200).json({ message: 'Status updated successfully.', updatedRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating status in MongoDB' });
    }
}

const officeTourGet = async (req, res) => {
    try {
        const results = await OfficeTour.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
}

// const MeetingNaturePost = async (req, res) => {
//     try {
//         const {
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             meetingOther,
//             meetingNature,
//             meetingDeptProjectName,
//             meetingAgenda,
//             meetingMembers,
//             meetingMinutes,
//             meetingActionPoints,
//             officeUploadGeoTaggedPhotos,
//             status,
//         } = req.body;

//         const newMeetingNature = new MeetingNature({
//             employeeId,
//             employeeName,
//             dateOfVisit,
//             natureOfFieldWork,
//             meetingNature,
//             meetingOther,
//             meetingDeptProjectName,
//             meetingAgenda,
//             meetingMembers,
//             meetingMinutes,
//             meetingActionPoints,
//             officeUploadGeoTaggedPhotos,
//             status,
//         });

//         // Save the new document to the MongoDB collection
//         await newMeetingNature.save();

//         res.status(200).json({ message: 'Data saved to MongoDB successfully.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error inserting data into MongoDB' });
//     }
// }

const MeetingNaturePost = async (req, res) => {
    try {
        upload.any()(req, res, async (error) => {
            if (error) {
              console.error('Error uploading files:', error);
              return res.status(500).json({ error: 'Error uploading files' });
            }
            if (!req.files || !req.files.length) {
              return res.status(400).json({ error: 'No files were uploaded.' });
            }
      
            let officeUploadGeoTaggedPhotos = '';
      
            for (let i = 0; i < req.files.length; i++) {
              const file = req.files[i];
              if (file.fieldname === 'officeUploadGeoTaggedPhotos') {
                officeUploadGeoTaggedPhotos = file.path;
              }
            }
  
        const {
          employeeId,
          employeeName,
          dateOfVisit,
          natureOfFieldWork,
          meetingOther,
          meetingNature,
          meetingDeptProjectName,
          meetingAgenda,
          meetingMembers,
          meetingMinutes,
          meetingActionPoints,
          status,
        } = req.body;
  
        const newMeetingNature = new MeetingNature({
          employeeId,
          employeeName,
          dateOfVisit,
          natureOfFieldWork,
          meetingNature,
          meetingOther,
          meetingDeptProjectName,
          meetingAgenda,
          meetingMembers, 
          meetingMinutes,
          meetingActionPoints,
          officeUploadGeoTaggedPhotos,
          status,
        });
        await newMeetingNature.save();
        res.status(200).json({ message: 'MeetingNature Data saved to MongoDB successfully.' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error inserting data into MongoDB' });
    }
  };
  
const MeetingNaturestatusUpdate = async (req, res) => {
    try {
        const { status } = req.body; // Get status from the request body
        const { employeeId } = req.params; // Get employeeId from URL parameters

        const updatedRecord = await MeetingNature.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedRecord) {
            res.status(404).json({ error: 'Record with the provided employeeId not found in the database.' });
        } else {
            res.status(200).json({ message: 'Status updated successfully.', updatedRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating status in MongoDB' });
    }
}

const MeetingNatureGet = async (req, res) => {
    try {
        const results = await MeetingNature.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
}

const MisWorkPost = async (req, res) => {
    try {
        const {
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            misDeptProjectName,
            misDetails,
            status,
        } = req.body;

        const newMISWork = new MISWork({
            employeeId,
            employeeName,
            dateOfVisit,
            natureOfFieldWork,
            misDeptProjectName,
            misDetails,
            status,
        });

        await newMISWork.save();

        res.status(201).json({ message: 'Data saved to MongoDB successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting data into MongoDB' });
    }
}

const MisWorkstatusUpdate = async (req, res) => {
    try {
        const { status } = req.body;
        const { employeeId } = req.params;

        const updatedRecord = await MISWork.findOneAndUpdate(
            { employeeId: employeeId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedRecord) {
            res.status(404).json({ error: 'Record with the provided employeeId not found in the database.' });
        } else {
            res.status(200).json({ message: 'Status updated successfully.', updatedRecord });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating status in MongoDB' });
    }
}
const MisWorkGet = async (req, res) => {
    try {
        const results = await MISWork.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from MongoDB' });
    }
}

module.exports = {
    AdminDeleteId,
    AdminDeleteEmail,
    sendEmail,
    MisWorkGet,
    MeetingNatureGet,
    officeTourGet,
    TrainingWorkshopGet,
    FieldworkGet,
    MisWorkstatusUpdate,
    MisWorkPost,
    MeetingNaturestatusUpdate,
    MeetingNaturePost,
    officeTourstatusUpdate,
    OfficeTourPost,
    TrainingWorkshopstatusUpdate,
    UserregisterPost,
    AdminregisterPost,
    UserLogin,
    AdminGet,
    FieldworkPost,
    FieldworkStatusUpdate,
    TrainingWorkshopPost
};
