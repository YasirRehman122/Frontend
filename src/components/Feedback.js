import {Button,Row,Form,Container} from "react-bootstrap";
import '../css/Feedback.css';
import React, {useEffect} from 'react';

function Feedback(props) {
    console.log('props',props);
    let array = props.feedbacks.map((item)=>{
        return {itemID:item.ITEM_ID,rating:'',review:'',orderID:item.ORDER_ID,providerID:item.PROVIDER_ID,userID:item.USER_ID}
    })
    let inputFields = array;
    console.log('array',inputFields);

    const handleNullRatingChange =(e) => {
        console.log('id',e.target.id);
        inputFields.forEach((field)=>{
            if(!field.itemID && e.target.id == 0){
                field.rating = e.target.value
            }
        })
        console.log('input fields',inputFields);
    }

    const handleNullReviewChange =(e) => {
        inputFields.forEach((field)=>{
            if(!field.itemID){
                field.review = e.target.value
            }
        })
        console.log('input fields',inputFields)
    }
    const handleRatingChange = (e) => {
        console.log("III", e.target.value);
        console.log("III", e.target.id);
        inputFields.forEach((field)=>{
            if(field.itemID == e.target.id){
                field.rating = e.target.value
            }
        })
        console.log('input fields',inputFields)
    };

    const handleReviewChange = (e) => {

        console.log("III", e.target.value);
        console.log("III", e.target.id);
        inputFields.forEach((field)=>{
            if(field.itemID == e.target.id){
                field.review = e.target.value
            }
        })
        console.log('input fields',inputFields)
    };

    async function saveFeedback(){
        const url=`${process.env.REACT_APP_PROVIDER_SERVICE}savePendingFeedbackAgain`;
        const requestOptions = {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(inputFields)
        }
        await fetch(url,requestOptions)
        .then(()=>props.onHide())
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        saveFeedback();
    }
    useEffect(()=>{
        console.log('values',inputFields)
    },[inputFields])

  return (
    <div>
        <Container id='feedback-main-container'>
            <Form className="d-flex flex-column w-100" onSubmit={e => handleSubmit(e)}>
            
                <div className="d-flex cardTitle" >
                    {
                        <Container id='delivery-details-feedback'>
                            {
                                props.feedbacks && props.feedbacks.map((item) => (
                                    !item.ITEM_ID && 
                                    <Container id='delivery-address-container'>
                                        <Row id='delivery-row'>
                                            <b>Overall Experience</b>
                                        </Row>
                                        <Row id='overallRatings'>
                                                {['radio'].map((type) => (

                                                    <div key={`inline-${type}`} className="mb-2">
                                                        <Form.Check inline label="1" value="1" name="overall" type={type} id={0} onChange={handleNullRatingChange}/>
                                                        <Form.Check inline label="2" value="2" name="overall" type={type} id={0} onChange={handleNullRatingChange}/>
                                                        <Form.Check inline label="3" value="3" name="overall" type={type} id={0} onChange={handleNullRatingChange}/>
                                                        <Form.Check inline label="4" value="4" name="overall" type={type} id={0} onChange={handleNullRatingChange}/>
                                                        <Form.Check inline label="5" value='5' name="overall" type={type} id={0} onChange={handleNullRatingChange}/>
                                                    </div>
                                                ))}
                                            </Row>
                                        <Row>
                                            <b>Description</b>
                                        </Row>
                                        <Form.Control size="lg" type="text" name="overall" placeholder="description" onChange={handleNullReviewChange}/>
                                    </Container>
                            ))}
                            <div id='divider' style={{background: '#f46c23',height: '1px',}}/>
                            {
                                props.feedbacks && props.feedbacks.map((item) => (
                                item.ITEM_ID && 
                                <Container className="">
                                    <Row id='delivery-row' >
                                        <Row><b>{item.ITEM_NAME}</b></Row>
                                        <Row>
                                        <Row>
                                            <Form>
                                                {['radio'].map((type) => (
                                                    <div key={`inline-${type}`} className="mb-2">
                                                        <Form.Check inline label="1" value="1" name={item.ITEM_NAME} type={type} id={item.ITEM_ID} onChange={handleRatingChange}/>
                                                        <Form.Check inline label="2" value="2" name={item.ITEM_NAME} type={type} id={item.ITEM_ID} onChange={handleRatingChange}/>
                                                        <Form.Check inline label="3" value="3" name={item.ITEM_NAME} type={type} id={item.ITEM_ID} onChange={handleRatingChange}/>
                                                        <Form.Check inline label="4" value="4" name={item.ITEM_NAME} type={type} id={item.ITEM_ID} onChange={handleRatingChange} />
                                                        <Form.Check inline label="5" value="5" name={item.ITEM_NAME} type={type} id={item.ITEM_ID} onChange={handleRatingChange}/>
                                                    </div>
                                                ))}
                                            </Form>
                                        </Row>   
                                        </Row>          
                                    </Row>
                                    <Form.Control size="sm" type="text" id={item.ITEM_ID} name={item.ITEM_NAME} placeholder="description" onChange={handleReviewChange}/>
                                </Container> 
                                ))
                            }
                        </Container>        
                    }
                </div>
                <Button className="col-md-12 text-center" id='feedback-submit-button' type="submit" onClick={e => handleSubmit(e)} >
                    <b>Submit</b>
                </Button>
            </Form>
        </Container>
    </div>
    
  );
}

export default Feedback;