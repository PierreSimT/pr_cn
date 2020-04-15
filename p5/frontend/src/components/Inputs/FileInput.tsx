import React from 'react'
import { Form } from 'react-bootstrap'

interface Props {
    id: string;
    label: string;
    handleChange(e: EventTarget & HTMLInputElement): void;
}

const FileInput = (props: Props) => {

    return (
        <div>
            <Form.Label>{props.label}</Form.Label>
            <Form.File id={props.id} onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.handleChange(e.target)} required/>
        </div>
    )
}

export default FileInput
