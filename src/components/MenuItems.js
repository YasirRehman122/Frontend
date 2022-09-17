import Card from 'react-bootstrap/Card';
import '../css/RestaurantCategory.css';
import React, {useState} from 'react';
import store from '../store';
import ItemDetailedView from './ItemDetailedView';
import customImg from '../images/form-background-photo.jpeg';

function MenuItems(props){

    const[itemInfo] = useState(props.name);
    // console.log('menu props',props.name);
    const[showModal,setShowModal] = useState(false);

    const handleClick = () => {
        setShowModal(true);
    }

    return (
        <div>
            <Card style={{ cursor: 'pointer' }} onClick={handleClick} className='restaurant-menu'>
            <Card.Body>
                <div className='d-flex flex-row justify-content-between'>
                    <div>
                    <Card.Text className='itemNameTitle'>         
                        {props.name['ITEM_NAME']}
                    </Card.Text>
                    <Card.Text id='meniItemDescription'>
                        {props.name['DESCRIPTION']}
                    </Card.Text>
                    <Card.Text>
                        $ {props.name['PRICE']}
                    </Card.Text>
                    </div>
                    <div>
                        <img src={props.name['IMAGE']} style={{width: '100px',height: '100px'}}/>
                    </div>
                </div>
            </Card.Body>
        </Card>
        {   
            showModal && 
            <ItemDetailedView 
                show={showModal}
                onHide={()=>setShowModal(false)}
                data={props.name}
            />
        }
        </div>
    );   
}

export default MenuItems;




