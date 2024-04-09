const Event = require('../models/event');
const Organizer = require('../models/organizer');

//api for  adding event details
exports.addEvent = async(req,res)=>{
    try {

        const { eventName, description, date, time, location, capacity, tickets } = req.body;

        const orgId = req.organizer.id;
    
        if(!(eventName, description, date, time, location, capacity, tickets)){
            res.status(400).json({
                success:false,
                message:"Enter all the details carefully"
            })
        }
    
        const event = new Event({
            eventName,
            description,
            date,
            time,
            location,
            capacity,
            tickets
        });
    
        await event.save();

        const organizer = await Organizer.findById(orgId);
    
        if (!organizer) {
            return res.status(404).json({
                 success:false,
                 message: 'Organizer not found'
            });
        }

        organizer.events.push(event);

       await organizer.save();

        res.status(200).json({
            success:true,
            message:"Event added successfully"
        })
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}

//api for deleting event 
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const orgId = req.organizer.id;

        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const organizer = await Organizer.findById(orgId);

        organizer.events = organizer.events.filter(event => event._id.toString() !== eventId);

        await organizer.save(); 

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

//api for editing event
exports.editEvent = async (req, res) => {
    try {
        const { eventName, description, date, time, location, capacity, tickets } = req.body;
        const eventId = req.params.id;

        const orgId = req.organizer.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found!"
            })
        }

        if (eventName) event.eventName = eventName;
        if (description) event.description = description;
        if (date) event.date = date;
        if (time) event.time = time;
        if (location) event.location = location;
        if (capacity) event.capacity = capacity;
        if (tickets) event.tickets = tickets;

        await event.save();

        const organizer = await Organizer.findById(orgId); // Added await here

        const index = organizer.events.findIndex(event => event._id.toString() === eventId);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Event not found in organizer events array'
            });
        }

        organizer.events[index] = event;

        await organizer.save();

        res.status(200).json({
            success: true,
            message: "Event updated successfully!!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

//api to get events by organizer id
exports.fetchEventsbyOrganizerId = async(req,res)=>{
   try {

        const orgId = req.params.id;

        const organizer = await Organizer.findById(orgId);

        if(!organizer){
            res.status(404).json({
                success:false,
                message:"Organizer not found!!"
            })
        }

        res.status(200).json({
            success:true,
            events:organizer.events,
        })
        
   } catch (error) {
     console.log(error);
     res.status(500).json({
        success:false,
        message:"Internal server error"
     })
   }

}

//api to get all events with details
exports.fetchAllEvents = async(req,res)=>{
    try {
        const events = await Event.find();
         
        res.status(200).json({
            success:true,
            data:events
        })

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
           success:false,
           message:"Internal server error"
        })
    }
}