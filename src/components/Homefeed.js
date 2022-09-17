import React, { useEffect, useState } from 'react';
import RestaurantList from '../components/RestaurantList';
import store from '../store';
import CategoryCard from './CategoryCard';
import { useSelector } from 'react-redux';
import { Container, Nav, Navbar, NavDropdown, Modal} from 'react-bootstrap';
import Feedback from './Feedback';
import { useNavigate } from 'react-router-dom';

const userInfoSelector = state => state.userDetails;
const deliveryAddressSelector = state => state.deliveryAddress;
const locationSelector = state => state.location;

const HomeFeed = ({latitude, longitude}) => {
  
    const [nearBy,setNearBy] = useState(null);
    const [categories,setCategories] = useState(null);
    let navigate = useNavigate();
    const userDetails = useSelector(userInfoSelector);
    const deliveryAddress = useSelector(deliveryAddressSelector);
    const location = useSelector(locationSelector);
    const [bestSellers,setBestSellers] = useState(null);
    const [pastRestaurants,setPastRestaurants] = useState(null);
    const [feedbacks,SetFeedbacks] = useState(null);
    const [lgShow, setLgShow] = useState(false);

    useEffect(() => {

        async function fetchData() {
            const url = `${process.env.REACT_APP_PROVIDER_SERVICE}getNearbyRestaurants`;
            const payload = {latitude: location.latitude, longitude: location.longitude}; 
        
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                 "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
    
            let response = await res.json();
            setNearBy(response.data);
        }

        async function fetchUserCart(userId) {
          const url =`${process.env.REACT_APP_CART_SERVICE}getCartOfCustomer/${userId}`;

          let res = await fetch(url,{
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          });

          let response = await res.json();
          store.dispatch({type: 'cart/updateCart', payload: response.result});
          
        }

        async function fetchCategories() {
          const url =`${process.env.REACT_APP_PROVIDER_SERVICE}category`;

          let res = await fetch(url,{
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          });

          let response = await res.json();
          setCategories(response.data);
          
        }
        async function fetchBestSeller() {
          const url =`${process.env.REACT_APP_PROVIDER_SERVICE}getBestSellingRestaurants`;

          let res = await fetch(url,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify(location)
          });

          let response = await res.json();
          setBestSellers(response.data);
          
        }

        async function fetchYourRestaurants() {
          const url =`${process.env.REACT_APP_PROVIDER_SERVICE}getPastRestaurants`;

          let res = await fetch(url,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify({userID:userDetails.ID})
          });

          let response = await res.json();
          setPastRestaurants(response.data);
          
        }

        async function fetchPendingFeedback() {
          const url =`${process.env.REACT_APP_PROVIDER_SERVICE}getPendingFeedback`;

          let res = await fetch(url,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify({"userID":userDetails.ID})
          });

          let response = await res.json();
          SetFeedbacks(response.data);
          
        }

        // fetchBestSeller();
        fetchYourRestaurants();
        fetchCategories();
        fetchPendingFeedback();
        fetchData();
        fetchUserCart(userDetails.ID);
      }, []);

      useEffect(() => {
        console.log('categories', bestSellers);
      },[nearBy,categories,userDetails,bestSellers,feedbacks])

    return (      
      <div>
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
              {
                bestSellers  && <RestaurantList restaurantsList={bestSellers} category="Best Seller" applyClass={1}/>
              }

              { 
                pastRestaurants  && <RestaurantList restaurantsList={pastRestaurants} category="Your Restaurants" applyClass={1}/>
              }

            {
              categories && 
              <div className='d-flex flex-column mt-3'>
              <h3 style={{fontFamily: 'Open Sans', marginTop:'10px'}}>Cuisines for you</h3>
              <div className="d-flex flex-row categoriesContainer">
                {categories.map((category) => <CategoryCard category={category}/>)}
              </div>
            </div>
            }
            {nearBy && <RestaurantList restaurantsList={nearBy} category='All Restaurants' applyClass={0}/>}
            {
              feedbacks && 
             
                feedbacks.length && 
                <Modal
                  size="lg"
                  show={lgShow}
                  onHide={() => setLgShow(false)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      {feedbacks[0].SHOP_NAME}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body >
                    <Feedback feedbacks = {feedbacks}/>
                  </Modal.Body>
                </Modal>
              }

          </Container>
      </div>
    );
}

export default HomeFeed;