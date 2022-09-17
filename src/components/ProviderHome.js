import React, { useEffect, useState } from 'react';
import ProviderHomeFeed from './ProviderHomeFeed';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars} from '@fortawesome/free-solid-svg-icons';
import { Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const userDetailsSelector = state => state.userDetails;

const ProviderHome = () => {
    
    const userDetails = useSelector(userDetailsSelector);
    const [providerInfo,setProviderInfo] = useState(null);
    const [ordersList, setOrdersList] = useState(null);
    let navigate=useNavigate();

    async function fetchActiveOrders(){
        const requestOptions = {
            method: 'GET',
            headers: {
                "Content-Type":"application/json"
            }
        };
        const url = `${process.env.REACT_APP_ORDER_SERVICE}getActiveOrdersByProviderId/${userDetails.ID}`;
        await fetch(url,requestOptions)
        .then((response) => response.json())
        .then((data) => setOrdersList(data.result))
        .catch((error) => console.log(error));
    }

    async function fetchProviderInfo(){
        const url = `${process.env.REACT_APP_PROVIDER_SERVICE}getProviders`;
        const requestOptions ={
            method:"POST",
            headers:{
                "Content-Type":"application/json",                
            },
            body:JSON.stringify({ids:userDetails.ID})
        }
        await fetch(url,requestOptions)
        .then((response)=> {
            if(!response.status === 200){
                throw Error(response.statusText)
            }
            return response.json()
        })
        .then((data)=> {
            setProviderInfo(data.data[0]);
            console.log('provider Info', data.data[0]);
        })
        .catch((error) => console.log(error));
    }

    useEffect(() => {
        fetchActiveOrders();
        fetchProviderInfo();
    },[]);

    useEffect(() => {
      },[ordersList,providerInfo])
    
    const refetchActiveOrder = () => {
        fetchActiveOrders();
        fetchProviderInfo();
    }
    return (
        <div style={{margin: '0'}} className="h-100">
            <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
                <Container className="w-100 p-0">
                <Navbar.Brand onClick={()=>navigate(-1)}>takeaway menu system</Navbar.Brand>
                    <Nav className="justify-content-end">
                    <Nav.Link onClick={()=>navigate('/my-menu')}>
                            <FontAwesomeIcon style={{marginRight:"5px"}} icon={faBars} />
                            Menu
                        </Nav.Link>
                        <NavDropdown title={userDetails.FIRST_NAME} id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            
            <ProviderHomeFeed providerInfo={providerInfo} ordersList={ordersList} refetchActiveOrder1={refetchActiveOrder}/>
        </div>
    );
}

export default ProviderHome;