import '../css/Header.css';
import { useNavigate } from 'react-router-dom';
import {Container, Nav, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const restaurantSelector = state => state.restaurant;
const userDetailsSelector = state => state.userDetails;

const Header = () => {

    return (
    <>
      
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );

}

export default Header