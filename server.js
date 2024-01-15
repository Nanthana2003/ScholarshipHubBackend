const express = require("express");
const app = express();
const session = require("express-session");
// const MongoStore = new require("connect-mongo").session;
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("./middlewares/Passport.js");
const multer = require("multer");
const bodyParser = require("body-parser");
const upload = multer();
dotenv.config();

app.use(
    cors({
        origin:"*"
    })
);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(upload.array())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth",require("./routes/auth"));
app.use("/sch",require("./routes/Addscholarships"))
app.use("/chatsection",require("./routes/Chatmessages"))

mongoose.connect("mongodb://mongo:27017/scholarships").then(()=>{
    console.log("Connected to database");
    app.listen(process.env.PORT, ()=>{
        console.log("Server running in port "+process.env.PORT);
    })
}).catch((err)=>{
    console.log(err);
})