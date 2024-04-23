const express = require("express");
const router = express.Router();

const {userLogin,userRegister,editProfile,deleteProfile} = require('../controllers/userAuth');
const {authenticateUser} = require('../middleware/Auth')
const {fetchAllEvents} = require('../controllers/events');
const {fetchTicketTypes, bookTickets,fetchUserBookings ,cancelBooking} = require("../controllers/bookings");
const {fetchCategory,fetchDate,fetchLocation} = require("../controllers/filtering")

//user auth routes
router.post('/register',userRegister);
router.post('/login',userLogin);
router.put('/edit',authenticateUser,editProfile);
router.delete('/delete',authenticateUser,deleteProfile);
//fetching all events
router.get('/events',fetchAllEvents);

//get ticket types of particular event 
router.get('/tickets/:eventId',fetchTicketTypes);

//route for booking a particular event's particular type of ticket
router.post('/book/:eventId/:ticketId',authenticateUser,bookTickets)

//route for fetching bookings of particular user 
router.get('/book',authenticateUser,fetchUserBookings);

//route for cancelling booking
router.delete('/book/:bookingId',authenticateUser,cancelBooking);

//filtering

//on the basis of category
router.get('/filter/category/:category',fetchCategory);
//on the basis of location
router.get('/filter/location/:location',fetchLocation);
//on the basis of date
router.get('/filter/date/:date',fetchDate);

module.exports = router;    
