import React from "react";
import '../css/CategoryCard.css'
import { useNavigate } from 'react-router-dom';

const CategoryCard = (props) => {
    
    let navigate = useNavigate();
    const category = props.category;
    console.log('category props',props.category)
    const takeToRestaurant =(e) => {
        navigate(`/restaurantByCategory/${props.category.NAME}/${props.category.ID}`)
    }
    return (
        <>
             <p className='categories' onClick={takeToRestaurant}>{category.NAME}</p>
        </>
    );
} 

export default CategoryCard;