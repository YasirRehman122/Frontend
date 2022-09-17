import { useState, useEffect } from "react";
import {useForm} from 'react-hook-form';
import { Button, Form, Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import '../css/RegistrationForm.css'
import {object,string,ref, date, number} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import MsgModal from "../components/MsgModal";
import {useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs, faHouseUser } from '@fortawesome/free-solid-svg-icons'
import store from "../store";

const schema = object().shape({
    firstName: string().min(3,"*required").max(50).required('Required'),
    lastName: string().min(3,"*required").max(50).required('Required'),
    email: string().email().required('*required'),
    cellNumber: string().matches(/^\+44\s\d{4}\s\d{6}/,'Invalid Number').required('required'),
    password: string().min(8,"Password must contain atleast 8 characters").max(50).required('*required'),
    confirmPassword: string().required('*required').oneOf([ref('password')], 'Password does not match'),
    shopName: string().required('*required'),
    licenseNo: string().min(2).required('*required'),
    // address: string().required('*required'),
    // openTime: string().required('*required'),
    // closeTime: string().required('*required'),
    queueSize: number().required()
})

const ProviderRegistrationForm = () => {

    const {register, handleSubmit, formState: {errors}} = useForm({resolver: yupResolver(schema)});
    const [modalShow, setModalShow] = useState(false);
    const[msg,setMsg] = useState("");
    const[iserror, setIsError] = useState(false);
    const [location, setLocation] = useState("");
    const [address,setAddress]=useState(null);
    const [longitude,setLongitude]=useState(null); 
    const [latitude,setLatitude]=useState(null);
    const [categories,setCategories] = useState(null);
    let navigate = useNavigate();
    const [catId,setCatId] = useState(null);
    const [postImage, setPostImage] = useState({
        myFile: "",
      });

    let responseJ;

    const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
        resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
        reject(error);
        };
    });
    };
    const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPostImage({ ...postImage, myFile: base64 });
    };

    useEffect(() => {
    },[postImage,categories]);

    function setCategory(e){
        console.log('e',e);
        let category = categories.filter((cat) => cat.NAME === e.target.innerHTML);
        console.log('category',category[0])
        setCatId(category[0].ID);
        console.log(catId);
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

    useEffect(()=>{
        fetchCategories();
    },[])
    const createWallet = async() => {
        console.log('wallet',responseJ);
        await fetch(`${process.env.REACT_APP_WALLET_SERVICE}createWallet`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userId:responseJ.data.ID,balance:100})
            })
            .then((response)=>{
                if(!response.ok){
                    throw Error(response.statusText)
                }
                navigate("/")
            })
            .catch((err) => console.log("err",err))
        store.dispatch({type:'ims/captureUserDetails', payload:responseJ.data})
    }

    const createProviderAccount = async(providerCreatePayload) => {
        console.log('provider Payload', providerCreatePayload);
        const url = `${process.env.REACT_APP_PROVIDER_SERVICE}createRestaurant`;
        const requestOption = {
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(providerCreatePayload)
        }
        await fetch(url,requestOption)
        .then((response => response.json()))
        .then((data) => {
            createWallet(responseJ);
        })
        .catch((error) => console.log(error));
    }

    const getCoordinates = async() => {
        console.log('inside get cord')
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
          } else {
              navigator.geolocation.getCurrentPosition(async (position) => {
              const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=pk.eyJ1IjoidXNtYW5zYWhtZWQiLCJhIjoiY2w3M2NxaHY1MDByNjNxbWI5MWMxc3M2aiJ9.O0J4wVs3_u4zAISIeWzdgA`
              console.log(url);
              setLongitude(position.coords.longitude);
              setLatitude(position.coords.latitude);
              let res = await fetch(url, {
                  method: 'GET'
             });
            let response = await res.json();
            setLocation(response.features[1].place_name);
            setAddress(response.features[1].place_name);
            }, () => {
              console.log('Unable to retrieve your location');
            });
          }        
    }


    const onSubmit = async (data) => {
        console.log('on submit');
        let accountCreatePayload = {};
        accountCreatePayload.firstName = data.firstName;
        accountCreatePayload.lastName = data.lastName;
        accountCreatePayload.email = data.email;
        accountCreatePayload.cellNumber = data.cellNumber;
        accountCreatePayload.password=data.password;
        accountCreatePayload.isProvider = true;
        
        let providerCreatePayload = {}
        providerCreatePayload.shopName = data.shopName;
        providerCreatePayload.openTime = data.openTime;
        providerCreatePayload.closeTime = data.closeTime;
        providerCreatePayload.licenseNo = data.licenseNo;
        providerCreatePayload.orderQueueSize = data.queueSize;
        providerCreatePayload.longitude = longitude
        providerCreatePayload.latitude = latitude;
        providerCreatePayload.address = address;
        providerCreatePayload.ownerName = data.firstName+" "+data.lastName;
        providerCreatePayload.image=postImage.myFile;
        providerCreatePayload.catId=catId;

        console.log('payload 1', accountCreatePayload);
        console.log('payload 2', providerCreatePayload);

        await fetch(`${process.env.REACT_APP_IDENTITY_SERVICE}signup`,{
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accountCreatePayload)
        })
        .then((res) => {
            console.log(res)
            if(res.status !== 201){
                throw Error(res.body)
            }
            return res.json();
        })
        .then((data) => {
            console.log('sign up data',data)
            responseJ = data;            
            providerCreatePayload.ID = data.data.ID;
            console.log('providerCreatePayload',providerCreatePayload);
            createProviderAccount(providerCreatePayload);
        })
        .catch((res) => {
            setIsError(true);
            setModalShow(true);
            setMsg('This email or cell number already exist');
            console.log(res);
        })
    }

    return (
        <div>
            <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
                <Container className="w-100 p-0">
                    <Navbar.Brand href="#home">takeaway menu system</Navbar.Brand>
                    <Nav className="justify-content-end">
                        <Nav.Link href="/">
                            <FontAwesomeIcon style={{marginRight:"5px"}} icon={faHouseUser} />
                            Log in
                        </Nav.Link>
                        {/* <Nav.Link href="#">cart</Nav.Link>
                        <Nav.Link href="#pricing">jumbo</Nav.Link> */}
                    </Nav>
                </Container>
            </Navbar>
            <Container className='h-100 regContainer'>
                <Container className='h-100'>
                    <Container id="reg-main-container" className="d-flex h-100 mt-5">
                        <Form id="login-form"  className="text-center w-100" onSubmit={handleSubmit(onSubmit)}>
                        <div style={{marginBottom:'1px'}}>
                            <h1 style={{color: `#F46C23`}} className="fs-3 fw-bold">CREATE ACCOUNT</h1>
                            <p className="regOption" onClick={()=>navigate('/registration')}>Register as a customer?</p>
                       </div>
                            <Form.Group >
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        First Name
                                        {errors.firstName && <p className="error">{errors.firstName.message}</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="text"
                                    {...register("firstName")}
                                    placeholder="John"
                                />
                                
                            </Form.Group>
                            <Form.Group >
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Last Name
                                        {errors.lastName && <p className="error">{errors.lastName.message}</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control 
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="Johnson"
                                />
                            </Form.Group>
                            <Form.Group >
                                <span> 
                                    <Form.Label className="d-flex justify-content-left">
                                        Email
                                        {errors.email && <p className="error">{errors.email.message}</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="email"
                                    {...register("email")}
                                    placeholder="example@xyz.com"
                                />
                            </Form.Group>
                            <Form.Group >
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
                            {/* <div className="d-flex"> */}
                            <Form.Group>
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Password 
                                        {errors.password && <p className="error">{errors.password.message}</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="password"
                                    placeholder="********"
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
                                    placeholder="********"
                                    {...register("confirmPassword")}
                                />
                            </Form.Group>
                            {/* </div> */}
                            <Form.Group>
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Shop Name
                                        {errors.shopName && <p className="error">*required</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder="McDonalds"
                                    {...register("shopName")}
                                />
                            </Form.Group>
                            <div className="d-flex">
                            <Form.Group className="w-100">
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Opening Time
                                        {errors.openTime && <p className="error">*required</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="time"
                                    placeholder="09:00 A.M"
                                    {...register("openTime")}
                                />
                            </Form.Group>
                            <Form.Group className="w-100">
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Closing Time
                                        {errors.closeTime && <p className="error">*required</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="time"
                                    placeholder="10:00 P.M"
                                    {...register("closeTime")}
                                />
                            </Form.Group>
                            </div>
                            <Form.Group>
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Order Serving Capacty
                                        {errors.queueSize && <p className="error">*required</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="string"
                                    placeholder="10"
                                    {...register("queueSize")}
                                />
                            </Form.Group>
                            <Form.Group>
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        License Number
                                        {errors.licenseNo && <p className="error">*required</p>}
                                    </Form.Label>
                                </span>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                    {...register("licenseNo")}
                                />
                            </Form.Group>
                            <Form.Group>
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Address
                                        {address === "" && <p className="error">*required</p>}
                                    </Form.Label>
                                </span>
                                <div className="d-flex">
                                    <Form.Control 
                                    type="text" 
                                    placeholder='Enter your full address'
                                    className='' value={location} 
                                    />
                                    <Button id="locationPickerReg" onClick={getCoordinates}>
                                        <FontAwesomeIcon icon={faLocationCrosshairs}/>
                                    </Button>
                                </div>
                            </Form.Group>
                            <Form.Group>
                                <span>
                                    <Form.Label className="d-flex justify-content-left">
                                        Title page image
                                    </Form.Label>
                                </span>
                                <div className="d-flex">
                                    <Form.Control 
                                    type="file" 
                                    placeholder='Enter your full address'
                                    name="myFile"
                                    accept=".jpeg, .png, .jpg"
                                    onChange={(e) => handleFileUpload(e)}
                                    />
                                </div>
                            </Form.Group>
                            <Dropdown className="mb-3">
                                <Dropdown.Toggle id="dropdown-basic" className='catDropDownReg'>
                                    Select your speciality
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {categories && categories.map((category) => 
                                        {return <Dropdown.Item value={category.NAME}  onClick={setCategory}>{category.NAME}</Dropdown.Item>}
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                            <p>{postImage.myFile}</p>
                            <div className="d-grid mt-3">
                                <Button style={{backgroundColor: `#F46C23`,height:'90%'}} className="submitButton" size="lg" type="submit">Submit</Button>
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
            </Container>
        </div>
    );
}

export default ProviderRegistrationForm;