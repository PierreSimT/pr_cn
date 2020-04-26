import React from 'react'
import { Form } from 'react-bootstrap'

interface Props {
    id?: string;
    label: string;
    handleNumberChange: (event: EventTarget & Element) => void;
}

const NumberInput = (props: Props) => {
    return (
        <div>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control id={props.id} onChange={(event: React.FormEvent) => props.handleNumberChange(event.currentTarget)} type="number" placeholder="0" step={0.01} required/>
        </div>
    )
}

export default NumberInput
