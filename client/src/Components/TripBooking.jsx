import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc, collection, getFirestore, getDocs } from 'firebase/firestore';
import Spinner from 'react-bootstrap/Spinner';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../CustomNavbar';
const TripBooking = () => {
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [busCode, setBusCode] = useState('');
  const [tripData, setTripData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [SD, setSD] = useState('');
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [destinationData, setDestinationData] = useState(null);

  const [busDesc, setBusDesc] = useState('');
  const [hotelDesc, setHotelDesc] = useState('');
  const [busImgSrc, setBusImgSrc] = useState('');
  const [roomImgSrc, setRoomImgSrc] = useState('');
  const [selectedData, setSelectedData] = useState(null);


  const planOptions = ['basic', 'medium', 'premium'];

  const navigate = useNavigate();

  const destinationArray = destinationData
    ? Object.entries(destinationData).map(([name, details]) => ({ name, ...details }))
    : [];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchSourcesAndDestinations = async () => {
      try {
        const db = getFirestore();

        const sourcesSnapshot = await getDocs(collection(db, 'SOURCES'));
        const sources = sourcesSnapshot.docs.map((doc) => doc.id);
        setSourceOptions(sources);

        const destinationsSnapshot = await getDocs(collection(db, 'DESTINATIONS'));
        const destinations = destinationsSnapshot.docs.map((doc) => doc.id);
        setDestinationOptions(destinations);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching sources and destinations from Firebase:', error);
        setLoading(false);
      }
    };

    fetchSourcesAndDestinations();
  }, []);

  useEffect(() => {
    if (!loading && selectedSource && selectedDestination) {
      const updatedSD = `${selectedDestination}-${selectedSource}`;
      setSD(updatedSD);
    }
  }, [loading, selectedSource, selectedDestination]);

  useEffect(() => {
    if (!loading && selectedSource && selectedDestination) {
      const updatedSD = `${selectedDestination}-${selectedSource}`;
      setSD(updatedSD);

      const fetchData = async () => {
        try {
          const db = getFirestore();
          const sdCollection = collection(db, 'SD');
          const docRef = doc(sdCollection, updatedSD);

          setLoadingSpinner(true);

          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("data :", data);
            setBusCode(data.busCode);
            setTripData(data);
            // Set the fetched data to the state
            setSelectedData(data);
          } else {
            setBusCode('');
            setTripData(null);
            // Reset the selected data
            setSelectedData(null);
          }

          setTimeout(() => {
            setLoadingSpinner(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching data from Firebase:', error);
          setLoadingSpinner(false);
        }
      };

      fetchData();
    }
  }, [loading, selectedSource, selectedDestination]);

  useEffect(() => {
    if (!loading && selectedDestination) {
      const fetchDestinationData = async () => {
        try {
          const db = getFirestore();
          const destinationCollection = collection(db, 'DESTINATIONS');
          const docRef = doc(destinationCollection, selectedDestination);
          const docSnap = await getDoc(docRef);

          setLoadingSpinner(true);

          setTimeout(() => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setDestinationData(data);
              console.log('Destination Data:', data);
            } else {
              setDestinationData(null);
              console.error('Destination not found in the database.');
            }

            setLoadingSpinner(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching destination data from Firebase:', error);
          setLoadingSpinner(false);
        }
      };

      fetchDestinationData();
    }
  }, [loading, selectedDestination]);

  useEffect(() => {
    const description = getPlanDescription();
    setBusDesc(description.busDesc);
    setHotelDesc(description.hotelDesc);

    setLoadingSpinner(true);

    setTimeout(() => {
      setLoadingSpinner(false);
    }, 1000);
  }, [selectedPlan]);

  useEffect(() => {
    const images = getPlanImages();
    setBusImgSrc(images.busImgSrc);
    setRoomImgSrc(images.roomImgSrc);

    setLoadingSpinner(true);

    setTimeout(() => {
      setLoadingSpinner(false);
    }, 1000);
  }, [selectedPlan]);

  const getPlanDescription = () => {
    switch (selectedPlan) {
      case 'basic':
        return {
          busDesc: 'Affordable and spacious transportation solution for groups of up to 32 passengers, offering a comfortable journey without air conditioning.',
          hotelDesc: 'A comfortable and budget-friendly accommodation option, our standard rooms provide essential amenities for a relaxing stay, catering to the needs of both business and leisure travelers.',
        };
      case 'medium':
        return {
          busDesc: 'Enjoy a luxurious and climate-controlled travel experience with our 32-seater AC bus, designed for comfort and style for groups of various purposes.',
          hotelDesc: 'Elevate your stay with our premium rooms, featuring enhanced comfort and added amenities. Immerse yourself in a more refined experience, perfect for travelers seeking an extra level of luxury.',
        };
      case 'premium':
        return {
          busDesc: 'Experience the ultimate in overnight travel comfort with our 30-seater AC sleeper bus, providing cozy sleeping arrangements along with air-conditioned amenities for a relaxing journey.',
          hotelDesc: 'Indulge in the epitome of luxury with our suite rooms. Spacious and exquisitely designed, these rooms offer a sophisticated ambiance, additional living space, and premium amenities, ensuring an unforgettable and pampering stay.',
        };
      default:
        return {};
    }
  };

  const getPlanImages = () => {
    switch (selectedPlan) {
      case 'basic':
        return {
          busImgSrc:
            'https://firebasestorage.googleapis.com/v0/b/trip-bc8fd.appspot.com/o/plansandrooms%2Fnon%20ac.png?alt=media&token=7733eb88-3fb5-4dd4-82cc-14e62b7d9833',
          roomImgSrc:
            'https://firebasestorage.googleapis.com/v0/b/trip-bc8fd.appspot.com/o/plansandrooms%2Fbasic-room.jpg?alt=media&token=c87a7482-6f3c-46d7-b181-d9e0b1359b1a',
        };
      case 'medium':
        return {
          busImgSrc:
            'https://firebasestorage.googleapis.com/v0/b/trip-bc8fd.appspot.com/o/plansandrooms%2Fac-seater.jpg?alt=media&token=f1e29fd9-6f57-4947-ad8f-6f69e1aae506',
          roomImgSrc:
            'https://firebasestorage.googleapis.com/v0/b/trip-bc8fd.appspot.com/o/plansandrooms%2Fpremium-room.jpg?alt=media&token=2e4af0cd-e896-417d-85dc-e7fab3d0f8d1',
        };
      case 'premium':
        return {
          busImgSrc:
            'https://firebasestorage.googleapis.com/v0/b/trip-bc8fd.appspot.com/o/plansandrooms%2Fac-sleeper.jpg?alt=media&token=5d57dc20-d65f-4120-a994-f410d8b1f1ef',
          roomImgSrc:
            'https://firebasestorage.googleapis.com/v0/b/trip-bc8fd.appspot.com/o/plansandrooms%2Fsuite-room.jpg?alt=media&token=a838654f-a0fd-4d16-95c2-d4393ef803ba',
        };
      default:
        return {};
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedSource && selectedDestination && selectedPlan) {
      const updatedSD = `${selectedDestination}-${selectedSource}`;
      setSD(updatedSD);

      const planLetter = selectedPlan === 'basic' ? 'A' : selectedPlan === 'medium' ? 'B' : 'C';

      navigate(`/datebooking/${busCode}/${planLetter}/${SD}/${selectedSource}/${selectedDestination}`);
    } else {
      console.error('Please fill in all required fields.');
    }
  };

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setSelectedDestination(event.target.value);
  };

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <CustomNavbar />
      <div className='m-4'>
        <h1 className='font-carattere'><span className='font-maps'>The21Trip.com</span><p style={{ fontSize: "22px", marginLeft: "5rem" }}>- luxury Journeys to 21 Destinations in India..!</p></h1>
        <p className=''>Experience the epitome of luxury travel with The21Trip.com.! <br /> From pick-up to premier hotels, expert guides, and top-notch safety measures, we ensure every Monday and Thursday is an adventure.</p>
        <br /><h3><span className='font-smooch'> Explore India in style, comfort, and safety - crafting extraordinary memories with us.</span></h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", gap: '1rem' }}>
          <div className="mb-3">
            <label htmlFor="destination" className="form-label">
              To:
            </label>
            <select
              id="destination"
              className="form-select"
              value={selectedDestination}
              onChange={handleDestinationChange}
              style={{ width: '100%' }}
              required
            >
              <option value="" disabled>
                Select To
              </option>
              {destinationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="source" className="form-label">
              From:
            </label>
            <select
              id="source"
              className="form-select"
              value={selectedSource}
              onChange={handleSourceChange}
              style={{ width: '100%' }}
              required
            >
              <option value="" disabled>
                Select From
              </option>
              {sourceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="plan" className="form-label">
              Plan:
            </label>
            <select
              id="plan"
              className="form-select"
              value={selectedPlan}
              style={{ width: '100%' }}
              onChange={handlePlanChange}
              required
            >
              <option value="" disabled>
                Select Plan
              </option>
              {planOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loadingSpinner && (
          <Spinner animation="border" role="status" className='mt-4'>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}

        {destinationArray.length > 0 && (
          <div className="mt-4" style={{ maxWidth: '100%', margin: '0 auto' }}>
            <h4>Explore Destinations</h4>
            <Carousel
              activeIndex={activeIndex}
              onSelect={(index) => setActiveIndex(index)}
              style={{ maxWidth: '100%' }}
              slide={false}
              interval={null}
            >
              {destinationArray.map((destination, index) => (
                <Carousel.Item key={index} className='slider'>
                  <img
                    className="d-block w-100 img-container"
                    src={destination.imgsrc}
                    alt={`Destination ${index + 1}`}
                  />
                  <Carousel.Caption style={{ color: 'black' }} className='font-smooch2 caption'>
                    <h3 style={{ textShadow: '2px 2px 4px rgba(255, 255, 255, 0.7)' }}>{destination.name}</h3>
                    <p
                      style={{
                        textShadow: '2px 2px 4px rgba(255, 255, 255, 0.7)',
                        fontWeight: '600',
                        fontFamily: 'Carattere sans-serif'
                      }}
                    >
                      {destination.description}
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}

        <br />

        {selectedData && (
          <div className="mt-4 text-left" style={{ maxWidth: '100%', margin: '0 auto', textAlign: 'left' }}>
            <h4 className="mb-4 font-sriracha" style={{ color: 'black' }}>Trip Details</h4>

            {selectedData.busCode && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  <span style={{ color: 'black' }}>Bus Code:</span> <span style={{ color: 'blue' }}>{selectedData.busCode}</span>
                </p>
              </div>
            )}

            {selectedData.boardingpoint && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  <span style={{ color: 'black' }}>Bus boarding point:</span> <span style={{ color: 'blue' }}>{selectedData.boardingpoint}</span>
                </p>
              </div>
            )}

            {selectedData.duration && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  <span style={{ color: 'black' }}>The duration of the whole trip:</span> <span style={{ color: 'blue' }}>{selectedData.duration}</span>
                </p>
              </div>
            )}

            {selectedData.travellingduration && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  <span style={{ color: 'black' }}>Travelling duration:</span> <span style={{ color: 'blue' }}>{selectedData.travellingduration}</span>
                </p>
              </div>
            )}

            {selectedData.distance && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  <span style={{ color: 'black' }}>Distance from source to destination:</span> <span style={{ color: 'blue' }}>{selectedData.distance}</span>
                </p>
              </div>
            )}

            {selectedData.hotel && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  <span style={{ color: 'black' }}>Hotel we stay at the destination:</span> <span style={{ color: 'blue' }}>{selectedData.hotel}</span>
                </p>
              </div>
            )}

            {selectedData['hotel-link'] && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  Have a look at the luxury hotel! Hotel-link:
                  <a className="font-sriracha" href={selectedData['hotel-link']} target="_blank" rel="noopener noreferrer">
                    <span style={{ color: 'black' }}>HOTEL-LINK</span>
                  </a>
                </p>
              </div>
            )}

            {selectedData.plans && Object.keys(selectedData.plans).length > 0 && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha"><span style={{ color: 'black' }}>Plans-pricing:</span></p>
                <ul className="list-unstyled">
                  {Object.entries(selectedData.plans)
                    .sort(([planA], [planB]) => planA.localeCompare(planB))
                    .map(([key, value]) => (
                      <li key={key} className="font-sriracha">
                        <span style={{ color: 'black' }}>{key}:</span> <span style={{ color: 'blue' }}>{value}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {selectedData.travellingstops && Object.keys(selectedData.travellingstops).length > 0 && (
              <div className="mb-3">
                <p className="mb-0 font-sriracha">
                  <span style={{ color: 'black' }}>As we travel for a long time, we have stops in between. Travelling Stops:</span>
                </p>
                <ul className="list-unstyled">
                  {Object.entries(selectedData.travellingstops)
                    .sort(([stopA], [stopB]) => stopA.localeCompare(stopB))
                    .map(([key, value]) => (
                      <li key={key} className="font-sriracha">
                        <span style={{ color: 'black' }}>{key}:</span> <span style={{ color: 'blue' }}>{value}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <br />

        {selectedPlan && (
          <div className="row align-items-center">
            <div className="col-md-6 mt-4" style={{ maxWidth: '100%' }}>
              <h4 className='font-sriracha'>Travel:</h4>
              <p className='font-philosopher'>{busDesc}</p>
            </div>
            <div className="col-md-6 text-center" style={{ maxWidth: '100%' }}>
              {busImgSrc ? (
                <img
                  src={busImgSrc}
                  alt={`Bus for ${selectedPlan} plan`}
                  className="img-fluid"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </div>
          </div>
        )}

        {selectedPlan && (
          <div className="row mt-4 align-items-center">
            <div className="col-md-6 text-center" style={{ maxWidth: '100%' }}>
              {roomImgSrc ? (
                <img
                  src={roomImgSrc}
                  alt={`Room for ${selectedPlan} plan`}
                  className="img-fluid"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </div>
            <div className="col-md-6" style={{ maxWidth: '100%' }}>
              <h4 className='font-sriracha'>Stay:</h4>
              <p className='font-philosopher'>{hotelDesc}</p>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-outline-dark mt-3">
          Lets travel..!
        </button>
      </form>
    </div>
  );
};

export default TripBooking;
