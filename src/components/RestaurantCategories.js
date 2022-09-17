import React, { useState, useEffect } from 'react';
import {Container,Row, Col, Nav,Navbar,Card} from 'react-bootstrap';
import MenuItems from './MenuItems';
import '../css/RestaurantCategory.css';

function RestaurantCategories(props) {

    const keys = Object.keys(props.data);

    return (
        <Card className='main-restaurant-category'>
            <Navbar id='categoryNavBar' expand="lg" className='category-navbar'>
                <Container id='navBarContent'>
                    <Navbar.Brand className='navBarContent'>Categories</Navbar.Brand>
                        <div className="vr"></div>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {
                                keys.map((key) => 
                                    <Nav.Link href={`#${key}`} className='navBarContent'>
                                        {key}
                                    </Nav.Link>)
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Card className='restaurant-category'>
                {
                    keys.map(key => 
                        <Card.Body>
                            <Card.Title id={key}>
                                {key}
                            </Card.Title>
                            <Container>
                                <Row xs={1} md={2} lg={3}>
                                    {
                                        props.data[key].map(subItem => <Col><MenuItems name={subItem}/></Col>)
                                    }
                                </Row>
                            </Container>
                        </Card.Body>
                    )
                }  
            </Card>
        </Card>
      );

      
 
}

export default RestaurantCategories;