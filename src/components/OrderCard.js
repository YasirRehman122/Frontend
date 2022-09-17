import React from 'react';
import {Container, Card } from 'react-bootstrap';
import '../css/OrderCard.css';

const OrderCard = (props) => {
    return(
        <Container onClick={()=> props.handleOrderClick(props.order)}>
            <Card className="order">
                <Container className="d-flex justify-content-between align-items-center orderContainer ">
                    <Card.Title className='orderTitle'>Order# {props.order.orderId} </Card.Title>
                </Container>
                <Card.Body className='orderBody'>
                    <p>{props.deliveryAddress}</p>
                    <ul>
                        {props.order.orderItems.map((item) => <li>{item.menuItemName}</li>)}
                    </ul>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrderCard;