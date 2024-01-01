
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import emailjs from 'emailjs-com';
import './Contactus.css';

const Contactus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_bh9jh0r', 'template_skas8x2', e.target, '8vFbm2XFfKvuKnjq4')
      .then(
        (result) => {
          console.log(result.text);
          setSuccessMessage('Message sent successfully!');
          setErrorMessage(null);
        },
        (error) => {
          console.log(error.text);
          setErrorMessage('Failed to send message. Please try again.');
          setSuccessMessage(null);
        }
      );
  };

  return (
    <div className="contactus-container">
      <div className="back-button-container">
        <button onClick={handleBackButtonClick} className="btn btn-outline-dark">
          Back
        </button>
      </div>

      <div className="contact-section">
        <h2 className="contact-header font-montserrat text-primary" style={{ fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Contact Us</h2>
        <div className="contact-info">
          <div className="contact-item">
            <FiMail className="icon" />
            <p>pavanmundrai@gmail.com</p>
          </div>
          <div className="contact-item">
            <FiPhone className="icon" />
            <p>9999999999, 8888888888</p>
          </div>
          <div className="contact-item">
            <FiMapPin className="icon" />
            <p>The21trips.com, Hyderabad</p>
            <div className="map-container">
              {/* Google Map Embed for Hyderabad */}
              <iframe
                title="Hyderabad Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d974600.5789466588!2d77.2258288872241!3d17.410179346273015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1704110668886!5m2!1sen!2sin"
                width="100%"
                height="150"
                style={{ border: 1, borderRadius: 8 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="contact-item">
            <FiMapPin className="icon" />
            <p>The21trips.com, Mumbai</p>
            <div className="map-container">
              <iframe
                title="Mumbai Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482634.9241989019!2d72.29073309634767!3d19.081960362015806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1704110695560!5m2!1sen!2sin"
                width="100%"
                height="150"
                style={{ border: 1, borderRadius: 8 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="contact-item">
            <FiMapPin className="icon" />
            <p>The21trips.com, Delhi</p>
            <div className="map-container">
              <iframe
                title="Delhi Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448193.9582180142!2d76.76285214719164!3d28.644285671286188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1704110612078!5m2!1sen!2sin"
                width="100%"
                height="150"
                style={{ border: 1, borderRadius: 8 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          {/* Similar sections for Mumbai and Delhi */}
          {/* ... (unchanged) */}
        </div>
      </div>

      <div className="contact-form">
        <h2 className="form-header font-montserrat text-info" style={{ letterSpacing: '1px', textTransform: 'uppercase' }}>Send us a message</h2>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={sendEmail}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea name="message" value={formData.message} onChange={handleInputChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            <FiSend /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contactus;
