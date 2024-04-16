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
  tickets: {
    type: [
      {
        TicketType: {
          type: String,
          required: true,
        },
        ticketNum: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("event", eventSchema);
