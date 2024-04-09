const mongoose = require('mongoose');


const ticketSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("ticket",ticketSchema);
