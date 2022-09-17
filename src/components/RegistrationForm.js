import { useState } from "react";
import {useForm} from 'react-hook-form';
import { Form, Container, Nav, Button, Navbar } from "react-bootstrap";
import '../css/RegistrationForm.css';
import '../css/Header.css';
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser} from '@fortawesome/free-solid-svg-icons';

const RegistrationForm = () => {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const[iserror, setIsError] = useState(false);
    let navigate = useNavigate();

    function setValue(e){
        console.log(e)
    }

    function navigateToForm(e){
        console.log('target',e.target);
        if(e.target === 'customer'){
            navigate('/customer-registration')
        }
        else{
            navigate('/provider-registration')
        }
    }

    return (
        <div className='h-100 w-100 regContainer'>
            <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
                <Container className="w-100 p-0">
                <Navbar.Brand href="#">takeaway menu system</Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Link href="/">
                        <FontAwesomeIcon style={{marginRight:"5px"}} icon={faHouseUser} />
                        Log in
                    </Nav.Link>
                </Nav>
                </Container>
            </Navbar>

            <Container id="reg-main-container" className="d-flex flex-column h-100">
                
                <h1>Please select </h1>
                <Button type="submit">Next</Button>
                
            </Container>
        </div>
    );
}

export default RegistrationForm;