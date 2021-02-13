const express = require("express");
const app = express();
const port = 5000;
const { google } = require("googleapis");
const request = require("request");
const cors = require("cors");
const urlParse = require("url-parse");
const queryParse = require("query-string");
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

app.use(
    cors(
        {
            origin: ["http://localhost:4200"],
            credentials: true,
        }
    )
);
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

const publicDirectory = path.join(__dirname, "./public");
// console.log(__dirname);
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cookieParser());

app.set("view engine", "hbs");

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL Connected");
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/getURLAuth", (req, res) => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        //link to redirect to
        "http://localhost:5000/sleep"
    );

    const scopes = ["https://www.googleapis.com/auth/fitness.sleep.read profile email openid"]

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    })

    request(url, (err, response, body) => {
        console.log("Error: ", err);
        console.log("statusCode: ", response && response.statusCode);
        res.send({ url });
    })

});

app.get("/heart_rate", async (req, res) => {

    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        //link to redirect to
        "http://localhost:5000/heart_rate"
    );

    const tokens = await oauth2Client.getToken(code);

    // console.log("Tokens: ", tokens);

    console.log(code);

    res.send("HELLO");

    let heartArray = [];

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
            data: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.heart_rate.bpm",
                    },
                ],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis: 1608674399000,
                endTimeMillis: 1608760799000,
            },
        });

        console.log(result);
        heartArray = result.data.bucket

    } catch (e) {
        console.log(e);
    }

    try {
        for (const dataSet of heartArray) {
            console.log(dataSet);
            for (const points of dataSet.dataset) {
                console.log(points);
                for (const heart of points.point) {
                    console.log(heart.value);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
})

app.get("/blood_pressure", async (req, res) => {

    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        //link to redirect to
        "http://localhost:5000/blood_pressure"
    );

    const tokens = await oauth2Client.getToken(code);

    // console.log("Tokens: ", tokens);

    console.log(code);

    res.send("HELLO");

    let heartArray = [];

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
            data: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.blood_pressure",
                        // dataStreamId: "derived: com.google.blood_pressure: com.google.android.gms: merged",
                    },
                ],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis: 1612043999000,
                endTimeMillis: 1612130399000,
            },
        });

        console.log(result);
        bloodArray = result.data.bucket;

    } catch (e) {
        console.log(e);
    }

    try {
        for (const dataSet of bloodArray) {
            console.log(dataSet);
            for (const points of dataSet.dataset) {
                console.log(points);
                for (const blood of points.point) {
                    console.log(blood.value);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
})

app.get("/sleep", async (req, res) => {

    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        //link to redirect to
        "http://localhost:5000/sleep"
    );

    const tokens = await oauth2Client.getToken(code);

    // console.log("Tokens: ", tokens);

    console.log(code);

    res.send("HELLO");

    let heartArray = [];

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
            data: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.sleep.segment",
                        // dataStreamId: "derived: com.google.blood_pressure: com.google.android.gms: merged",
                    },
                ],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis: 1613210400000,
                endTimeMillis: 1613235359000,
            },
        });

        console.log(result);
        sleepArray = result.data.bucket;

    } catch (e) {
        console.log(e);
    }

    try {
        for (const dataSet of sleepArray) {
            console.log(dataSet);
            for (const points of dataSet.dataset) {
                console.log(points);
                for (const sleep of points.point) {
                    console.log(sleep.value);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
})

app.get("/steps", async (req, res) => {

    const queryURL = new urlParse(req.url);
    const code = queryParse.parse(queryURL.query).code;

    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        //link to redirect to
        "http://localhost:5000/steps"
    );

    const tokens = await oauth2Client.getToken(code);

    // console.log("Tokens: ", tokens);

    console.log(code);

    res.send("HELLO");

    let stepArray = [];

    try {
        const result = await axios({
            method: "POST",
            headers: {
                authorization: "Bearer " + tokens.tokens.access_token
            },
            "Content-Type": "application/json",
            url: `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
            data: {
                aggregateBy: [
                    {
                        dataTypeName: "com.google.step_count.delta",
                        dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                    },
                ],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis: 1607119199000,
                endTimeMillis: 1607205599000,
            },
        });

        // console.log(result);
        stepArray = result.data.bucket

    } catch (e) {
        console.log(e);
    }

    try {
        for (const dataSet of stepArray) {
            console.log(dataSet);
            for (const points of dataSet.dataset) {
                console.log(points);
                for (const steps of points.point) {
                    console.log(steps.value);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
})

app.post("/sendEmail", (req, res) => {
    console.log("request came...");
    // let Email = req.body;
    // let CompanyName = req.body;
    let user = req.body;
    sendEmail(user, info => {
        console.log(`The mail has been sent and the message is ${info.messageId}`);
        res.send(info);
    });
});

async function sendEmail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: 'mHealthRecords', // sender address
        to: user.Email, // list of receivers
        subject: "Congratulations! You are the new user of the mHealthRecords platform! 😎", // Subject line
        html: `<h1>Hi ${user.Name},</h1><br>
      <h4>Thanks for joining us! 😎</h4><br>
      <h3>🎉🎉🎉 ${user.Message} 🎉🎉🎉</h3>`
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    callback(info);
}

app.use("/auth", require("./routes/auth"));

app.listen(port, () => console.log(`GOOGLE FIT IS LISTENING ON PORT ${port}`));