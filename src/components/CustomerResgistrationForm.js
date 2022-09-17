import { useState } from "react";
import {useForm} from 'react-hook-form';
import { Button, Form, Container, Nav, Navbar } from "react-bootstrap";
import '../css/RegistrationForm.css';
import '../css/Header.css';
import {object,string,ref} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import MsgModal from "../components/MsgModal";
import {useNavigate} from 'react-router-dom';
import store from "../store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser} from '@fortawesome/free-solid-svg-icons';

const schema = object().shape({
    firstName: string().min(3,"*required").max(50).required('Required'),
    lastName: string().min(3,"*required").max(50).required('Required'),
    email: string().email().required('*required'),
    cellNumber: string().matches(/^\+44\s\d{4}\s\d{6}/,'Invalid Number').required('required'),
    password: string().min(8,"Password must contain atleast 8 characters").max(50).required('*required'),
    confirmPassword: string().required('*required').oneOf([ref('password')], 'Password does not match')
})

const CustomerRegistrationForm = () => {

    const {register, handleSubmit, formState: {errors}} = useForm({resolver: yupResolver(schema)});
    const [modalShow, setModalShow] = useState(false);
    const[msg,setMsg] = useState("");
    const[iserror, setIsError] = useState(false);
    let navigate = useNavigate();
    const [isCustomer,setIsCustomer] = useState(true);
    const createWallet = async(response) => {
        console.log('wallet',response);
        await fetch(`${process.env.REACT_APP_WALLET_SERVICE}createWallet`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userId:response.data.ID,balance:100})
            })
            .then(()=>console.log("success"))
            .catch((err) => console.log("err",err))
        store.dispatch({type:'ims/captureUserDetails', payload:response.data})
    }

    function handleChange(e){
        const {value} = e.target;
        value === 'customer' ? setIsCustomer(true) : setIsCustomer(false);
    }

    const onSubmit = async (data) => {
        console.log('data',data);
        let response;
        data.isProvider = false;
        console.log(data);
        response = await fetch(`${process.env.REACT_APP_IDENTITY_SERVICE}signup`,{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then((res) => res.json())
        .then((data) => createWallet(data))
        .then(() => navigate("/homepage"))
        .catch((error) => {
            setIsError(true);
            setModalShow(true);
            setMsg(response.json().message);
            console.log(error);
        })
    }

    return (
        <div className='h-100 regContainer'>
            <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
                <Container className="w-100 p-0">
                <Navbar.Brand href="/registration">
                    takeaway menu system
                </Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Link href="/">
                        <FontAwesomeIcon style={{marginRight:"5px"}} icon={faHouseUser} />
                        Log in
                    </Nav.Link>
                </Nav>
                </Container>
            </Navbar>
            <Container className='h-100'>
                <Container id="reg-main-container" className="d-flex h-100">
                    <Form id="login-form"  className="text-center w-100" onSubmit={handleSubmit(onSubmit)}>
                       <div style={{marginBottom:'1px'}}>
                        <h1 style={{color: `#F46C23`}} className="fs-3 fw-bold">CREATE ACCOUNT</h1>
                        <p className="regOption" onClick={()=>navigate('/provider-registration')}>Register as a provider?</p>
                       </div>
                        <Form.Group>
                            <span>
                                <Form.Label className="d-flex justify-content-left">
                                    First Name
                                    {errors.firstName && <p className="error">{errors.firstName.message}</p>}
                                </Form.Label>
                            </span>
                            <Form.Control
                                type="text"
                                {...register("firstName")}
                            />
                            
                        </Form.Group>
                        <Form.Group>
                            <span>
                                <Form.Label className="d-flex justify-content-left">
                                    Last Name
                                    {errors.lastName && <p className="error">{errors.lastName.message}</p>}
                                </Form.Label>
                            </span>
                            <Form.Control
                                type="text"
                                {...register("lastName")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <span> 
                                <Form.Label className="d-flex justify-content-left">
                                    Email
                                    {errors.email && <p className="error">{errors.email.message}</p>}
                                </Form.Label>
                            </span>
                            <Form.Control
                                type="email"
                                {...register("email")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <span>
                                <Form.Label className="d-flex justify-content-left">
                                    Cell Number
                                    {errors.cellNumber && <p className="error">{errors.cellNumber.message}</p>}
                                </Form.Label>
                            </span>
                            <Form.Control
                                type="text"
                                {...register("cellNumber")}
                                placeholder="+44 xxxx xxxxxx"
                            />
                        </Form.Group>
                        <Form.Group>
                            <span>
                                <Form.Label className="d-flex justify-content-left">
                                    Password 
                                    {errors.password && <p className="error">{errors.password.message}</p>}
                                </Form.Label>
                            </span>
                            <Form.Control
                                type="password"
                                {...register("password")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <span>
                                <Form.Label className="d-flex justify-content-left">
                                    Confirm Password
                                    {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
                                </Form.Label>
                            </span>
                            <Form.Control
                                type="password"
                                {...register("confirmPassword")}
                            />
                        </Form.Group>
                        <div className="d-grid mt-3">
                            <Button style={{backgroundColor: `#F46C23`}} className="submitButton" size="lg" type="submit">Submit</Button>
                        </div>
                    </Form>
                </Container>
                <MsgModal
                    show={modalShow}
                    onHide={()=>setModalShow(false)}
                    msg={msg}
                    iserror={iserror}
                    callBy ={2}
                />
            </Container>
        </div>
    );
}

export default CustomerRegistrationForm;