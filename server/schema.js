// schema.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  busType: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  passengerId: { type: String, required: true },
  phone: { type: String, required: true },
  seatNumbers: { type: [String], required: true },
  noOfSeatsBooked: { type: Number, required: true },
  passengerNames: { type: [String], required: true },
}, { collection: 'BOOKINGS' }); // Specify the collection name as 'BOOKINGS'

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
