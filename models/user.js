const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    bookings:{
        type: [
          {
            eventId:mongoose.Schema.Types.ObjectId,
            ticketId:mongoose.Schema.Types.ObjectId,
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
            ticket: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
          }
        ],
        default: [] 
    }
})

module.exports = mongoose.model("user",userSchema);