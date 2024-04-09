const {dbConnect} = require('./config/database');
const express = require('express');
const cookieParser = require('cookie-parser');
const user = require('./routes/user');
const organizer = require('./routes/organizer');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

//connecting to Database
dbConnect();

//mounting routes
app.use('/api/v1/user',user);
app.use('/api/v1/organizer',organizer);

//server
app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`);
});