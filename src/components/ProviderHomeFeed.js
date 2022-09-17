import React, { useState } from 'react';
import ProviderInformation from './ProviderInformation';
import OrderDetails from './OrderDetails';
import Orders from './Orders';
import '../css/ProviderHomeFeed.css'

const ProviderHomeFeed = (props) => {
    const [orderInfo, setOrderInfo] = useState(null);
    const handleOrderClick = (orderInfo) => {
        console.log('order info passed by orders', orderInfo);
        setOrderInfo(orderInfo);
    }

    return (
        <div className="providerMainContainer">
           <div className="leftProContainer">
            <ProviderInformation providerInfo={props.providerInfo} refreshActiveOrder2={props.refetchActiveOrder1}/>
            <OrderDetails orderInfo={orderInfo} refetchActiveOrder3={props.refetchActiveOrder1}/>
           </div>
           <div className="rightProContainer">
            <Orders ordersList={props.ordersList} handleOrderClick={handleOrderClick}/>
           </div>
        </div>
    );
}

export default ProviderHomeFeed;