import React from 'react'
import { Form } from 'react-bootstrap'

interface Props {
    label: string;
}

const NumberInput = (props: Props) => {
    return (
        <div>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control type="number" placeholder="0" step={0.01} required/>
        </div>
    )
}

export default NumberInput
