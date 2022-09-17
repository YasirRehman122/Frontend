import RestaurantInfo from '../components/RestaurantInfo';
import Cart from '../components/Cart';
import RestaurantCategories from './RestaurantCategories';
import '../css/RestaurantFeed.css';
import '../css/Cart.css'
import { useSelector } from 'react-redux';
import {useState, useEffect} from 'react';
import { Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping} from '@fortawesome/free-solid-svg-icons';

const restaurantSelector = state => state.restaurant;
const userInfoSelector = state => state.userDetails;
const deliveryAddressSelector = state => state.deliveryAddress;

function RestaurantFeed() {
  const restaurant = useSelector(restaurantSelector);
  const userDetails = useSelector(userInfoSelector);
  const deliveryAddress = useSelector(deliveryAddressSelector);
  let navigate = useNavigate()
  const [data,setData] = useState({});

  useEffect(() => {
    async function fetchMenu() {
      const url =`${process.env.REACT_APP_PROVIDER_SERVICE}getRestaurantMenu`;

      let res = await fetch(url,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({providerID:restaurant.ID})
      });

      let response = await res.json();
      setData(response.data);    
    }
    fetchMenu();
  },[])

  useEffect(()=>{
    
  },[data])

  return (
    <div className="d-flex h-100 flex-column">
      <div>
      <Navbar fixed="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
          <Container className="w-100 p-0">
            <Navbar.Brand>takeaway menu system</Navbar.Brand>
              <Nav className="justify-content-end">
                <Nav.Link href="#">Delivery to: {deliveryAddress}</Nav.Link>
                <Nav.Link onClick={()=> navigate('/my-orders')}><FontAwesomeIcon icon={faCartShopping}/>My orders</Nav.Link>
                    <NavDropdown title={userDetails.FIRST_NAME} id="basic-nav-dropdown">
                      <NavDropdown.Item href="/">Logout</NavDropdown.Item>
                    </NavDropdown>
              </Nav>
          </Container>
      </Navbar>
      </div>
      <div className='d-flex flex-row'>
        <div className='leftContainer'>
          <RestaurantInfo/>  
          <RestaurantCategories data = {data} />
        </div>
        <div className='rightContainer'>
          <Cart />
        </div>
      </div>
    </div>
  );
}

export default RestaurantFeed;