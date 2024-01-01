// route.js
const express = require('express');
const { addBooking, getMyBookings, cancelBooking } = require('./controller.js');

const router = express.Router();

router.post('/adduserbookings', addBooking);
router.get('/getmybookings/:userid', getMyBookings);
router.delete('/cancelbooking/:bookingId', cancelBooking);

module.exports = router;
