import React, { useState, useEffect} from 'react';
import '../css/CreateMenuScreen.css'
import {NavDropdown, Dropdown, ListGroup, ListGroupItem, Container, Nav, Navbar, Button, Card} from 'react-bootstrap';
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from '@fortawesome/free-solid-svg-icons';
import ItemAddCard from './ItemAddCard';
import { useNavigate } from 'react-router-dom';

const userDetailsSelector = state => state.userDetails;

function CreateMenuScreen(props) {

    const [data,setData] = useState(null); //contains menu
    // const [show, setShow] = useState(false);
    // const [isError, setIsError] = useState(true);
    const userDetails = useSelector(userDetailsSelector);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const [categoriesList,setCategoriesList] = useState(null); //all categories of system
    const [addCategoriesList, setAddCategoriesList] = useState(null); //dropdown category list
    const [itemsToDisplay,setItemsToDisplay] = useState(null);
    const [catToAdd,setCatToAdd] = useState(null);
    const [displayAddItemCard, setDisplayAddItemCard] = useState(false);
    const [displayAddBtn, setDisplayAddBtn] = useState(true);
    let navigate = useNavigate();
    const [catId,setCatId] = useState(null);
    const addOneMoreItem = (e) => {
        console.log('form data',e);
    }

    const displayItemsOfCategory =(e) => {
        setCatId(categoriesList.filter((cat) => cat.NAME === e.target.innerHTML)[0].ID);
        let key = Object.keys(data);
        if(key.includes(e.target.innerHTML)){
            let itemDetails = {categoryName: e.target.innerHTML,items: data[e.target.innerHTML]};
            setItemsToDisplay(itemDetails);
        }else{
            setItemsToDisplay({categoryName:e.target.innerHTML, items: []});
        }
    }

    const addCategoryToList =(e) => {
        let temp = addCategoriesList.filter((cat) => cat.NAME === e.target.innerHTML);
        setCatToAdd(temp[0]);
        setAddCategoriesList(addCategoriesList.filter((cat) => cat.NAME !== e.target.innerHTML));
        
    }

    const displayAddItemCardFunc = () =>{
        setDisplayAddItemCard(true);
    }

    useEffect(() => {
        async function fetchMenu() {
          const url =`${process.env.REACT_APP_PROVIDER_SERVICE}getRestaurantMenu`;
    
          await fetch(url,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({providerID:userDetails.ID})
          })
          .then((response) => response.json())
          .then((data) => {
            setData(data.data);
          })
          .catch((error) => console.log('error in get restaurant menu error'));
        }

        async function fetchCategories() {
            const url =`${process.env.REACT_APP_PROVIDER_SERVICE}category`;
  
            await fetch(url,{
              method: 'GET',
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then((response) => response.json())
            .then((data) => setCategoriesList(data.data))
            .catch((error) => console.log(error));
          }

        fetchCategories();
        fetchMenu();
      },[])
    
      useEffect(()=>{
        if(categoriesList !== null && data !== null ){
            setAddCategoriesList(categoriesList.filter((category) =>{
                if(!Object.keys(data).includes(category.NAME)){
                    return category;
                }
                }));
        }
      },[data,categoriesList]);

    //   useEffect(() => {
        
    //   },[catId])
    
   
  
  return (
    <div>
        <Navbar sticky="top" bg="primary" variant="dark" className="navbarClass w-100 justify-content-between">
            <Container className="w-100 p-0">
                <Navbar.Brand>takeaway menu system</Navbar.Brand>
                <Nav className="justify-content-end">
                <Nav.Link onClick={()=>navigate("/providerFeed")}>Home</Nav.Link>
                <NavDropdown title={userDetails.FIRST_NAME} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/">Logout</NavDropdown.Item>
                </NavDropdown>
                    {/* <Nav.Link href="#pricing">jumbo</Nav.Link> */}
                </Nav>
            </Container>
          </Navbar>
        <Container id='menuScreenMainContainer' className="d-flex flex-row">
            <Card id="categoryContainer">
                <div id='menuCatHeading'>
                    <h3 >Menu Categories</h3>
                </div>
                <hr/>
                <Dropdown style={{paddingLeft:'50px'}} className="mb-3">
                    <Dropdown.Toggle id="dropdown-basic" className='catDropDown'>
                        Click to add new category
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {addCategoriesList && addCategoriesList.map((category) => 
                            {return <Dropdown.Item value={category.NAME}  onClick={addCategoryToList}>{category.NAME}</Dropdown.Item>}
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                
                <ListGroup style={{border:'none'}} >
                    {data && Object.keys(data).map((category) => 
                    {
                        return <ListGroupItem className="catItem" onClick={displayItemsOfCategory}>{category}</ListGroupItem>
                    })}
                    {catToAdd && <ListGroupItem className="catItem" onClick={displayItemsOfCategory}>{catToAdd.NAME}</ListGroupItem>}
                </ListGroup>

                
            </Card>
            <Card id="itemContainer">
                <div id="itemHeadingContainer" className='d-flex flex-row fixed-top justify-content-between mb-3'>
                    <h3 id="itemHeading" className='fixed-top'>{itemsToDisplay ? itemsToDisplay.categoryName : 'Select a category'}</h3>
                    <div>
                    {/* <Button id="addItemBtn" onClick={displayAddItemCardFunc} disabled ={displaySaveChangesBtn && itemsToDisplay ? false : true}>Save Changes</Button> */}
                    <Button id="addItemBtn" onClick={displayAddItemCardFunc} disabled ={itemsToDisplay ? false : true}>Add Item</Button>
                    </div>
                </div>
                <div className="overflow-auto">
                    {
                        displayAddItemCard && 
                        <ItemAddCard catId={catId} disabled={false} create={true}/>
                    }
                    {itemsToDisplay && 
                        <div>
                            {itemsToDisplay.items && itemsToDisplay.items.map((item) => {
                                return (
                                    <ItemAddCard catId={catId} item={item} disabled={true} create={false}/>
                                )
                            })}
                        </div>
                    } 
                </div>
                <div>

                </div>
            </Card>
        </Container>
    </div>
  );
}

export default CreateMenuScreen;