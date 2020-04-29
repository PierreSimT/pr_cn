import React from 'react'
import { Alert } from 'react-bootstrap'

interface Props {
    handleClose: () => void;
    message: string;
}

const FormError = (props: Props) => {
    return (
        <div>
            <Alert variant="danger" onClose={props.handleClose} dismissible>
                <p>{props.message}</p>
            </Alert>
        </div>
    )
}

export default FormError
