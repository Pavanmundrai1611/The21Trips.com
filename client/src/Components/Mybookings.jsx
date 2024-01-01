// Import necessary Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getMyBookings, cancelBooking } from '../service/api';
import { Trash } from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';

const MyBookings = () => {
  const auth = getAuth();
  const [userId, setUserId] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);

        getMyBookings(user.uid)
          .then((response) => {
            setUserBookings(response.data.bookings);
          })
          .catch((error) => {
            console.error('Error fetching user bookings:', error);
          });
      } else {
        setUserId(null);
        setUserBookings([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShowModal = (bookingId) => {
    setBookingIdToDelete(bookingId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(bookingIdToDelete);
      const response = await getMyBookings(userId);
      setUserBookings(response.data.bookings);
      setShowModal(false);
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  return (
    <div className="container mt-1 ">
      <CustomNavbar />

      {userId ? (
        <div className='mt-4'>
          {userBookings.length > 0 ? (
            <div>
              <h3 className="text-center mb-4 font-sriracha">My Bookings</h3>

              <div className="d-md-none">
                {userBookings.map((booking) => (
                  <div key={booking._id} className="mb-3">
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>Date:</strong> {booking.date}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>From:</strong> {booking.from}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>To:</strong> {booking.to}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>Bus Type:</strong> {booking.busType}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>Phone:</strong> {booking.phone}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>Seat Numbers:</strong> {booking.seatNumbers.join(', ')}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>No of Seats Booked:</strong> {booking.noOfSeatsBooked}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <strong style={{ textAlign: 'left' }}>Passenger Names:</strong> {booking.passengerNames.join(', ')}
                    </div>
                    <div className="m-2" style={{ textAlign: 'left' }}>
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => handleShowModal(booking._id)}
                      >
                        <Trash /> Cancel
                      </button>
                    </div>
                  </div>

                ))}
              </div>

              {/* Table display for larger screens */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-bordered table-striped text-center">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Bus Type</th>
                      <th>Phone</th>
                      <th>Seat Numbers</th>
                      <th>No of Seats Booked</th>
                      <th>Passenger Names</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.date}</td>
                        <td>{booking.from}</td>
                        <td>{booking.to}</td>
                        <td>{booking.busType}</td>
                        <td>{booking.phone}</td>
                        <td>{booking.seatNumbers.join(', ')}</td>
                        <td>{booking.noOfSeatsBooked}</td>
                        <td>{booking.passengerNames.join(', ')}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleShowModal(booking._id)}
                          >
                            <Trash /> Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>No bookings found for the user.</p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-center">No user signed in. Please sign in to view your bookings.</p>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel your booking?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="danger" onClick={handleCancelBooking}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyBookings;
