const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const Server = require("./Logic")
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const ip = "172.17.15.150";

app.post("/api/email",(req,res)=>{
    Server.sendEmail(req,res,()=>{})
})


app.post('/api/userRegistration', (req, res) => {
    Server.UserregisterPost(req, res, () => { });
})

app.post('/api/adminRegistration', (req, res) => {
    Server.AdminregisterPost(req, res, () => { });
})

app.post('/api/userLogin', (req, res) => {
    Server.UserLogin(req, res, () => { });
})

app.get('/api/adminGet', (req, res) => {
    Server.AdminGet(req, res, () => { })
})

app.delete('/api/admindeletewith-Email/:Email', (req, res) => {
    Server.AdminDeleteEmail(req, res, () => { })
})

app.delete('/api/admindeletewith-Adminid/:Adminid', (req, res) => {
    Server.AdminDeleteId(req, res, () => { })
})
app.post('/api/RegularFieldWork', (req, res) => {
    Server.FieldworkPost(req, res, () => { });
})

app.put('/api/RegularFieldWork-Status-Update/:employeeId', (req, res) => {
    Server.FieldworkStatusUpdate(req, res, () => { });
})

app.post('/api/TrainingWorkshop', (req, res) => {
    Server.TrainingWorkshopPost(req, res, () => { });
})

app.put('/api/TrainingWorkshop-Status-Update/:employeeId', (req, res) => {
    Server.TrainingWorkshopstatusUpdate(req, res, () => { });
})

app.post('/api/OfficeTour', (req, res) => {
    Server.OfficeTourPost(req, res, () => { });
})

app.put('/api/OfficeTour-Status-Update/:employeeId', (req, res) => {
    Server.officeTourstatusUpdate(req, res, () => { });
})

app.post('/api/MeetingNature', (req, res) => {
    Server.MeetingNaturePost(req, res, () => { });      
})

app.put('/api/MeetingNature-Status-Update/:employeeId', (req, res) => {
    Server.MeetingNaturestatusUpdate(req, res, () => { });
})

app.post('/api/MisWork', (req, res) => {
    Server.MisWorkPost(req, res, () => { });
})

app.put('/api/MisWork-Status-Update/:employeeId', (req, res) => {
    Server.MisWorkstatusUpdate(req, res, () => { });
})

app.get('/api/RegularFieldWork-Get', (req, res) => {
    Server.FieldworkGet(req, res, () => { })
})

app.get('/api/TrainingWorkshop-Get', (req, res) => {
    Server.TrainingWorkshopGet(req, res, () => { })
})

app.get('/api/OfficeTour-Get', (req, res) => {
    Server.officeTourGet(req, res, () => { })
})

app.get('/api/MeetingNature-Get', (req, res) => {
    Server.MeetingNatureGet(req, res, () => { })
})

app.get('/api/MisWork-Get', (req, res) => {
    Server.MisWorkGet(req, res, () => { })
})

mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Account_Manager MongoDB Connected");
    })
    .catch((error) => {
        console.log(error);
    });

app.listen(port, ip, () => {
    console.log(`Server listening on port http://${ip}:${port}`);
});

