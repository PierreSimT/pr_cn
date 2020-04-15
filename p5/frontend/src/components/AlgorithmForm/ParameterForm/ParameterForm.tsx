import React from 'react'
import { Form, Col } from 'react-bootstrap'
import TextInput from '../../Inputs/TextInput'

type Props = {
    id: number;
    handleValueChange: (event: React.FormEvent<HTMLSelectElement>) => void;
    handleTextChange: (event: EventTarget & Element) => void
    selectedValue: string;
}

const ParameterForm = (props: Props) => {

    return (
        <div>
            <Form.Group controlId={"formControlParam-" + props.id}>
            <Form.Row>
                <Col>
                    <TextInput label="Parameter Name" handleTextChange={props.handleTextChange} />
                </Col>
                <Col>
                    <Form.Label>Parameter Type</Form.Label>
                    <Form.Control onChange={props.handleValueChange} as="select" value={props.selectedValue} required>
                        <option>File</option>
                        <option>Text</option>
                        <option>Number</option>
                    </Form.Control>
                </Col>
            </Form.Row>
            </Form.Group>
        </div>
    )
}

export default ParameterForm
