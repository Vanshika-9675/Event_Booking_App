const express = require("express");
const router = express.Router();

const {userLogin,userRegister,editProfile} = require('../controllers/userAuth');
const {authenticateUser} = require('../middleware/Auth')
const {fetchAllEvents} = require('../controllers/events')

router.post('/register',userRegister);
router.post('/login',userLogin);
router.put('/edit',authenticateUser,editProfile);

router.get('/events',fetchAllEvents);

module.exports = router;    