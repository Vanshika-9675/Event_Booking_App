const Event = require('../models/event');

//Filtering events based on category 
exports.fetchCategory = async(req,res)=>{
    try {
        const category = req.params.category;
        const events = await Event.find({ category });
        res.json(events);
    } catch (error) {
        res.status(500).json({ 
            success:false,
            error: 'Internal Server Error'
         });
    }
}

//Filtering events based on date
exports.fetchDate = async(req,res)=>{
    try {
        const date = new Date(req.params.date);
        const events = await Event.find({ date });
        res.json(events);
    } catch (error) {
        res.status(500).json({ 
            success:false,
            error: 'Internal Server Error' 
        });
    }
}

//Filtering events based on location
exports.fetchLocation = async(req,res)=>{
    try {
        const location = req.params.location;
        const events = await Event.find({ location });
        res.json(events);
    } catch (error) {
        res.status(500).json({ 
            success:false,
            error: 'Internal Server Error'
         });
    }
}