import React, { useEffect, useState } from 'react';
import RestaurantList from '../components/RestaurantList';
import store from '../store';
import { useParams  } from 'react-router-dom';
import { useSelector } from 'react-redux/';
import {Container, Nav,Navbar,NavDropdown} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const userInfoSelector = state => state.userDetails;
const deliveryAddressSelector = state => state.deliveryAddress;
const locationSelector = state => state.location;

const CategorySpecificView = ({latitude, longitude}) => {
  
    const [data, setData] = useState(null);
    const userDetails = useSelector(userInfoSelector);
    const deliveryAddress = useSelector(deliveryAddressSelector);
    const location = useSelector(locationSelector);
    let navigate = useNavigate();
    let param = useParams();
    console.log('param', param);

    useEffect(() => {

        async function fetchData() {
            const url = `${process.env.REACT_APP_PROVIDER_SERVICE}getNearbyRestaurants`;
            const payload = {latitude: location.latitude, longitude: location.longitude,catId: parseInt(param.categoryId)}; 
        
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                 "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
    
            let response = await res.json();
            setData(response.data);
    
        }

        async function fetchUserCart() {
          const url =`${process.env.REACT_APP_CART_SERVICE}getCartOfCustomer/${userDetails.ID}`;

          let res = await fetch(url,{
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          });

          let response = await res.json();
          store.dispatch({type: 'cart/updateCart', payload: response.result});
          
        }
        fetchData();
        fetchUserCart();
      }, []);

      useEffect(()=>{
        console.log('rest',data)
      },[data])


    return (
        <div>
       {/* <Header/> */}
       <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
        <Container className="w-100 p-0">
            <Navbar.Brand href="#home">takeaway menu system</Navbar.Brand>
            <Nav className="justify-content-end">
              <Nav.Link href="#">Delivery to: {deliveryAddress}</Nav.Link>
              <Nav.Link onClick={()=>navigate("/my-orders")}>My Orders</Nav.Link>
              <NavDropdown title={userDetails.FIRST_NAME} id="basic-nav-dropdown">
                <NavDropdown.Item href="/">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
        </Container>
      </Navbar>
        <Container className="App">
          {data && <RestaurantList restaurantsList={data} category={param.name} applyClass={0}/>}
        </Container>
      </div>
    );
}

export default CategorySpecificView;