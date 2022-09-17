import React, { useEffect, useState } from 'react';
import {Container, Card, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot,faSterlingSign} from '@fortawesome/free-solid-svg-icons'
import '../css/ViewMyOrders.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const userDetailsSelector = state => state.userDetails;
const ViewMyOrders = () => {

    const [orderHistory, setOrderHistory] = useState(null);
    const [activeOrderHistory, setActiveOrderHistory] = useState(null);
    const userDetails = useSelector(userDetailsSelector);
    let navigate=useNavigate();
    console.log('order history',orderHistory)
    
    useEffect(() => {

        const fetchData = async () => {
            const url = `${process.env.REACT_APP_ORDER_SERVICE}getOrdersByUserId/${userDetails.ID}`
              console.log(url);
              let res = await fetch(url, {
                  method: 'GET'
             });
            let response = await res.json();
            setOrderHistory(response);
        }
        const fetchActiveOrders = async () => {
            const url = `${process.env.REACT_APP_ORDER_SERVICE}getActiveOrdersByUserId/${userDetails.ID}`
              console.log(url);
              let res = await fetch(url, {
                  method: 'GET'
             });
            let response = await res.json();
            setActiveOrderHistory(response);
        }
        fetchActiveOrders();
        fetchData();
          

      }, []);

      useEffect(() => {

      }, [orderHistory,activeOrderHistory]);


    return(
        <div>
            <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between mb-3">
                <Container className="w-100 p-0">
                <Navbar.Brand>takeaway menu system</Navbar.Brand>
                    <Nav className="justify-content-end">
                    <Nav.Link onClick={()=>navigate("/homefeed")}>Home</Nav.Link>
                        <NavDropdown title={userDetails.FIRST_NAME} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">Logout</NavDropdown.Item>
                            {/* <NavDropdown.Item href="#action/3.2">
                            Another action
                            </NavDropdown.Item> */}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
        <Container className="mainContainer">
            <div>
                { activeOrderHistory && 
                    <div>
                        <h1 style={{fontFamily:'Open Sans'}}>Active Orders</h1>
                        {
                            activeOrderHistory.result && activeOrderHistory.result.map(x => {
                                return(
                                    <Card className='roomfac' style={{ marginTop: '15px' }}>
                                        <Card.Body>
                                        <div className="d-flex flex-row justify-content-between">
                                            <Card.Title>{x.shopName ? x.shopName : 'shop name'}</Card.Title>
                                            
                                        </div>
                                        <Card.Subtitle className="mb-2 text-muted d-flex flex-row justify-content-between">
                                        <div><FontAwesomeIcon icon={faLocationDot}/> Delivered at: {x.deliveryAddress}</div>
                                        <Card.Title><FontAwesomeIcon size="sm" icon={faSterlingSign}/>{x.cost}</Card.Title>
                                        </Card.Subtitle>
                                        <Card.Text>
                                            {x.orderItems.map(y => {return <div>
                                                {/* <div style={{marginTop: '10px'}}>Order#{y.orderItemId}</div> */}
                                                {/* <div>Menu Id:{y.menuItemId}</div> */}
                                                <div>{y.quantity} x {y.menuItemName}</div>
                                                {/* <div>Price per Unit: {y.pricePerUnit}</div> */}
                                            </div>})}
                                            <div>Delivered on: {x.createDateTime}</div>
                                        </Card.Text>
                                        </Card.Body>
                                    </Card>
                                )})
                        }
                    </div>
                }
            </div>
            <Container className="mt-3">
                { 
                    orderHistory && 
                    <div>
                        
                        <h1 style={{fontFamily:'Open Sans'}}>Past Orders</h1>
                        {
                            orderHistory.result && orderHistory.result.map(x => {return <Card className='roomfac' style={{ marginTop: '15px' }}>
                            <Card.Body>
                            <div className="d-flex flex-row justify-content-between">
                                <Card.Title>{x.shopName ? x.shopName : 'shop name'}</Card.Title>
                                
                            </div>
                            <Card.Subtitle className="mb-2 text-muted d-flex flex-row justify-content-between">
                            <div><FontAwesomeIcon icon={faLocationDot}/> Delivered at: {x.deliveryAddress}</div>
                            <Card.Title><FontAwesomeIcon size="sm" icon={faSterlingSign}/>{x.cost}</Card.Title>
                            </Card.Subtitle>
                            <Card.Text>
                                {x.orderItems.map(y => {return <div>
                                    {/* <div style={{marginTop: '10px'}}>Order#{y.orderItemId}</div> */}
                                    {/* <div>Menu Id:{y.menuItemId}</div> */}
                                    <div>{y.quantity} x {y.menuItemName}</div>
                                    {/* <div>Price per Unit: {y.pricePerUnit}</div> */}
                                </div>})}
                                <div>Delivered on: {x.createDateTime}</div>
                            </Card.Text>
                            </Card.Body>
                        </Card>})
                        }
                    </div>
                }
            </Container>
        </Container>
        </div>
    );
}

export default ViewMyOrders;