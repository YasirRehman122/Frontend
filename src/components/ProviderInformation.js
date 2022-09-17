import React from 'react';
import {Container,Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faStar, faCartPlus, faIdCard, faWarehouse } from '@fortawesome/free-solid-svg-icons'

const ProviderInformation = (props) => {
    console.log('provider information props',props);
    const refreshPage = () => {
        props.refreshActiveOrder2();
    }
    return(
        <>{
            props.providerInfo &&
            <Container className="d-flex flex-column providerInformationContainer">
                <div className='d-flex flex-row justify-content-between pb-3'>
                    <h1 className='providerInfoTitle'>{props.providerInfo.SHOP_NAME}</h1>
                </div>
                <div className='d-flex flex-column'>
                    <div className='d-flex flex-row justify-content-between pb-2'>
                        <p style={{width:"100vw"}}> 
                            <FontAwesomeIcon style={{color:"#F46C23", marginRight:"2%"}} icon={faLocationDot}/>
                            {props.providerInfo.ADDRESS}
                        </p>
                        <p style={{width:"10vw"}}>
                            {
                                props.providerInfo.AVG_RATING ? 
                                <div>
                                    {props.providerInfo.AVG_RATING}/5
                                    <FontAwesomeIcon style={{marginLeft:'5px'}} icon={faStar} color={"#F46C23"} size='sm'/>
                                </div>
                                : 'NA'
                            }
                        </p>
                    </div>
                    <div className='d-flex flex-row justify-content-between'>
                        <div className="d-flex flex-row justify-content-between providerInfoBottmDivs">
                            <p><FontAwesomeIcon style={{marginRight:'10px'}} size='lg' color={"#F46C23"} icon={faCartPlus}/>{props.providerInfo.CURRENT_QUEUE_SIZE}</p>
                            <p style={{marginLeft:'5px'}} >Serving capacity</p>
                        </div>
                        <div className="d-flex flex-row justify-content-between providerInfoBottmDivs">
                            <p><FontAwesomeIcon style={{marginRight:'10px'}} size='lg' color={"#F46C23"} icon={faIdCard}/>{props.providerInfo.LICENSE_NO}</p>
                            <p></p>
                        </div>
                        <div className="d-flex flex-row justify-content-between providerInfoBottmDivs">
                            <p><FontAwesomeIcon style={{marginRight:'10px'}} size='lg' color={"#F46C23"} icon={faWarehouse}/>{props.providerInfo.ORDER_QUEUE_SIZE - props.providerInfo.CURRENT_QUEUE_SIZE}</p>
                            <p style={{marginLeft:'5px'}} >Order(s) in queue</p>
                        </div>

                        <div className="d-flex flex-row justify-content-between providerInfoBottmDivs">
                            <Button id="refreshButton" onClick={refreshPage}>Refresh</Button>
                        </div>
                    </div>
                </div>
            </Container>
        }</>
    );
}

export default ProviderInformation;