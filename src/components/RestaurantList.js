import { useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import '../css/RestaurantList.css';

const RestaurantList = (props) => {
    console.log('props',props)
    const classname = props.applyClass === 0 ? 'restaurantList_Names-y' : 'restaurantList_Names';
    const [restaurantList,setRestaurantList] = useState(props.restaurantsList);
    return (
            <>
            {/* {restaurantList && */}
                <div className="restaurantList">
                    {restaurantList && <h1 style={{fontFamily: 'Open Sans'}} >{props.category}</h1>}
                    {restaurantList && 
                        <div className={classname}>
                        {restaurantList.map((restaurant) => {
                            return (<RestaurantCard restaurant={restaurant} />);
                        })}
                    </div>
                    }
                </div>
            {/* } */}
            </>

    );
}

export default RestaurantList