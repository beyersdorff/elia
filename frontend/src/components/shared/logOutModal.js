import Modal from 'react-bootstrap/Modal';

const LogOutModal = (props) => {

    return (
        <Modal show={props.show} centered onHide={() => props.setModalShow(false)}>
            <Modal.Header closeButton>
            <Modal.Title>
                <h4 className="mb-0">Logged Out</h4>
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>You successfully logged out</Modal.Body>
        </Modal>
    )
}

export default LogOutModal
