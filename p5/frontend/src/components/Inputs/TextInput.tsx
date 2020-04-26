import React from 'react'
import { Form } from 'react-bootstrap'

type Props = {
    id?: string;
    label: string;
    handleTextChange: (event: EventTarget & Element) => void
}

const TextInput = (props: Props) => {
    return (
        <div>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control id={props.id} onChange={(event: React.FormEvent) => props.handleTextChange(event.currentTarget)} type="text" placeholder="Name" required/>
        </div>
    )
}

export default TextInput
