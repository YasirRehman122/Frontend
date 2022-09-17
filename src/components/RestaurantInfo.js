import Card from "react-bootstrap/Card";
import {useSelector} from 'react-redux';
// import bgImg from '../images/bg-image.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import '../css/RestaurantInfo.css'

const selectRestaurant = state => state.restaurant;
function RestaurantInfo() {
  const restaurant = useSelector(selectRestaurant);
  // console.log('restaurant',restaurant)
  let rating = {};
    if(restaurant.AVG_RATING  < 4){
        rating={'text':' Good','color':'Blue'};
    } else if(restaurant.AVG_RATING  < 4.5){
        rating = {'text':' Very Good', 'color':'Green'}
    }else{
        rating={'text':' Excellent','color':'#f46c23'}
    }
  return (
    <Card style={{ width: '100%'}}>
    <Card.Img id="titleImage" variant="top" src={restaurant.IMAGE} />
      <Card.Body>
        <Card.Title className="d-flex flex-row align-items-center">
          <div className="titleHeading">
          {restaurant.SHOP_NAME}
          </div>
          <div id="rating">
            {
              restaurant.AVG_RATING ? 
              <div>
                <FontAwesomeIcon style={{marginRight:'2px'}} icon={faStar} color={rating.color} size='sm'/> 
                {restaurant.AVG_RATING}
              </div>
              : 'NA'
            }
          </div>
        </Card.Title>
        <Card.Text>
          <FontAwesomeIcon icon={faLocationDot}/> {restaurant.ADDRESS}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default RestaurantInfo;