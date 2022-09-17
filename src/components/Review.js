import React from 'react';
import {Container, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar} from '@fortawesome/free-solid-svg-icons'
import '../css/Review.css'

const Review = (props) => {
    console.log('props review',props)
    return(
        <Container>
            <Card className="review">
                <Container className="d-flex justify-content-between align-items-center reviewContainer ">
                    <Card.Title className='reviewTitle'>{props.review.USER.FIRST_NAME+' '+props.review.USER.LAST_NAME} </Card.Title>
                    <p style={{marginLeft: '2px'}}>
                        <FontAwesomeIcon icon={faStar} color="#F46C23" size='sm'/>
                        {props.review.RATING}
                    </p>
                </Container>
                <Card.Body className='reviewBody'>{props.review.REVIEW}</Card.Body>
            </Card>
        </Container>
    );
}

export default Review;