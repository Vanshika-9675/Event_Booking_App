const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  orgId:mongoose.Schema.Types.ObjectId,
  eventName: {
    type: String,
    required: true,
  },
  category:{
     type:String,
     required:true
  },
  description: {
    type: String, 
  },
  date: {
    type: Date,
    required: true,
  },
  time: { 
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  Imagesrc:{
      type:String,
      required:true
  },
  tickets: {
    type: [
      {
        TicketType: {
          type: String,
        },
        ticketNum: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("event", eventSchema);
