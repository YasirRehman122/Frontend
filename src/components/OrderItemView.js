import React from "react";
import {Card, ListGroup} from 'react-bootstrap';
import '../css/ProviderHomeFeed.css';


const OrderItemView = (props) => {
    return (
        <Card bg="light" style={{ width: '12rem',height:'300px', marginRight: "5px"}}>
            <Card.Body className="pb-0">
                <Card.Title className="itemHeading">{props.itemInfo.menuItemName}</Card.Title>
                <Card.Text style={{marginBottom: '2px'}}>
                    Quantity: <span style={{fontWeight:'bold'}} >{props.itemInfo.quantity}</span>
                </Card.Text>
                <Card.Text style={{fontWeight:"bold"}}>Excluded Ingredients</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush ingList" as="ul" numbered>
                {
                 props.itemInfo.ingredientList.length > 0 
                 ? props.itemInfo.ingredientList.map((ing) => {
                    return <ListGroup.Item as="li">{ing.ingredientName}</ListGroup.Item>
                })
                : <ListGroup.Item as="li">None</ListGroup.Item>
                }
            </ListGroup>
            
        </Card>

    );
}

export default OrderItemView;