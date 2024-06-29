const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Import cookie-parser

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Allow credentials (cookies)
}));
app.use(cookieParser());

// access all stuff in models
const db = require('./models');


// Routers
const studentRouter = require('./routes/Student');
app.use("/student", studentRouter);
const teacherRouter = require('./routes/Teacher');
app.use("/teacher", teacherRouter);
////////////////////


db.sequelize.sync().then(() => { //Checks if there are any tables in models that are not in sql, and adds them 
    app.listen(3001, () => {
        console.log("server started");
    });
});



