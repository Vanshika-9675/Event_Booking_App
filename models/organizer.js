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
    },
    myBookings:{
        type:[
            { 
                bookingId:mongoose.Schema.Types.ObjectId,
                userId:mongoose.Schema.Types.ObjectId,
                eventId:mongoose.Schema.Types.ObjectId,
                eventName:{
                    type:String,
                    required:true,
                },
                userName:{
                    type: String,
                    required: true
                },
                ticket: {
                    type: String,
                    required: true
                }
            }
        ],
        default:[]
    }
})

module.exports = mongoose.model("organizer",organizerSchema);