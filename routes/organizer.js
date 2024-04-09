const express = require("express");
const router = express.Router();

const {orgaanizerLogin,organizerRegister,editProfile} = require('../controllers/organizerAuth');
const {addEvent,deleteEvent,editEvent , fetchEventsbyOrganizerId} = require('../controllers/events');
const {authenticateOrganizer} = require('../middleware/Auth');

router.post('/register',organizerRegister);
router.post('/login',orgaanizerLogin);
router.put('/edit',authenticateOrganizer,editProfile);

router.post('/event',authenticateOrganizer,addEvent);
router.delete('/event/:id',authenticateOrganizer,deleteEvent);
router.put('/event/:id',authenticateOrganizer,editEvent);
router.get('/event/:id',fetchEventsbyOrganizerId);

module.exports = router;