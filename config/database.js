const mongoose = require('mongoose');

require('dotenv').config();

exports.dbConnect = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("Connected to Database successfully!!");
    }).catch((err)=>{
        console.log(err);
        console.log("Error in connecting to database!");
    })
}