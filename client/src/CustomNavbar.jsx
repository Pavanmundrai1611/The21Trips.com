// CustomNavbar.js

import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Import your Firebase configuration

const CustomNavbar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="px-4">
      <Navbar.Brand as={Link} to="/home">
        <span className="font-maps">The21Trip.com</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/aboutus">
            About Us
          </Nav.Link>
          <Nav.Link as={Link} to="/mybookings">
            My Bookings
          </Nav.Link>
          <Nav.Link as={Link} to="/contactus">
            Contact Us
          </Nav.Link>
          <NavDropdown title="Account" id="collasible-nav-dropdown">
            <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
