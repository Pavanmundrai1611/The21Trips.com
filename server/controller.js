// controller.js
const Booking = require('./schema');

const addBooking = async (req, res) => {
  try {
    const {
      selectedDate,
      buscollection,
      source,
      destination,
      userid,
      phoneNumber,
      selectedSeats,
      noOfSeatsBooked,
      customerNames,
    } = req.body;

    const newBooking = new Booking({
      date: selectedDate,
      busType: buscollection,
      from: source,
      to: destination,
      passengerId: userid,
      phone: phoneNumber,
      seatNumbers: selectedSeats,
      noOfSeatsBooked: noOfSeatsBooked,
      passengerNames: customerNames,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking added successfully' });
  } catch (error) {
    console.error('Error adding booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const { userid } = req.params; // Assuming you are passing userid as a URL parameter

    const bookings = await Booking.find({ passengerId: userid });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addBooking, getMyBookings, cancelBooking };