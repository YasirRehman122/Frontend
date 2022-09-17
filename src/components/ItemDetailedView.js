import React from 'react';
import { Container, Modal} from 'react-bootstrap';
import ItemView from '../components/ItemView';
import '../css/ItemDetailedView.css'
import Reviews from '../components/Reviews';

function ItemDetailedView(props) {

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        fullscreen={true}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Container id="itemDetailedViewContainer" className='d-flex'>
            <ItemView item={props.data}/>
            <Reviews item={props.data}/>
          </Container>
        </Modal.Body>
      </Modal>
    </>
    );
}

export default ItemDetailedView;