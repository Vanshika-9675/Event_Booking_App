const express = require("express");
const router = express.Router();

const {orgaanizerLogin,organizerRegister,editProfile,deleteProfile} = require('../controllers/organizerAuth');
const {addEvent,deleteEvent,editEvent , fetchEventsbyOrganizerId} = require('../controllers/events');
const {authenticateOrganizer} = require('../middleware/Auth');
const {fetchOrganizerBooking,cancelBookingByOrganizer} = require('../controllers/bookings')

//organizer auth routes
router.post('/register',organizerRegister);
router.post('/login',orgaanizerLogin);
router.put('/edit',authenticateOrganizer,editProfile);
router.delete('/delete',authenticateOrganizer,deleteProfile);

//route for adding event 
router.post('/event',authenticateOrganizer,addEvent);
//route for deleting event
router.delete('/event/:id',authenticateOrganizer,deleteEvent);
//route for editing particular event
router.put('/event/:id',authenticateOrganizer,editEvent);
//route for getting all the events of particular organizer
router.get('/event',authenticateOrganizer,fetchEventsbyOrganizerId);
//organizer bookings for their events tickets
router.get('/book',authenticateOrganizer,fetchOrganizerBooking)
//cancelling user tickets
router.delete('/book/:id',authenticateOrganizer,cancelBookingByOrganizer);

module.exports = router;