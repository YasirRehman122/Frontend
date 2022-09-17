const initialState = {
    ingredients: {
        providerId: 0,
        ingredients:[]
    },
    location:{},
    restaurant: {},
    deliveryAddress: "",
    userDetails:{},
    cart : {
	}
}

function addToCart(cartItemList,itemToAdd){
    let found = false;
    console.log(cartItemList);
    cartItemList.forEach((item) => {
        console.log(item.menuItemId)
        if(item.menuItemId === itemToAdd.menuItemId){  
            item.quantity = item.quantity + 1;
            found = true;
        }
    });
    if(!found){
        cartItemList.push(itemToAdd);
    }
    return cartItemList;
}

function incrementItemCount(cartItemList,id){
    cartItemList.forEach( (item) => {
        console.log('item menu item id',  id);  
        if(item.menuItemId == id){   
            item.quantity += 1;
        }
    });
    console.log(cartItemList);
    return cartItemList;
}

function decrementItemCounter(cartItemList,id){
    console.log('id',id)
    let remove = false;
    cartItemList.forEach( (item) => { 
        if(item.menuItemId == id){     
            if(item.quantity > 1){
                item.quantity -= 1;
            }else{
                console.log(cartItemList.indexOf(item));
                cartItemList.splice(cartItemList.indexOf(item),1)
            }
        } 
    });
    if(remove){
        cartItemList.filter((item) => item.menuItemId !== id)
    }
    return cartItemList;
}

function removeFromCart(cartItemList,itemToRemove){
    cartItemList.forEach( (item) => {
        if(item.menuItemId === itemToRemove.menuItemId){     
            item.quantity = item.quantity - 1;
    }})
    return cartItemList.filter(item => item.quantity > 0);
}

export default function appReducer(state=initialState, action){
    switch (action.type){
        case 'cart/addToCart':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItemList: addToCart(state.cart.cartItemList,action.payload)
                }
            }
        case 'cart/removeFromCart':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItemList : removeFromCart(state.cart.cartItemList,action.payload)
                }
            }
        case 'cart/incrementItem':
            return{
                ...state,
                cart: {
                    ...state.cart,
                    cartItemList: incrementItemCount(state.cart.cartItemList, action.payload)
                }
            }
        case 'cart/decrementItem':
            return{
                ...state,
                cart: {
                    ...state.cart,
                    cartItemList: decrementItemCounter(state.cart.cartItemList, action.payload)
                }
            }
        case 'cart/removePreviousAddNew':
            return{
                ...state,
                cart: {
                    ...state.cart,
                    providerId: action.payload.providerId,
                    shopName: action.payload.shopName,
                    cartItemList: [action.payload.cartItems]
                }
            }
        case 'cart/updateCart':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    providerId: action.payload.providerId,
                    userId: action.payload.userId,
                    cartId:action.payload.cartId,
                    cartItemList: action.payload.cartItemList
                }
            }
        case 'provider/goToRestaurant':
            return {
                ...state,
                restaurant: action.payload,
            }
        case 'cart/excludeIngredients':
            return {
                ...state,
                ingredients: action.payload
            }
        case 'ims/captureUserDetails':
            return {
                ...state,
                userDetails: action.payload
            }
        case 'setDeliverAddress':
            return {
                ...state,
                deliveryAddress:action.payload
            }
        case 'setLocation':
            return{
                ...state,
                location: action.payload
            }
        
        default:
            return state;
    }
}