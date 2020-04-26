import React from 'react'
import { Modal, Button, Image } from 'react-bootstrap'

interface Props {
    show: boolean;
    handleClose: () => void;
    title: string;
    message: string;
    image: string;
}

const ModalResultImage = (props: Props) => {

    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Result File</h3>
                    <Image src={props.image} fluid />
                    <h3>Result:</h3> <p>{props.message}</p>
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

export default ModalResultImage
