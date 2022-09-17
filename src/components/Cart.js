import {ButtonGroup,Card,Button,Container,Col,Row} from "react-bootstrap";
import '../css/Cart.css';
import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import MsgModal from '../components/MsgModal';
import store from '../store';
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const selectCartItems = state => state.cart;
const selectRestaurant = state => state.restaurant;

function Cart() {
  const cart = useSelector(selectCartItems);  
  const restaurant = useSelector(selectRestaurant);
  console.log('restaurant in cart', restaurant)
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msg,setMsg] = useState('');
  const [disableButton,setDisableButton] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    if(cart){
      if(cart.cartItemList){
        if(cart.cartItemList.length > 0){
          setDisableButton(false);
        }
      }
    }else{
      setDisableButton(true);
    }
  },[cart]);
  
  let incrementCounter = (e) => {
    console.log(e.target);
    store.dispatch({type:'cart/incrementItem', payload: e.target.value});
  }

  let decrementCounter = (e) => {
    console.log(e.target.value)
    store.dispatch({type:'cart/decrementItem', payload: e.target.value});
  }
  
  function calculateSubTotal(){
    let total = 0;
    if(cart.cartItemList){
      cart.cartItemList.forEach((item)=>{
        total += item.quantity * item.pricePerUnit;
      });
    }
    return total;
  }
  function calculateTotal(){
    return calculateSubTotal() + 1;
  }
  
  async function callToUpdateCart(){
    let tempCart = cart;
    delete tempCart.cartId;
    const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tempCart)
        };

        await fetch(`${process.env.REACT_APP_CART_SERVICE}addToCart`, requestOptions)
        .then((response)=> {
          if(response.status !== 200){
            throw Error('Something went wrong, please try again later')
          }
        })
          .then(() => navigate("/checkout"))
          .catch((err) => {
            console.log("Error in creating order", err);
            setShowMsgModal(true);
            setMsg('Something went wrong, please try again later');
          })
  }
  const updateCart = () => {
    callToUpdateCart();
  }

  return (
    <Card  id='card' className="justify-content-start h-100 m-0">
      <Card.Body className="mt-3">
        <div className="d-flex cardTitle" >

        <Card.Title>{!cart.cartItemList ? 'Your Cart' : `Your cart from ${restaurant.SHOP_NAME}`}</Card.Title>
        <Card.Text>
          {cart.cartItemList < 1 ? 'Start adding items to your cart' : ''}
        </Card.Text>

        <Container>
          <Container id='cartItemContainer'>
            <Col>
            {
              cart.cartItemList && cart.cartItemList.map(item => (
                <Row xs={3} md={3} lg={3}>
                  <Card.Text>
                    {item.menuItemName}
                  </Card.Text>
                  <Card.Text>
                    {item.quantity}
                  </Card.Text>
                  <ButtonGroup aria-label="Third group">
                    <Button value={item.menuItemId} onClick={e => incrementCounter(e,'value')} size='xxl' id='addQuantityButtons'>
                    <FontAwesomeIcon icon={faPlus}/>
                    </Button>
                    <Button value={item.menuItemId} onClick={e => decrementCounter(e,'value')} size='xxl' id='subtractQuantityButtons'>
                    <FontAwesomeIcon icon={faMinus}/>
                    </Button>
                  </ButtonGroup>
              
                </Row>
              ))
            }
            </Col>
          </Container>
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
            <Card.Text>
              Subtotal
            </Card.Text>
            <Card.Text>
              {calculateSubTotal()}
            </Card.Text>
          </Row>
        </Container>

        <Container>
          <Row xs={2} md={2} lg={2}>
            <Card.Text>
              Delivery fee
            </Card.Text>
            <Card.Text>
              1
            </Card.Text>
          </Row>
        </Container>

        <Container>
          <Row xs={2} md={2} lg={2}>
            <Card.Text>
              Total
            </Card.Text>
            <Card.Text>
              {calculateTotal()}
            </Card.Text>
          </Row>
        </Container>

      </Container>

        <Button className="col-md-12 text-center" id='cartButton' onClick={updateCart} disabled={disableButton}>
          Proceed to checkout
        </Button>

      </Card.Body>
      {showMsgModal && 
        <MsgModal
          show={showMsgModal}
          onHide={()=>setShowMsgModal(false)}
          msg={msg}
          iserror={true}
        />
      }
    </Card>
  );
}

export default Cart;