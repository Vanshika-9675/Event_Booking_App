const mongoose = require('mongoose');
const event = require('./event');

const organizerSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    events:{
        type: [event.Schema],
        default: []
    }
})

module.exports = mongoose.model("organizer",organizerSchema);