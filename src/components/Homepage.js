import { Button, Container, Nav, Navbar, NavDropdown, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../css/Homepage.css'
import store from '../store';
import { useSelector } from 'react-redux';
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, {Marker} from 'react-map-gl'

const userDetailsSelector = state => state.userDetails;
const Homepage = () => {

    const [location, setLocation] = useState("");
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [show, setShow] = useState(false);

    let navigate = useNavigate();
    const userDetails = useSelector(userDetailsSelector);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleAddClick = (e) =>{
        console.log(e);
        setLat(e.lngLat.lat);
        setLng(e.lngLat.lng);
      };

      const getLocationData = async() => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoidXNtYW5zYWhtZWQiLCJhIjoiY2w3M2NxaHY1MDByNjNxbWI5MWMxc3M2aiJ9.O0J4wVs3_u4zAISIeWzdgA`
              console.log(url);
              let res = await fetch(url, {
                  method: 'GET'
             });
        let response = await res.json();
        setLocation(response.features[1].place_name);
        handleClose();
    }

    const getCoordinates = async() => {

        if (lat === null && lng === null) {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
          } else {
              navigator.geolocation.getCurrentPosition(async (position) => {
              setLat(position.coords.latitude);
              setLng(position.coords.longitude);
              handleShow();
            }, () => {
              console.log('Unable to retrieve your location');
            });
          }
        }
        else
            handleShow();
    }

    useEffect(() => {
        store.dispatch({type:'setDeliverAddress',payload:location});
        store.dispatch({type:'setLocation',payload:{address:location,longitude:lng,latitude:lat}})
    },[location])


    return(
        <div className="h-100 bg">            
            <Navbar style={{backgroundColor:"white", boxShadow:"1px 1px 5px #f25602"}} sticky="top" variant="light" className="navbarClass w-100 justify-content-between">
                <Container className="w-100 p-0">
                    <Navbar.Brand href="#home">takeaway menu system</Navbar.Brand>
                    <Nav className="justify-content-end">
                    {/* <Nav.Link href="#">Delivery to: {deliveryAddress}</Nav.Link> */}
                        <NavDropdown title={userDetails.FIRST_NAME} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">Logout</NavDropdown.Item>
                            {/* <NavDropdown.Item href="#action/3.2">
                            Another action
                            </NavDropdown.Item> */}
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div id="img">
                <Container id="reghomepage-main-container" className="d-flex flex-column h-100">  
                    <p id="slogan">It's the food you love, delivered</p>             
                    <Container id="addressContainer" className="d-flex flex-row">  
                        <section id="locationSection"> 
                            <input type="text" placeholder='Enter your full address' className='addressBox' value={location}/>
                            <Button onClick={getCoordinates} id="locationPickerButton">
                                <FontAwesomeIcon icon={faLocationCrosshairs}/>
                            </Button>
                        </section>                  
                        
                        <Button 
                            className="addressBoxButton" 
                            variant="primary" size="lg" 
                            type="submit"
                            onClick={()=>{navigate('/homefeed')}}
                            >Delivery</Button>
                        <p className="addressBoxText">or</p>
                        <Button className="addressBoxButton" variant="primary" size="lg" type="submit"
                        onClick={()=>{navigate('/homefeed')}}
                        >Pickup</Button>
                    </Container>
                </Container>

                <Modal show={show} onHide={handleClose} fullscreen={true}>
        <Modal.Body>
        <Map
            mapboxAccessToken="pk.eyJ1IjoidXNtYW5zYWhtZWQiLCJhIjoiY2w3M2NxaHY1MDByNjNxbWI5MWMxc3M2aiJ9.O0J4wVs3_u4zAISIeWzdgA"
            style={{
            width: "97.5vw",
            height: "80vh"
            }}
            initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: 15
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onClick={handleAddClick}
            >
                <Marker longitude={lng} latitude={lat} color="red" />
            </Map>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={getLocationData}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

            </div>
        </div>

    );
}

export default Homepage;