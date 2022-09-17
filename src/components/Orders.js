import React from "react";
import { Container } from 'react-bootstrap';
import'../css/ProviderHomeScreenOrderView.css';
import OrderCard from '../components/OrderCard';

const Orders = (props) => {
    const handleOrderClick2 = (orderInfo) => {
        console.log('order info passed by order card', orderInfo);
        props.handleOrderClick(orderInfo);
    }
    return (
        <Container className="orderContainer overflow-auto">
            <Container className="reviewHeadingContainer">
                <h2 className="orderListHeading fixed-top">Orders list</h2>
            </Container>
            {props.ordersList && props.ordersList.map((order) => <OrderCard order={order} handleOrderClick={handleOrderClick2}/>)}  
        </Container>
    );
}

export default Orders;