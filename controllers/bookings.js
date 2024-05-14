const Event = require('../models/event');
const User = require('../models/user')
const Organizer = require('../models/organizer');

//fetch ticket types of particular event 
exports.fetchTicketTypes = async(req,res)=>{
   try {    
    const eventId = req.params.eventId;
    
    const event = await Event.findById(eventId);

    if (!event) {
        return res.status(404).json(
            { 
                success:false,
                message: "Event not found"
            }
        );
    }
    
    res.status(200).json({
        success:true,
        data:event.tickets
    })

   }
   catch (error) {
       res.status(500).json({
            success:false,
            message:"Internal server error!!"
       })
   }
}

//booking tickets
exports.bookTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.eventId;
        const ticketId = req.params.ticketId;
        const {email} = req.body;
        const {userName} = req.body;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({   
                success: false,
                message: "User not found"
            });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const {orgId} = event;

        const organizer = await Organizer.findById(orgId);
        
        if(!organizer){
            return res.status(404).json({
                success:false,
                messafe:'Organizer not found!!'
            })
        }

        const ticket = event.tickets.find(t => (t._id).toString() === ticketId);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket type not found for this event"
            });
        }


        if(ticket.ticketNum<=0){
             return res.status(400).json({
                success:false,
                message:"Ticket of this type are no longer available!"
             })
        }
        else{
            ticket.ticketNum--;   
        }

        await event.save();

        const { eventName, description, date, time, location } = event;
        const {TicketType , price } = ticket;


        user.bookings.push({
            eventId,
            ticketId,
            eventName,
            description,
            date,
            time,
            location,
            ticket: TicketType,
            price,
            userName,
            email
        });

        await user.save();


        const size =  user.bookings.length;

        const bookingId = user.bookings[size-1]._id;

        organizer.myBookings.push({
            bookingId,
            eventName,
            eventId,
            userName,
            userId,
            ticket:TicketType,
        })

        await organizer.save();

        return res.status(200).json({
            success: true,
            data: user.bookings
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//fetching all the bookings of particular user
exports.fetchUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).populate({
            path: 'bookings',
            select: '-__v'
        }).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            bookings: user.bookings
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//cancel booking 
exports.cancelBooking = async(req,res)=>{
    try {
         const bookingId = req.params.bookingId;

         const userId = req.user.id;
         const user = await User.findById(userId);

        const index = user.bookings.findIndex(booking => booking._id.toString() === bookingId);
        
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const eventId = user.bookings[index].eventId;

        const ticketId = user.bookings[index].ticketId;
        
        user.bookings.splice(index,1);

        await user.save();

       
        const event = await Event.findById(eventId);

        const ind = event.tickets.findIndex(ticket => ticket._id.toString() === ticketId.toString());

        if(ind==-1){
            return res.status(404).json({
                success: false,
                message: "Coudn't cancel!!"
            });
        }

        event.tickets[ind].ticketNum++;

        await event.save();
       
       return res.status(200).json(
        {
            success:true,
            message:"Booking cancelled successfully!!"
        }
       )

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//fetching all the organizer bookings for their event tickets
exports.fetchOrganizerBooking = async(req,res)=>{
    try {
        const orgId = req.organizer.id;

        const organizer = await Organizer.findById(orgId);

        if(!organizer){
            return res.status(404).json({
                success:false,
                message:'Organizer not found!!'
            })
        }

        res.status(200).json({
            success:true,
            data:organizer.myBookings
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


//api for cancelling booking of a user by organizer
exports.cancelBookingByOrganizer = async (req,res)=>{
    try {
          const orgId = req.organizer.id;
          const id = req.params.id;

          const organizer = await Organizer.findById(orgId);


          const i = organizer.myBookings.findIndex(b => b._id.toString() === id);

          if (i === -1) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        

          const {bookingId,userId} = organizer.myBookings[i];

          organizer.myBookings.splice(i,1);

         await organizer.save()
        
          const user = await User.findById(userId);

          if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found!!"
            })
          }

        const index = user.bookings.findIndex(booking => booking._id.toString() === bookingId.toString());

       
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

       const eventId = user.bookings[index].eventId;

       const ticketId = user.bookings[index].ticketId;
       
       user.bookings.splice(index,1);

       await user.save()
      
       const event = await Event.findById(eventId);

       const ind = event.tickets.findIndex(ticket => ticket._id.toString() === ticketId.toString());

       if(ind==-1){
           return res.status(404).json({
               success: false,
               message: "Coudn't cancel!!"
           });
       }

       event.tickets[ind].ticketNum++;

       await event.save();
      
      return res.status(200).json(
       {
           success:true,
           message:"Booking cancelled successfully!!"
       }
      )

   } catch (error) {
       console.log(error);
       return res.status(500).json({
           success: false,
           message: "Internal server error"
       });
   }
}
