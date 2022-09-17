import React, { useEffect, useState } from 'react';
import {Container} from 'react-bootstrap';
import Review from '../components/Review';
import '../css/Reviews.css'

const Reviews = (props) => {
    const [reviews,setReviews] = useState([]);
    // console.log('props',props);
    useEffect(() => {
        async function fetchReviews() {
          const url =`${process.env.REACT_APP_PROVIDER_SERVICE}getFeedback`;
    
          let res = await fetch(url,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({providerID: props.item.PROVIDER_ID, itemID: props.item.ID})
          });
    
          let response = await res.json();
          setReviews(response.data);    
        }
        fetchReviews();
      },[]);

      useEffect(()=>{
        // console.log('reviews',reviews);
      },[reviews])
    return (
        <Container className='overflow-auto'>
            <div className='reviewHeadingContainer'>
                <h2 className='reviewHeading fixed-top'>Reviews</h2>
            </div>
            {reviews && reviews.map((review) => <Review review={review}/>)}
        </Container>
    );
}

export default Reviews;