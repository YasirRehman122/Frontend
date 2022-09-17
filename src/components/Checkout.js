import '../css/Checkout.css';
import React, { useState, useEffect} from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import MsgModal from './MsgModal';
import { useSelector } from "react-redux";
import { Container, Nav, Navbar, Button, Card, NavDropdown} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const userDetailsSelector = state => state.userDetails;
const addressSelector = state => state.deliveryAddress;

const DELIEVRY_FEE=2;

function Checkout(props) {

    const [data,setData] = useState(null);
    const [DeliveryFee] = useState(DELIEVRY_FEE);
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState('yes');
    const [paymentMode, setPaymentMode] = useState('cash');
    const [isError, setIsError] = useState(true);
    const userDetails = useSelector(userDetailsSelector);
    const deliveryAddress = useSelector(addressSelector);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isScheduled, setIsScheduled] = useState(false);
    const [time,setTime] = useState(null);
    let navigate = useNavigate();
    console.log('data',data);

    const handleChange = (e) => {
        const { value } = e.target;
        value === 'Cash' ? setPaymentMode('cash') : setPaymentMode('wallet');
    };
    
    let subTotal = 0;
    if(data){
        for (let item of data.cartItemList){
            subTotal += (item.pricePerUnit * item.quantity);
        }
    }

    let total = subTotal + DeliveryFee;

    useEffect(() => {
        console.log('is',data)
    },[isScheduled,data])

    useEffect(() => {
        async function getCart(){
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
    
            let response;
            let responseObj;
            try{
                response = await fetch(`${process.env.REACT_APP_CART_SERVICE}getCartOfCustomer/${userDetails.ID}`, requestOptions);
                responseObj = await response.json();
                setData(responseObj.result);
               }
               catch(err){
                console.log("Error in creating order", err);
                setIsError(true);
                handleShow();
               }
        }
        getCart();
    },[]);

    async function checkQueueSize(){
        console.log('check queue', data);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"providerID":data.providerId})
        };

        const url = `${process.env.REACT_APP_PROVIDER_SERVICE}restaurant/status`;
        await fetch(url,requestOptions)
        .then((response)=>{
            console.log('response', response);
            if(response.status !== 200){
                throw Error(response.body);
            }
            return response.json();
        })
        .then((data) => {
            console.log('queue data',data);
            if(data.data.isQueueAvailable){
                createOrder();
            }else{
                setIsError(true);
                handleShow();
            }
        })

    }

    async function savePendingFeedback(data){
        const payload = [{
            'itemID':null,
            'providerID':data.providerId,
            'userID':data.userId,
            'orderID':data.orderId,
            'shopName':data.shopName
        }]
        data.orderItems.forEach((orderItem) => {
            let temp = {
                'itemID':orderItem.menuItemId,
                'providerID':data.providerId,
                'userID':data.userId,
                'orderID':data.orderId,
                'menuItemName':orderItem.menuItemName,
                'shopName':data.shopName                
            }
            payload.push(temp)
        })
        console.log('payload',payload);
        const url=`${process.env.REACT_APP_PROVIDER_SERVICE}savePendingFeedback`;
        const requestOptions ={
            method:"POST",
            headers: { "Content-Type": "application/json"},
            body:JSON.stringify(payload)
        }
        await fetch(url,requestOptions)
        .then((response)=>{
            if(!response.status === 201 || !response.status === 200){
                throw Error(response.statusText)
            }
            return response;
        })
    }
    async function createOrder(){

        let createOrderPayload = {
            userId: data.userId,
            providerId: data.providerId,
            orderStatus: null,
            isScheduled: isScheduled,
            scheduledDeliveryTime: null,
            cost: total,
            modeOfPayment: paymentMode,
            deliveryAddress:deliveryAddress,
            contactNo:userDetails.CELL_NUMBER,
            email:userDetails.EMAIL
        }
        if(isScheduled){
            createOrderPayload.scheduledDeliveryTime=time;
        }
        console.log("Create order payload", createOrderPayload)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createOrderPayload)
        };

        let response;
        let responseObj;

       try{
        response = await fetch(`${process.env.REACT_APP_ORDER_SERVICE}placeOrder`, requestOptions);
        responseObj = await response.json();
        savePendingFeedback(responseObj.result)
       }
       catch(err){
        console.log("Error in creating order", err);
        setIsError(true);
        handleShow();
       }

       if (responseObj.statusCode === 0){
            navigate('/my-orders')
            // setIsError(false);
            // handleShow();
       }
    

    }
   
  
  return (
    <div>
        <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
            <Container className="w-100 p-0">
                <Navbar.Brand href="#home">takeaway menu system</Navbar.Brand>
                <Nav className="justify-content-end">
                <Nav.Link href="#">Delivery to: {deliveryAddress}</Nav.Link>
                <Nav.Link onClick={()=>navigate("/my-orders")}>My Orders</Nav.Link>
                    <NavDropdown title={userDetails.FIRST_NAME} id="basic-nav-dropdown">
                        <NavDropdown.Item href="/">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
          </Navbar>
        <Container id='checkout-main-container'>
            <Card className="d-flex h-100">
                <Card.Body>
                    <div className="d-flex cardTitle" >
                        
                        <Card.Title><b>Delivery Details</b></Card.Title>
                                
                        <Container id='delivery-details'>
                            <Container id='delivery-address-container'>
                            <Row id='delivery-row'>
                                <b>Delivery Address</b>
                            </Row>
                            <div id='address-box'>{deliveryAddress}</div>

                        </Container>
                            
                            <Container id='payment-method-container'>
                            <Row xs={2} md={2} lg={2}>
                                <b>Payment Method</b>
                                <Card.Text>
                                    <Form>
                                        {['radio'].map((type) => (
                                            <div key={`inline-${type}`} className="mb-2">
                                            <Form.Check
                                                inline
                                                label="Cash"
                                                value="Cash"
                                                name="group1"
                                                type={type}
                                                id={`inline-${type}-1`}
                                                checked={selected === 'yes'}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                label="Wallet"
                                                value="Wallet"
                                                name="group1"
                                                type={type}
                                                id={`inline-${type}-2`}
                                                onChange={handleChange}
                                            />
                                            </div>
                                        ))}
                                    </Form>

                                </Card.Text>
                                
                            </Row>
                            <Row xs={2} md={2} lg={2}>
                            <Form>
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    label="Schedule?"
                                    onClick={() => {
                                        console.log('clicked');
                                        setIsScheduled(!isScheduled);
                                    }}
                                />
                            </Form>
                            {isScheduled && <input style={{width:"175px", border:'none'}} type="datetime-local" onChange={(e) => setTime(e.target.value)}/>}
                            </Row>

                            </Container>

                            <div id='divider'
                                style={{
                                background: '#f46c23',
                                height: '1px',
                                }}
                            />
                            
                        
                        </Container>
                        <Card.Text>
                        <b>YOUR ITEMS</b>
                        </Card.Text>

                        <Container id='checkoutItem'>
                        
                        {
                            data && 
                            <Container >
                            <Col>
                                {
                                    data.cartItemList.map(item => (
                                        <Row xs={2} md={2} lg={2}>
                                            <Card.Text>
                                                {item.menuItemName}
                                            </Card.Text>
                                            <Card.Text>
                                                x <span>{item.quantity}</span>
                                            </Card.Text>
                                        </Row>
                                    ))
                                }
                                
                            </Col>
                        </Container>
                        }


                        </Container>
                        </div>

                        <div id='divider'
                        style={{
                        background: '#f46c23',
                        height: '2px',
                        }}
                    />

                    <Container id='cartAmount'>

                        <Container>
                        <Row xs={2} md={2} lg={2}>
                            <span>
                            Subtotal
                            </span>
                            <span>
                                {subTotal}
                            </span>
                        </Row>
                        </Container>

                        <Container>
                        <Row xs={2} md={2} lg={2}>
                            <span>
                            Delivery fee
                            </span>
                            <span>
                                {DeliveryFee}
                            </span>
                        </Row>
                        </Container>

                        <Container>
                        <Row xs={2} md={2} lg={2}>
                            <span>
                            <b>Total</b>
                            </span>
                            <span>
                            <b>{total}</b>
                            </span>
                        </Row>
                        </Container>

                    </Container>

                    <Container id='submit-btn'>
                        <Button className="col-md-12 text-center" id='checkout-submit-button' onClick={checkQueueSize}>
                            <b>Submit</b>
                        </Button>

                    </Container>
                    

                    </Card.Body>
        
        </Card>

        {<MsgModal
            show={show}
            onHide={() => setShow(false)}
            msg={isError ? 'Somethings went wrong':'Order successfully placed'}
            iserror={isError}
            callBy ={1}/>
        }
        </Container>
    </div>
  );
}

export default Checkout;