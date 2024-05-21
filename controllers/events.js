const Event = require('../models/event');
const Organizer = require('../models/organizer');
const mongoose = require('mongoose');

//api for  adding event details
exports.addEvent = async(req,res)=>{
    try {

        const { eventName,category,description, date, time, location, tickets,Imagesrc } = req.body;

        const orgId = req.organizer.id;
    
        if(!(eventName,category, description, date, time, location, tickets,Imagesrc)){
            res.status(400).json({
                success:false,
                message:"Enter all the details carefully"
            })
        }
    
        const event = new Event({
            orgId,
            eventName,
            category,
            description,
            date,
            time,
            location,
            tickets,
            Imagesrc
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
        
        const { eventName,category,description, date, time, location, tickets } = req.body;
        const eventId = req.params.id;

        console.log(eventId);

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID' });
        }
        

        const orgId = req.organizer.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found!"
            })
        }

        if (eventName) event.eventName = eventName;
        if (category) event.category = category;
        if (description) event.description = description;
        if (date) event.date = date;
        if (time) event.time = time;
        if (location) event.location = location;
        if (tickets) event.tickets = tickets;

        await event.save();

        const organizer = await Organizer.findById(orgId); 

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

        const orgId = req.organizer.id;

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

//fetch event by id
exports.fetchSingleEvent= async(req , res)=>{
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found!"
            })
        }
        res.status(200).json({
            data:event,
            success: true,
            message: "Event updated successfully!!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
           success:false,
           message:"Internal server error"
        })
    }
}