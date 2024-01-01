import axios from 'axios';

const url = 'https://the21trips-server.onrender.com';

export const addUserBookings = async (data) => {
  try {
    const requestData = {
      source: data.source,
      destination: data.destination,
      userid: data.userid,
      noOfSeatsBooked: data.noOfSeatsBooked,
      selectedSeats: data.selectedSeats.map(String),
      selectedDay: data.selectedDay,
      buscollection: data.buscollection,
      selectedDate: data.formattedDate,
      phoneNumber: data.phoneNumber,
      customerNames: data.customerNames,
    };
    console.log('Request Data:', requestData);
    console.log('User booking added successfully');
    return await axios.post(`${url}/adduserbookings`, requestData);
  } catch (error) {
    console.error('Error while calling addUserbookings API: ', error);
    console.error('Server Response:', error.response.data);
  }
};

export const getMyBookings = async (userid) => {
  try {
    console.log('Fetching user bookings for userid:', userid);
    return await axios.get(`${url}/getmybookings/${userid}`);
  } catch (error) {
    console.error('Error while calling getMyBookings API: ', error);
    console.error('Server Response:', error.response.data);
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    console.log('Canceling booking with ID:', bookingId);
    return await axios.delete(`${url}/cancelbooking/${bookingId}`);
  } catch (error) {
    console.error('Error while calling cancelBooking API: ', error);
    console.error('Server Response:', error.response.data);
  }
};