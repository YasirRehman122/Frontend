import {ButtonGroup,Card,Butto,Row} from "react-bootstrap";
import React from 'react';

const CartItem = (props) => {
    return (
        <Row xs={3} md={3} lg={3}>
            <Card.Text>
            {item.menuItemName}
            </Card.Text>
            <Card.Text>
            {item.quantity}
            </Card.Text>
            <ButtonGroup aria-label="Third group">
            <Button onClick={incrementCounter} size='xxl' id='addQuantityButtons'>
                +
            </Button>
            <Button onClick={decrementCounter} size='xxl' id='subtractQuantityButtons'>
                -
            </Button>
            </ButtonGroup>
        
        </Row>
    )
}

export default CartItem;