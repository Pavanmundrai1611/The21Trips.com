import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BookingContext from '../context/BookingContext';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore/lite';
import { format, isMonday, isThursday } from 'date-fns';

const DateBooking = () => {
  const navigate = useNavigate();
  const { busCode, selectedPlan, sd, source, destination } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [busData, setBusData] = useState(null);
  const { setBookingData } = useContext(BookingContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate) {
      fetchBusData();
    }
  };

  const handlePassengerChange = (e) => {
    setPassengerCount(parseInt(e.target.value, 10));
  };
  const [fieldDataWeNeedState, setFieldDataWeNeedState] = useState(null);

  const fetchBusData = async () => {
    try {
      const db = getFirestore();
      const sdDocRef = doc(db, 'SD', sd);
      const sdDoc = await getDoc(sdDocRef);

      if (sdDoc.exists()) {
        const busesCollectionRef = collection(sdDocRef, 'BUSES');
        const selectedDay = isMonday(selectedDate) ? 'MONDAY' : 'THURSDAY';
        const dayDocRef = doc(busesCollectionRef, selectedDay);
        const dayDoc = await getDoc(dayDocRef);

        if (dayDoc.exists()) {
          const selectedPlanField = `${selectedPlan}-${busCode}${isMonday(selectedDate)
            ? selectedPlan === 'A'
              ? '1'
              : selectedPlan === 'B'
                ? '2'
                : '3'
            : selectedPlan === 'A'
              ? '4'
              : selectedPlan === 'B'
                ? '5'
                : '6'
            }`;
          const fieldData = dayDoc.data();
          const fieldDataWeNeed = fieldData[selectedPlanField];
          console.log(fieldDataWeNeed);
          setFieldDataWeNeedState(fieldDataWeNeed);

          console.log(fieldDataWeNeed);
          const collectionWeNeedToGet = `${selectedPlan}-BOOKINGS`;
          const bookingsCollectionRef = collection(
            dayDocRef,
            collectionWeNeedToGet
          );
          await checkAndHandleExistingDocument(bookingsCollectionRef);
        } else {
          console.log(`No documents for ${selectedDay} in BUSES collection!`);
        }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching bus data:', error);
    }
  };

  const checkAndHandleExistingDocument = async (bookingsCollectionRef) => {
    const bookingsSnapshot = await getDocs(bookingsCollectionRef);

    if (!bookingsSnapshot.empty) {
      let foundData = null;

      bookingsSnapshot.forEach((doc) => {
        const documentId = doc.id;
        const documentData = doc.data();

        if (documentId === format(selectedDate, 'yyyy-MM-dd')) {
          foundData = documentData;
        }
      });

      if (foundData) {
        console.log('Found Data:', foundData);
        setBusData(foundData);
      } else {
        console.log('No data found for the selected date. Adding a new document...');
        await addNewDocument(bookingsCollectionRef);
      }
    } else {
      console.log(`No documents for this collection on the selected day!`);
    }
  };

  const addNewDocument = async (bookingsCollectionRef) => {
    const newDocumentId = format(selectedDate, 'yyyy-MM-dd');
    const newDocumentData = generateTemplate();

    // Use the collection method to create the correct reference
    const newDocumentRef = doc(bookingsCollectionRef, newDocumentId);

    await setDoc(newDocumentRef, newDocumentData);

    console.log('New document added:', newDocumentData);
    setBusData(newDocumentData);
  };

  const generateTemplate = () => {
    const template = {};

    // Common template for A and B plans
    if (selectedPlan === 'A' || selectedPlan === 'B') {
      for (let i = 1; i <= 32; i++) {
        template[i] = 'NA';
      }
    }

    // Template for C plan
    else if (selectedPlan === 'C') {
      for (let i = 1; i <= 30; i++) {
        template[i] = 'NA';
      }
    }

    return { bookings: template };
  };


  const filterDates = (date) => {
    const currentDate = new Date();
    const nextThreeMonths = new Date(currentDate);
    nextThreeMonths.setMonth(currentDate.getMonth() + 3);
    return (
      date >= currentDate &&
      date <= nextThreeMonths &&
      (isMonday(date) || isThursday(date))
    );
  };

  const calculateSeatAvailability = (bookings) => {
    let totalSeats, availableSeats, canBookSeats;

    totalSeats = Object.keys(bookings).length;
    availableSeats = Object.values(bookings).filter((seat) => seat === 'NA').length;
    const seatsRequired = passengerCount;
    canBookSeats = availableSeats >= seatsRequired;

    return {
      totalSeats,
      availableSeats,
      canBookSeats,
    };
  };

  const handleBookSeatsClick = () => {
    const seatsRequired = passengerCount;
    const plan = selectedPlan;
    const { totalSeats, availableSeats } = calculateSeatAvailability(busData.bookings);
    const selectedDay = isMonday(selectedDate) ? 'Monday' : 'Thursday';

    if (plan === 'A' || plan === 'B') {
      setBookingData({ busData, seatsRequired, selectedDate, selectedDay, availableSeats, totalSeats, sd, selectedPlan, busCode, source, destination });
      navigate('/seaterbooking');
    } else if (plan === 'C') {
      setBookingData({ busData, seatsRequired, selectedDate, selectedDay, availableSeats, totalSeats, sd, selectedPlan, busCode, source, destination });
      navigate('/sleeperbooking');
    }
  };
  const handleBackButtonClick = () => {
    navigate(-1); // Use navigate with a negative value to go back
  };

  return (
    <div className='booking-container'>
      <div className="back-button-container">
        <button onClick={handleBackButtonClick} className='btn btn-outline-dark'>Back</button>
      </div>

      <h1 className='font-bungee'>Booking:</h1>
      <h5 className=''>Pick the date you want to travel and the number of passengers</h5>
      <p className='fw-bold text-danger'>Passenger count ranges from 1 to 5!</p>
      <p>Bus Code for the trip: <span className='fw-bold'>{busCode}</span></p>
      <p>
        Selected Plan: <span className='fw-bold'>
          {selectedPlan === 'A' ? 'Basic' : selectedPlan === 'B' ? 'Medium' : selectedPlan === 'C' ? 'Premium' : 'Unknown Plan'}
        </span>
      </p>
      <form onSubmit={handleSubmit}>
        <div className='passenger-select'>
          <label>Select Number of Passengers: </label>
          <select
            className='mx-2'
            value={passengerCount}
            onChange={handlePassengerChange}
            required
          >
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-4 date-picker'>
          <label>Available dates: </label>
          <DatePicker
            className='mx-2'
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            filterDate={filterDates}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
            required
          />
        </div>
        <button type="submit" className='btn btn-outline-dark mt-4'>Get Bus Details</button>
      </form>
      {busData && selectedDate && (
        <div className='mt-4 bus-details'>
          <h5 className='font-philosopher fw-bold'>Data for {format(selectedDate, 'dd/MM/yyyy')} , {isMonday(selectedDate) ? 'Monday' : 'Thursday'}</h5>
          {fieldDataWeNeedState && (
            <div className='mt-4 field-data mx-4' style={{ textAlign: 'left' }}>
              <h5 className='font-philosopher fw-bold'>Bus details:</h5>
              <p>Bus Number: <span className='fw-bold'>{fieldDataWeNeedState.busnumber}</span></p>
              <p>Bus Driver 1: <span className='fw-bold'>{fieldDataWeNeedState.busdriver.driver1.name}</span></p>
              <p>Bus Driver 1 phone number: <span className='fw-bold'>{fieldDataWeNeedState.busdriver.driver1.phonenumber}</span></p>
              <p>Bus Driver 2: <span className='fw-bold'>{fieldDataWeNeedState.busdriver.driver2.name}</span></p>
              <p>Bus Driver 2 phone number: <span className='fw-bold'>{fieldDataWeNeedState.busdriver.driver2.phonenumber}</span></p>
            </div>
          )}

          <p>Total Seats: <span className='fw-bold'>{calculateSeatAvailability(busData.bookings).totalSeats}</span></p>
          <p>Available Seats: <span className='fw-bold'>{calculateSeatAvailability(busData.bookings).availableSeats}</span></p>
          {calculateSeatAvailability(busData.bookings).canBookSeats ? (
            <>
              <p className='fw-bold text-success'>Yayy!! The seats are available..!</p>
              <button onClick={handleBookSeatsClick} className='btn btn-outline-dark'>Let's gooo!!</button>
            </>
          ) : (
            <p className='fw-bold text-danger'>Oops!!! Sorry, no seats are available for the selected date. Please choose another date.</p>
          )}
        </div>
      )}
    </div>
  );

};

export default DateBooking;
