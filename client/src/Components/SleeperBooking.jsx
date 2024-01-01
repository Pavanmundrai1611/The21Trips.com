import React, { useEffect, useContext, useState } from 'react';
import { GiSteeringWheel } from "react-icons/gi";
import { addUserBookings } from '../service/api';
import QRCode from 'qrcode.react';
import Modal from 'react-modal';
import './SleeperBooking.css'; // Import the stylesheet
import BookingContext from '../context/BookingContext';
import { auth } from '../firebase';
import {
  getDoc,
  getDocs,
  getFirestore,
  doc,
  collection,
  updateDoc,
} from 'firebase/firestore';
import { format, isMonday, isThursday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
Modal.setAppElement('#root');

const SleeperBooking = () => {
  const { bookingData } = useContext(BookingContext);
  const defobj = {
    "1": "NA",
    "2": "NA",
    "3": "NA",
    "4": "NA",
    "5": "NA",
    "6": "NA",
    "7": "NA",
    "8": "NA",
    "9": "NA",
    "10": "NA",
    "11": "NA",
    "12": "NA",
    "13": "NA",
    "14": "NA",
    "15": "NA",
    "16": "NA",
    "17": "NA",
    "18": "NA",
    "19": "NA",
    "20": "NA",
    "21": "NA",
    "22": "NA",
    "23": "NA",
    "24": "NA",
    "25": "NA",
    "26": "NA",
    "27": "NA",
    "28": "NA",
    "29": "NA",
    "30": "NA"
  }
  const navigate = useNavigate();
  const existingBooking = bookingData.busData.bookings || defobj;
  const noOfSeatsToBeBooked = bookingData.seatsRequired;
  const noOfSeatsBooked = noOfSeatsToBeBooked;
  const source = bookingData.source;
  const destination = bookingData.destination;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerNames, setCustomerNames] = useState([]);

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleNameChange = (index, event) => {
    const names = [...customerNames];
    names[index] = event.target.value;
    setCustomerNames(names);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addCustomerNameInput = () => {
    if (customerNames.length < noOfSeatsToBeBooked) {
      setCustomerNames([...customerNames, '']);
    } else {
      window.alert(`You can only add ${noOfSeatsToBeBooked} customer names.`);
    }
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length < noOfSeatsToBeBooked) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        window.alert(`You can only select ${noOfSeatsToBeBooked} seats.`);
      }
    }
  };

  useEffect(() => {
    for (let key in existingBooking) {
      const seatNumber = parseInt(key, 10);
      const cell = document.querySelector(`.number-${seatNumber}`);
      if (cell) {
        if (existingBooking[key] !== "NA") {
          cell.style.backgroundColor = 'grey';
          cell.onclick = null; // Disable click event for booked seats
        } else {
          cell.style.backgroundColor = selectedSeats.includes(seatNumber) ? 'green' : '';
          cell.onclick = () => handleSeatClick(seatNumber);
        }
      }
    }
  }, [existingBooking, selectedSeats]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSubmit = async () => {
    if (selectedSeats.length === noOfSeatsToBeBooked) {
      const updatedBookings = { ...existingBooking };
      selectedSeats.forEach((seatNumber) => {
        updatedBookings[seatNumber] = user.uid;
      });
      if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
        window.alert('Please enter a valid phone number with at least 10 characters.');
        return;
      }
      if (customerNames.length !== noOfSeatsToBeBooked) {
        window.alert(`Please enter "${noOfSeatsToBeBooked}" customer names.`);
        return;
      }

      try {
        const { sd, selectedPlan, busCode, selectedDate } = bookingData;
        if (sd && selectedPlan && busCode && selectedDate) {
          const db = getFirestore();
          const sdDocRef = doc(db, 'SD', sd);
          const busesCollectionRef = collection(sdDocRef, 'BUSES');
          const selectedDay = isMonday(selectedDate) ? 'MONDAY' : 'THURSDAY';
          const dayDocRef = doc(busesCollectionRef, selectedDay);
          const collectionWeNeedToGet = `${selectedPlan}-BOOKINGS`;
          const buscollection = collectionWeNeedToGet;
          const bookingsCollectionRef = collection(dayDocRef, collectionWeNeedToGet);
          const documentId = format(selectedDate, 'yyyy-MM-dd');
          const userid = user.uid;
          const formattedDate = format(selectedDate, 'yyyy-MM-dd');
          await updateDoc(doc(bookingsCollectionRef, documentId), {
            bookings: updatedBookings,
          });
          console.log("source and destinaitons: ", source, destination);
          const userData = {
            source,
            destination,
            userid,
            noOfSeatsBooked,
            selectedSeats,
            selectedDay,
            buscollection,
            formattedDate,
            phoneNumber,
            customerNames,
          };

          await addUserBookings(userData);
          console.log('Bookings updated successfully:', updatedBookings);
          setBookingSuccess(true);
          setTimeout(() => {
            window.location.href = '/mybookings';
          }, 1000);
        } else {
          console.error('One or more necessary variables is undefined.');
        }
      } catch (error) {
        console.error('Error updating bookings:', error);
      }
    } else {
      window.alert(`Please select "${noOfSeatsToBeBooked}" seats before submitting.`);
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePaymentProceed = () => {
    setShowPopup(false);
    handleSubmit();
  };
  const handleBookClick = () => {
    setShowPopup(true);
  };
  const handleBackButtonClick = () => {
    navigate(-1); // Use navigate with a negative value to go back
  };

  return (
    <div className='sleeper-booking-container text-center'>
      <div className="back-button-container">
        <button onClick={handleBackButtonClick} className='btn btn-outline-dark'>Back</button>
      </div>
      <br /> <br />

      {bookingSuccess && (
        <div className="success-message">
          <h3 style={{ color: 'green' }}>
            Woohoo!! The booking is successfully done!!! Happy trippiee!!
          </h3>
          <h5>
            Redirecting you to my bookings page in a second...
          </h5>
        </div>
      )}
      <div className='' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <p className='font-sriracha mx-2 mt-1'>
          | Date: <span>{format(bookingData.selectedDate, 'yyyy-MM-dd')}</span> |
        </p>
        <p className='font-sriracha mx-2 mt-1'>
          From: <span>{bookingData.source}</span> |
        </p>
        <p className='font-sriracha mx-2 mt-1'>
          To: <span>{bookingData.destination}</span> |
        </p>
        <p className='font-sriracha mx-2 mt-1'>
          Plan: <span>{bookingData.selectedPlan}</span> |
        </p>
        <p className='font-sriracha mx-2 mt-1'>
          No of passengers: <span>{noOfSeatsBooked}</span> |
        </p>
      </div>
      <div>
        <label htmlFor="phoneNumber" className='font-sriracha mx-2 mt-4'>Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>

      <div>
        <label htmlFor="customerNames" className='font-sriracha mx-2 mt-4'>Customer Names:</label>
        {customerNames.map((name, index) => (
          <div key={index}>
            <input
              type="text"
              id={`customerName-${index}`}
              name={`customerName-${index}`}
              value={name}
              onChange={(event) => handleNameChange(index, event)}
              required
              className='m-2'
            />
          </div>
        ))}
        <button onClick={addCustomerNameInput} className='btn btn-outline-dark m-2'>Add Customer Names</button>
      </div>


      <div className="sleeper">
        <table id="lowerSleeper">
          <tr>
            <th colSpan="2">lower</th>
            <th></th>
            <th>
              <span className="material-symbols-outlined steering">
                <GiSteeringWheel />
              </span>
            </th>
          </tr>
          <tr>
            <td className="number number-1">1</td>
            <td></td>
            <td className="number number-2">2</td>
            <td className="number number-3">3</td>
          </tr>
          <tr>
            <td className="number number-4">4</td>
            <td></td>
            <td className="number number-5">5</td>
            <td className="number number-6">6</td>
          </tr>
          <tr>
            <td className="number number-7">7</td>
            <td></td>
            <td className="number number-8">8</td>
            <td className="number number-9">9</td>
          </tr>
          <tr>
            <td className="number number-10">10</td>
            <td></td>
            <td className="number number-11">11</td>
            <td className="number number-12">12</td>
          </tr>
          <tr>
            <td className="number number-13">13</td>
            <td></td>
            <td className="number number-14">14</td>
            <td className="number number-15">15</td>
          </tr>
        </table>

        <table id="upper">
          <tr>
            <th></th>
            <th></th>
            <th colSpan="2">
              upper
            </th>
          </tr>
          <tr>
            <td className="number number-16">16</td>
            <td></td>
            <td className="number number-17">17</td>
            <td className="number number-18">18</td>
          </tr>
          <tr>
            <td className="number number-19">19</td>
            <td></td>
            <td className="number number-20">20</td>
            <td className="number number-21">21</td>
          </tr>
          <tr>
            <td className="number number-22">22</td>
            <td></td>
            <td className="number number-23">23</td>
            <td className="number number-24">24</td>
          </tr>
          <tr>
            <td className="number number-25">25</td>
            <td></td>
            <td className="number number-26">26</td>
            <td className="number number-27">27</td>
          </tr>
          <tr>
            <td className="number number-28">28</td>
            <td></td>
            <td className="number number-29">29</td>
            <td className="number number-30">30</td>
          </tr>
        </table>

      </div>

      <button id="submitBtn" className='btn btn-outline-dark mb-4' onClick={handleBookClick}>
        Book!
      </button>

      {/* Pop-up for QR code and description */}
      <Modal
        isOpen={showPopup}
        onRequestClose={handlePopupClose}
        contentLabel="Payment Modal"
      >
        <div className='font-philosopher' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p className='mt-4'>Make half of the payment now using the QR code.</p>
          <p className='mt-4 text-center'>the remaining half payment must be paid at the begining of the trip</p>
          <QRCode value="payment_data_here" className='mt-4' />
          <button onClick={handlePaymentProceed} className='btn btn-outline-dark my-4'>Proceed</button>
        </div>
      </Modal>
    </div>
  );
};

export default SleeperBooking;