import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../css/MsgModal.css';
import { useNavigate } from 'react-router-dom';

const MsgModal = (props) => {
  const text = props.hideBtn ? "Ok" : "Close";
  console.log('msg',props)
  let navigate = useNavigate();
  return (
    <Modal
      {...props}
      size="medium"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <h4 className="errorMsg">{props.iserror ? "Ooops!" : "Congratulations"}</h4>    
        <p>
         {props.msg}
        </p>
      </Modal.Body>
      <Modal.Footer>
          {props.callBy === 1 && <Button className="modalButton" onClick={() => navigate("/homefeed")}>{text}</Button>}
          {props.callBy === 0 &&
            <div>
              <Button className="modalButton" onClick={props.onHide}>Close</Button>
              <Button style={{marginLeft:"3px"}} className="modalButton" onClick={props.refreshCart}>Ok</Button>
            </div>
          }
          { props.callBy === 2 && 
            <Button className="modalButton" onClick={props.onHide}>Close</Button>
          }
      </Modal.Footer>
    </Modal>
  );
}

export default MsgModal;