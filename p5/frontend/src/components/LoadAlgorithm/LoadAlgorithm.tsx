import React from 'react'
import { Algorithm } from '../common'
import { Container, Form, Button, Col } from 'react-bootstrap'
import FileInput from '../Inputs/FileInput'
import TextInput from '../Inputs/TextInput'
import NumberInput from '../Inputs/NumberInput'

const sample_response: Algorithm = {
    name: 'Test',
    parameters: [
        {
            name: 'param1',
            type: 'text'
        },
        {
            name: 'param2',
            type: 'file'
        },
        {
            name: 'param3',
            type: 'number'
        }
    ],
    results: []
}

interface Props {

}

const LoadAlgorithm = (props: Props) => {

    const handleTextChange = (event: EventTarget & Element) => {
        console.log(event);
    }

    const handleFileChange = (event: EventTarget & HTMLInputElement) => {
        console.log(event);
    }
    
    let parameterInputs: JSX.Element[] = [];

    for (var i: number = 0; i < sample_response.parameters.length; i++) {
        const param = sample_response.parameters[i];
        var input: JSX.Element;

        switch (param.type) {
            case 'file':
                input = (
                    <Col key={'col'+i}>
                        <FileInput id="file" key={i} handleChange={handleFileChange} label={param.name} />
                    </Col>
                );
                break;
            case 'text':
                input = (
                    <Col key={'col'+i}>
                        <TextInput key={i} 
                        label={param.name} 
                        handleTextChange={handleTextChange}
                        />
                    </Col>
                );
                break;
            case 'number':
                input = (
                    <Col key={'col'+i}>
                        <NumberInput key={i} label={param.name} />
                    </Col>
                );
                break;
            default:
                input = <div></div>;
        }

        parameterInputs.push(input);
    }

    return (
        <div>
            <Container>
                <Form>
                    <Form.Group controlId="formAlgorithmName">
                        <Form.Label>Algorithm Name</Form.Label>
                        <Form.Control type="text" value={sample_response.name} readOnly={true} />
                    </Form.Group>

                    <Form.Row>
                        {parameterInputs}
                    </Form.Row>

                    <br></br>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default LoadAlgorithm
