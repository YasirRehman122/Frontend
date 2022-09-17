import React, { useState, useEffect} from 'react';
import '../css/CreateMenuScreen.css'
import { Card, Button, Dropdown, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const userDetailsSelector = state => state.userDetails;

const ItemAddCard = (props) => {
  console.log('props',props);
    const [disabled, setDisabled] = useState(props.disabled);
    const [create, setCreate] = useState(props.create);
    const userDetails = useSelector(userDetailsSelector);
    console.log('user',userDetails);
    const [itemByCategories,setItemsByCategories] = useState(null);
    const [postImage, setPostImage] = useState({
        myFile: "",
      });
    let iName = props.item ? props.item.ITEM_NAME : null
    const [itemName, setItemName] = useState(iName);
    const [selectedItemId,setSelectedItemId]= useState(null);

    const [itemDescription,setItemDesc]=useState(null);
    const [price,setPrice]=useState(null);
    const [ingredients,setIngredients]=useState(null);
    const [essentialIng,setEssIng]=useState(null);
    const [smShow, setSmShow] = useState(false);
    
    async function getItemsByCategories(){
      const url = `${process.env.REACT_APP_PROVIDER_SERVICE}category/items`;
      console.log('cat Id before making payload', props.catId);
      const requestOptions={
          method:'POST',
          headers: {
          "Content-Type":'application/json'
          },
          body:JSON.stringify({id:props.catId})
      };

      await fetch(url,requestOptions)
      .then((response) => {
          if(response.status !== 200){
          throw Error(response.statusText)
          }
          return response.json()
      })
      .then((data) => {
          setItemsByCategories(data.data);         
      })
      .catch((error)=>console.log('error in getting items by categories',error))
    }

    const handleItemId= (item)=>{
      setSelectedItemId(item.ID);
      setItemName(item.NAME)

    }
    const handleItemDesc =(e) => {
       setItemDesc(e.target.value);
    }
    const handlePrice =(e) => {
      setPrice(e.target.value);
    }
    const handleIngredients =(e) => {
      setEssIng(e.target.value);
    }
    const handleOptionalIng =(e) => {
      setIngredients(e.target.value);
      console.log(essentialIng.split(','))
    }

    async function addIngredients(data){
      console.log('data ing',data)
      const url = `${process.env.REACT_APP_PROVIDER_SERVICE}restaurant/menu/addIngredients`;
      let payload ={
        "providerID":data.PROVIDER_ID,
        "itemID":data.ID
      }
      if(essentialIng){payload["ingredients"]=essentialIng.split(',')}
      if(ingredients){payload["optionalIngredients"]=ingredients.split(',')}
      
      const requestOptions={
        method:'POST',
        headers: {
          "Content-Type":'application/json'
        },
        body:JSON.stringify(payload)
      };
      if(ingredients || essentialIng){
      await fetch(url,requestOptions)
      .then((response) => {
        if(!response.status === 200){
          throw Error('Something went wrong in ingredients service')
        }
        setSmShow(true);
        return response.data;
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    }}

    async function createMenuCall(createMenuPayload){
      const url = `${process.env.REACT_APP_PROVIDER_SERVICE}/restaurant/createMenu`;
      const requestOptions={
        method:'POST',
        headers: {
          "Content-Type":'application/json'
        },
        body:JSON.stringify(createMenuPayload)
      };

      await fetch(url,requestOptions)
      .then((response) => {
        if(response.status !== 201){
          throw Error('Something went wrong')
        }
        return response.json()
      })
      .then((data) => {
        console.log('data',data.data)        
        addIngredients(data.data[0],ingredients,essentialIng);
      })
    }

    async function updateMenu(createMenuPayload){
      const url = `${process.env.REACT_APP_PROVIDER_SERVICE}restaurant/updateMenu`;
      const requestOptions={
        method:'POST',
        headers: {
          "Content-Type":'application/json'
        },
        body:JSON.stringify(createMenuPayload)
      };

      await fetch(url,requestOptions)
      .then((response) => {
        if(response.status !== 201){
          throw Error('Something went wrong')
        }
        return response.json()
      })
      .then((data) => {
        console.log('data',data.data)        
        addIngredients(data.data,ingredients,essentialIng);
      })
    }
    const saveData = () => {
      const createMenuPayload = [{
        'providerID': userDetails.ID,
        'itemID':selectedItemId  ,
        'price':price ,
        'description':itemDescription ,
        'image':postImage.myFile
      }]
      createMenuCall(createMenuPayload);
    }

    const updateData = () => {
      const updateMenuPayload = {
        'providerID': userDetails.ID,
        'itemID':selectedItemId ? selectedItemId :props.item.ID ,
        'price':price ?  price :props.item.PRICE,
        'description':itemDescription ? itemDescription :props.item.ID ,
        'image':postImage.myFile
      }
      updateMenu(updateMenuPayload);
    }
    //Copied as this is standard way of uploading image and converting to base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };
      const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setPostImage({ ...postImage, myFile: base64 });
      };

      useEffect(() => {
        // console.log('post image',selectedItemId);
      },[postImage,selectedItemId])
    return (
      <>
        <Card className="cardContainer">
            <div className='d-flex flex-row align-items-center justify-content-between mt-1 mb-3'>
                <Card.Subtitle className="itemName">
                    Item Name: 
                    <Dropdown className="mb-3 itemNameInput" onClick={getItemsByCategories}>
                      <Dropdown.Toggle id="dropdown-basic" className='itemDropDown'>
                      {itemName ? itemName : 'Click to select an item'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          {itemByCategories && itemByCategories.map((item) => 
                              {
                                return (
                              <Dropdown.Item 
                                disabled={disabled} 
                                onClick={(e)=>{handleItemId(item)}}
                                >
                                  {item.NAME}
                              </Dropdown.Item>
                            )}
                          )}
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* <input type="text" className='itemNameInput' defaultValue={props.item ? props.item.ITEM_NAME : ''} disabled={disabled} onChange={handleItemName}/> */}
                </Card.Subtitle>
                <Card.Text className="itemDescription">
                    Description: 
                    <input type="text" className='itemDescriptionInput' defaultValue={props.item ? props.item.DESCRIPTION : ''} disabled={disabled} onChange={handleItemDesc}/>
                </Card.Text>
                <Card.Text className="itemPrice">
                    Price: 
                    <input type="number" defaultValue={props.item ? props.item.PRICE : 0} className="cartItemPrice" disabled={disabled} onChange={handlePrice}/>
                </Card.Text>
            </div>
            <Card.Text className="ingredients mb-3">
                Essential Ingredients: <input className="ingrInput" type="text" defaultValue={props.item ? props.item.INGREDIENTS :'Enter comma separated values'} onChange={handleIngredients} disabled={disabled}/>
            </Card.Text>
            <Card.Text className="ingredients mb-3">
                Optional Ingredients: <input  className="ingrInput" type="text" defaultValue={props.item ? props.item.OPTIONAL_INGREDIENTS :'Enter comma separated values'} disabled={disabled} onChange={handleOptionalIng}/>
            </Card.Text>
            <input
                type="file"
                label="Image"
                name="myFile"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => handleFileUpload(e)}
            />
            <Card.Footer>
            {disabled  && <Button className="cardEditItemBtn" onClick={() => setDisabled(false)}>Edit</Button>}
            {!disabled &&  create && <Button className="cardEditItemBtn" onClick={saveData}>Create</Button>}
            {!disabled && !create && <Button className="cardEditItemBtn" onClick={updateData}>Update</Button>}

            </Card.Footer>
        </Card>
         <Modal
         size="sm"
         show={smShow}
         onHide={() => setSmShow(false)}
         aria-labelledby="example-modal-sizes-title-sm"
       >
         <Modal.Header closeButton>
           <Modal.Title id="example-modal-sizes-title-sm">
             
           </Modal.Title>
         </Modal.Header>
         <Modal.Body>Item added successfully</Modal.Body>
         <Modal.Footer>
          <Button onClick={()=>{
            setDisabled(true);
            setSmShow(false);
          }}>Ok</Button>
         </Modal.Footer>
       </Modal>
       </>
    )
}

export default ItemAddCard;