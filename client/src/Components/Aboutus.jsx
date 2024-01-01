// AboutPage.js

import {React,useEffect} from 'react';
import './AboutPage.css';
import coverPic from '../assets/photos/coverpic.png';
import mehandi from '../assets/photos/mehandi.mp4';
import indianCultureVideo from '../assets/photos/indian-culture.mp4';
import indianFlagWavingVideo from '../assets/photos/indian-flag-waving.mp4';
import kingfisherBirdFarmsVideo from '../assets/photos/indian-kingfisherbird-farms.mp4';
import celebrations from '../assets/photos/celebrations.jpg';
import festival from '../assets/photos/festival.jpg';
import market from '../assets/photos/market.jpg';
import kids from '../assets/photos/kids.jpg';
import shiva from '../assets/photos/shiva.jpg';
import streetsOfIndia from '../assets/photos/streets-of-india.jpeg';
import temple from '../assets/photos/temple.jpg';
import { useNavigate } from 'react-router-dom';
const Aboutus = () => {
  const navigate = useNavigate();
  const handleBackButtonClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-container text-center">
      <div className="back-button-container">
        <button onClick={handleBackButtonClick} className='btn btn-outline-dark'>Back</button>
      </div>

      <h1 className='font-montserrat'>About Us</h1>
      <div className=''>
        <img src={coverPic} className='cover-pic' alt="" />
        <p>
          Welcome to our tourist organization! We offer exciting trips to 21 tourist places from all the 29 states of India every Monday and Thursday. Choose from our three amazing plans to make the most out of your travel experience.
        </p>
        <h2 className='font-montserrat text-info'>Our Mission</h2>
        <p>
          Our mission is to provide unforgettable travel experiences, showcasing the rich cultural diversity and natural beauty of India. We strive to make every trip a memorable adventure for our valued customers.
        </p>
      </div>
      <hr />
      <div className="video-container first">
        <div className="video-description">
          <span>"Embark on a journey to India, a land of ancient traditions and modern wonders. From the majestic Himalayas to vibrant festivals, experience the kaleidoscope of cultures and breathtaking landscapes that define this diverse and enchanting nation."</span>
        </div>
        <div className='videodiv'>
          <video className="video" autoPlay muted>
            <source src={indianFlagWavingVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <hr />
      <div className="video-container second">
        <div className="video-description">
          <span>"Explore the vibrant tapestry of India's cultural mosaic with our travel experiences. Immerse yourself in the rich traditions, diverse heritage, and warm hospitality that define the soul-stirring essence of Indian culture."</span>
        </div>
        <div className='videodiv'>
          <video className="video" autoPlay muted>
            <source src={indianCultureVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <hr />
      <div className="video-container third">
        <div className="video-description">
          <span>"Discover the serenity of Indian farms, where lush landscapes showcase the country's agricultural bounty. In the vibrant avian world, encounter a symphony of colors and melodies with a diverse array of birds, from the majestic Indian Kingfisher to the captivating residents of bird farms, offering a delightful glimpse into India's natural wonders."</span>
        </div>
        <div className='videodiv'>
          <video className="video" autoPlay muted>
            <source src={kingfisherBirdFarmsVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <hr />
      <div className="video-container fourth">
        <div className="video-description">
          <span>"Experience the vibrancy of Indian celebrations, adorned with intricate Mehandi art. Dive into the lively atmosphere of cultural functions, where traditions come alive with music and joy."</span>
        </div>
        <div className='videodiv'>
          <video className="video" autoPlay muted>
            <source src={mehandi} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className='my-2'>
        <span>Have a look at some of the beautiful snaps of India..</span>
      </div>

      <div className="image-gallery mt-4">
        <div className="gallery-item">
          <img src={temple} alt="temple" />
          <div className="caption">Indian temple</div>
        </div>
        <div className="gallery-item">
          <img src={festival} alt="festival" />
          <div className="caption">festivals</div>
        </div>
        <div className="gallery-item">
          <img src={streetsOfIndia} alt="streets of india" />
          <div className="caption">Indian streets</div>
        </div>
        <div className="gallery-item">
          <img src={market} alt="market" />
          <div className="caption">Indian Market</div>
        </div>
        <div className="gallery-item">
          <img src={celebrations} alt="festival celebrations" />
          <div className="caption">Celebrations</div>
        </div>
        <div className="gallery-item">
          <img src={shiva} alt="Shiva" />
          <div className="caption">Lord Shiva</div>
        </div>
        <div className="gallery-item">
          <img src={kids} alt="Village kids" />
          <div className="caption">Village kids</div>
        </div>
      </div>

    </div>
  );
};

export default Aboutus;
