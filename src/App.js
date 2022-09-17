import './App.css';
import LoginForm from './components/LoginForm';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './components/Homepage';
import HomeFeed from './components/Homefeed';
import RestaurantFeed from './components/RestaurantFeed';
import CategorySpecificView from './components/CategorySpecificView';
import ProviderHome from './components/ProviderHome';
import Checkout from './components/Checkout';
import CustomerRegistrationForm from './components/CustomerResgistrationForm';
import ProviderRegistrationForm from './components/ProviderRegistrationForm';
import CreateMenuScreen from './components/CreateMenuScreen';
import Feedback from './components/Feedback';
import ViewMyOrders from './components/ViewMyOrders';

function App() {

  return (
    <div className='h-100 w-100'>
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginForm/>}/>
          <Route exact path="/registration" element={<CustomerRegistrationForm/>}/>
          <Route exact path="/homepage" element={<Homepage/>}/>
          <Route exact path="/homefeed" element={<HomeFeed/>}/>
          <Route exact path="/restaurant/:restaurantName/" element={<RestaurantFeed/>}/>
          <Route exact path="/restaurantByCategory/:name/:categoryId" element={<CategorySpecificView/>}/>
          <Route exact path="/checkout" element={<Checkout/>}/>
          <Route exact path="/provider-registration" element={<ProviderRegistrationForm/>}/>
          <Route exact path="/providerFeed" element={<ProviderHome/>}/>
          <Route exact path="/my-menu" element={<CreateMenuScreen/>}/>
          <Route exact path="/feedback" element={<Feedback/>}/>
          <Route exact path="/my-orders" element={<ViewMyOrders/>}/>
        </Routes>
      </Router>

    </div>
    
  );
}

export default App;
