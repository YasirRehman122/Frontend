import React, {useState} from 'react';
import {Card, Button} from 'react-bootstrap';
import '../css/ProviderHomeFeed.css';
import { faLocationDot,faAddressBook,faClock} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OrderItemView from './OrderItemView';
import {useSelector} from 'react-redux';

const userDetailsSelector = state => state.userDetails;

const OrderDetails = (props) => {
    console.log('order info in order details', props.orderInfo);
    const userDetails = useSelector(userDetailsSelector);
    const [disabled,setDisabled] = useState(false);

    async function updateOrder(){
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        };
        const url=`${process.env.REACT_APP_ORDER_SERVICE}updateOrderStatus/${props.orderInfo.orderId}/12`;

        await fetch(url,requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if(data.statusCode === 0){
                console.log('ok',data);
                props.refetchActiveOrder3();
            }else{
                console.log('not ok', data);
            }
        })
    }

    async function updateQueue(){
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({providerID:userDetails.ID})
        };
        const url=`${process.env.REACT_APP_PROVIDER_SERVICE}updateQueue`;

        await fetch(url,requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if(data.statusCode === 0){
                console.log('ok',data);
                props.refetchActiveOrder3();
            }else{
                console.log('not ok', data);
            }
        })
    }
    const updateOrderStatus = async() => {
        await updateOrder();
        await updateQueue();
        setDisabled(true);
        props.refetchActiveOrder3();
    }
    return (
            <div className="orderDetailsView">
            {props.orderInfo && 
             <Card className="orderDetailViewCard pb-0">
                <Card.Body className="d-flex flex-row justify-content-between pb-3 pt-3">
                    <div className="d-flex flex-column">
                        <Card.Title>Order# {props.orderInfo.orderId}</Card.Title>
                        <div className='d-flex'>
                        <Card.Text style={{width:'30vw'}}>
                            <FontAwesomeIcon style={{color:"#F46C23", marginRight:"1%"}} icon={faLocationDot}/>
                            <span style={{marginRight:'2px'}} >Delivery Address:</span>
                            {props.orderInfo.deliveryAddress}
                        </Card.Text>
                        <Card.Text style={{width:'15vw'}}>
                            <FontAwesomeIcon style={{color:"#F46C23", marginRight:"1%"}} icon={faAddressBook}/>
                            {props.orderInfo.contactNo}</Card.Text>
                        </div>
                        <div>
                        <Card.Text style={{width:'30vw'}}>
                            <FontAwesomeIcon style={{color:"#F46C23", marginRight:"1%"}} icon={faClock}/>
                            <span style={{marginRight:'2px'}} >Delivery:</span>
                            <strong>{props.orderInfo.scheduledDeliveryTime ? props.orderInfo.scheduledDeliveryTime : 'NOW'}</strong>
                        </Card.Text>
                        </div>
                    </div>
                    <div>
                        <Button id='markCompleteButton' onClick={updateOrderStatus} disabled={disabled}>Completed</Button>
                    </div>
                </Card.Body>
                <Card.Body style={{paddingTop:"10px",paddingBottom:"10px"}} className="d-flex flex-row orderItemListContainer">
                    {
                    props.orderInfo.orderItems.map((item) => {
                        return (
                            <OrderItemView itemInfo={item}/>
                        )
                        })
                    }
                </Card.Body>
            </Card>}
        </div>
    );
}

export default OrderDetails;
