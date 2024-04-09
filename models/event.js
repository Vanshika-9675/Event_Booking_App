const mongoose = require('mongoose');
const ticket = require('./ticket');

const eventSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    capacity:{
       type:Number,
       required:true
    },
    tickets:{
        type: [ticket.Schema],
        default: []
    }
})

module.exports = mongoose.model("event",eventSchema);
