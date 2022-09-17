import '../css/RestaurantCard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSterlingSign } from '@fortawesome/free-solid-svg-icons'
import store from '../store';
import { useNavigate } from "react-router-dom";

const RestaurantCard = (props) => {
    console.log('card',props);
    let navigate = useNavigate();
    let rating = {};
    if(props.restaurant.AVG_RATING  < 4){
        rating={'text':' Good','color':'Blue'};
    } else if(props.restaurant.AVG_RATING  < 4.5){
        rating = {'text':' Very Good', 'color':'Green'}
    }else{
        rating={'text':' Excellent','color':'#f46c23'}
    }
    
    const updateClickedProviderId= () =>{
        store.dispatch({type:'provider/goToRestaurant',payload:props.restaurant});
        navigate(`/restaurant/${props.restaurant.SHOP_NAME}`);
    }
    return (
        <div onClick={updateClickedProviderId} className="restaurantCard">
            {/* <p>IMAGE: {props.restaurant.IMAGE}</p> */}
            <img src={props.restaurant.IMAGE} alt="Restaurant Card" width="100%"/>
            <div>
                <p>{props.restaurant.SHOP_NAME}</p>
                <p style={{color:rating.color}}>
                    <FontAwesomeIcon style={{marginRight:'2px'}} icon={faStar} color={rating.color} size='sm'/>
                    {props.restaurant.AVG_RATING} 
                    {rating.text} 
                </p>
                <p><FontAwesomeIcon icon={faSterlingSign} color="gray" size='sm'/> 2.5 delivery fee</p>
            </div>
            
        </div>
    );
}

export default RestaurantCard