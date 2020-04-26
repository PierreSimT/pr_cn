import React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface Props {
    show: boolean;
    handleClose: () => void;
    title: string;
    message: string;
}

const ModalResult = (props: Props) => {
    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Upload result:</h3> <p>{props.message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModalResult
