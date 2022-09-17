import { useState } from "react";
import {Button, Form, Container, Nav, Navbar} from 'react-bootstrap';
import MsgModal from "../components/MsgModal";
import { useNavigate} from 'react-router-dom';
import '../App.css';
import store from "../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser} from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const[msg,setMsg] = useState("");
    const[iserror, setIsError] = useState(false);
    let navigate = useNavigate();

    let handleSubmit = async (event) => {
        event.preventDefault();
        let payload = JSON.stringify({
            email: email,
            password: password
        });
        let response = await fetch(`${process.env.REACT_APP_IDENTITY_SERVICE}login`,{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: payload
        })
        .then((res) => res.json())
        .then((data)=> {
            if(data.status){
                store.dispatch({type:'ims/captureUserDetails', payload:data.data});
                if(data.data.IS_PROVIDER){
                    navigate('/providerFeed')
                }else{
                    navigate("/homepage");
                }
                
            }else{
                setIsError(!data.status);
                setModalShow(true);
                setMsg(data.message);
            }
        })
        .catch((err) => {
            
        })
    };

    const handleEmailChange = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }
    return (
        <div className='d-grid'>
            <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
                <Container className="w-100 p-0">
                    <Navbar.Brand href="#home">takeaway menu system</Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/registration">
                            <FontAwesomeIcon style={{marginRight:"5px"}} icon={faHouseUser} />
                            Sign up
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container id="main-container" className="d-grid h-100">
                <Form id="login-form" className="text-center w-100 h-100" onSubmit={handleSubmit}>
                    <h1 style={{color: `#F46C23`}} className="fs-3 fw-bold mb-3">Login</h1>
                    <Form.Group controlId="login-email">
                        <Form.Control 
                            className="mb-1"
                            type="text" 
                            placeholder="Enter Email or Cell Number" 
                            required
                            onChange={handleEmailChange}/>
                    </Form.Group>
                    <Form.Group controlId="login-password">
                        <Form.Control 
                            className="mb-3"
                            type="password" 
                            placeholder="Password" 
                            required
                            onChange={handlePasswordChange}
                            />
                    </Form.Group>
                    <div className="d-grid">
                        <Button className="submitButton" variant="primary" size="lg" type="submit">Continue</Button>
                    </div>
                </Form>
            </Container>
            {iserror && <MsgModal
                show={modalShow}
                onHide={()=>setModalShow(false)}
                msg={msg}
                iserror={iserror}
                callBy={2}
            />}
    </div>
    );
    
}

export default LoginForm;