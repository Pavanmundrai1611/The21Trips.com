// BookingContext.js
import { createContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState(() => {
    const storedData = localStorage.getItem('bookingData');
    return storedData ? JSON.parse(storedData) : null;
  });

  useEffect(() => {
    // Save the data to localStorage whenever it changes
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
  }, [bookingData]);

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
