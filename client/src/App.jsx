import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingContext, { BookingProvider } from './context/BookingContext';
import SeaterBooking from './Components/SeaterBooking';
import SleeperBooking from './Components/SleeperBooking';
import Signup from './Authorization/Signup';
import Login from './Authorization/Login';
import TripBooking from './Components/TripBooking';
import DateBooking from './Components/DateBooking';
import Aboutus from './Components/Aboutus';
import Contactus from './Components/Contactus';
import Mybookings from './Components/Mybookings';
import NotFound from './Components/NotFound'; // Create a NotFound component for unmatched routes
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const auth = getAuth();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  const updateUserLoginStatus = (isLoggedIn) => {
    setUserLoggedIn(isLoggedIn);
  };

  return (
    <Router>
      <BookingProvider>
        <Routes>
          <Route
            path="/"
            element={
              userLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <Signup updateUserLoginStatus={updateUserLoginStatus} />
              )
            }
          />
          <Route path="/login" element={<Login updateUserLoginStatus={updateUserLoginStatus} />} />
          {userLoggedIn && (
            <>
              <Route path="/home" element={<TripBooking userLoggedIn={userLoggedIn} />} />
              <Route path="/datebooking/:busCode/:selectedPlan/:sd/:source/:destination" element={<DateBooking />} />
              <Route path="/seaterbooking" element={<SeaterBooking />} />
              <Route path="/sleeperbooking" element={<SleeperBooking />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/contactus" element={<Contactus />} />
              <Route path="/mybookings" element={<Mybookings />} />
            </>
          )}
          {/* Catch-all route for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BookingProvider>
    </Router>
  );
}

export default App;
