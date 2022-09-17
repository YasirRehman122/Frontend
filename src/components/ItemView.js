import React, { useState } from 'react';
import { Container, Button, Card, Dropdown, Modal, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus} from '@fortawesome/free-solid-svg-icons';
import '../css/ItemView.css';
import store from '../store';
import {useForm} from 'react-hook-form';
import { useSelector } from 'react-redux';
import MsgModal from './MsgModal';

const ingredientSelector = state => state.ingredients;
const cartSelector = state => state.cart;
const restaurantSelector = state => state.restaurant;

const ItemView = (props) => {
    // console.log('props ITEM VIEW',props);
    const excludedIngredients= useSelector(ingredientSelector);
    const cart = useSelector(cartSelector);
    const restaurant = useSelector(restaurantSelector);
    const [showMsgModal,setShowMsgModal] = useState(false);
    const msg = 'You already have products from another restaurant. Shall we start over with a fresh cart?'
    // const ingredients = props.item.INGREDIENTS;
    const[optIng] = useState(props.item.OPTIONAL_INGREDIENTS); 
    const essIng = props.item.INGREDIENTS;
    const [modalShow, setModalShow] = useState(false);
    const {register, handleSubmit} = useForm();

    function handleExludingIngredients(e){
        if(e.ingredients){
            const payload = {"providerId":props.item.PROVIDER_ID, ingredients: e.ingredients}
            store.dispatch({type: 'cart/excludeIngredients', payload: payload})    
        }
        setModalShow(false);
      }
  
    const handleCartInsertion = () => {
        let ingList = [];
        {excludedIngredients.ingredients && excludedIngredients.ingredients.forEach((ing) => {
            ingList.push({"ingredientName":ing})
        })}
        if(!cart.providerId){
            const cartItem = {
                providerId: restaurant.ID,
                shopName: restaurant.SHOP_NAME,
                cartItems: {
                menuItemId: props.item.ID,
                menuItemName: props.item.ITEM_NAME,
                pricePerUnit: props.item.PRICE,
                quantity: 1,
                ingredientList: ingList
                }
            }
            store.dispatch({type: 'cart/removePreviousAddNew', payload: cartItem});
        }else if (props.item.PROVIDER_ID === cart.providerId){
            const cartItems = {
                        menuItemId: props.item.ID,
                        menuItemName: props.item.ITEM_NAME,
                        pricePerUnit: props.item.PRICE,
                        quantity: 1,
                        ingredientList: ingList
                }
                console.log('before dispatch', excludedIngredients.ingredients)
                store.dispatch({type: 'cart/addToCart', payload: cartItems})
        }else{
            setShowMsgModal(true);
        }
    }

    function refreshCart(){
        console.log('restaurant refresh cart', restaurant);
        const cartItem = {
            providerId: restaurant.ID,
            shopName: restaurant.SHOP_NAME,
            cartItems: {
            menuItemId: props.item.ID,
            menuItemName: props.item.ITEM_NAME,
            pricePerUnit: props.item.PRICE,
            quantity: 1,
            ingredients: excludedIngredients.ingredients
            }
        }
        store.dispatch({type: 'cart/removePreviousAddNew', payload: cartItem});
        setShowMsgModal(false);
    }

    return (
        <Container id="itemViewContainer" className='d-flex flex-shrink justify-content-center'>
            <Card  className=''>
            <Card.Img id="itemDp" variant="top" src={props.item.IMAGE} />
            <Card.Body id="itemViewBody">
                <Card.Title className="heading">{props.item.ITEM_NAME}</Card.Title>
                <Card.Text className="text">
                {props.item.DESCRIPTION}
                </Card.Text>
            </Card.Body>
                <Container className=''>
                    <Container className='d-flex flex-row justify-content-between'>
                        <h5 className="heading">Ingredients</h5>
                        <Button id="addToCartButton" onClick={handleCartInsertion} >
                            Add to <FontAwesomeIcon icon={faCartPlus} />
                        </Button>
                    </Container>
                    <hr></hr>
                    <Container className='d-flex flex-row justify-content-between'>
                    <p>Select to view essential ingredients</p>
                    <Dropdown id= "dropdown-container" >
                        <Dropdown.Toggle  id="dropdownButton">
                        Essential Ingredients
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        {essIng && essIng.map(ing => <Dropdown.Item>{ing}</Dropdown.Item>)}
                        </Dropdown.Menu>
                    </Dropdown>
                    </Container>
                    <Container className='d-flex flex-row justify-content-between'>
                    <p>Select to exclude ingredients of your choice</p>
                    <Button id = "dropdownButton" onClick={()=>setModalShow(true)}>Optional Ingredients</Button>
                    </Container>
                </Container>
            </Card>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(handleExludingIngredients)}>
                        <div className="d-flex mb-3 w-100">
                            {optIng && optIng.map((ing) => {
                                return (
                                    <div className="m-1">
                                        <input type='checkbox' id={ing} name={ing} {...register('ingredients')} value={ing}/>
                                        <label for={ing} >{ing}</label>
                                    </div>
                                )
                            })}
                        </div>
                        <div id="d-flex justify-content-center">
                            <button id="okButton" type='submit' class="btn btn-primary">Done</button>
                        </div>
                    </form>    
                </Modal.Body>
            </Modal>
            {
                showMsgModal && <MsgModal
                    show={showMsgModal}
                    onHide={()=>setShowMsgModal(false)}
                    msg={msg}
                    iserror={true}
                    refreshCart={refreshCart}
                    callBy ={0}
                />
            }
        </Container>
    );
}

export default ItemView;