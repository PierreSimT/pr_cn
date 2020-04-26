import React, { useState } from 'react'
import { RouteComponentProps, useNavigate } from "@reach/router"
import { Service, Parameter, Result, BACKEND_URL } from '../common'
import { Container, Form, Button, Col, Image } from 'react-bootstrap'
import FileInput from '../Inputs/FileInput'
import TextInput from '../Inputs/TextInput'
import NumberInput from '../Inputs/NumberInput'

import axios from 'axios';
import ModalResult from '../Modal/ModalResult'
import ModalResultImage from '../Modal/ModalResultImage'

interface ParameterInput {
    name: string,
    type: string,
    value?: string | File,
}

type Props = {
    selectedService: Service
}

const RunServiceForm = (props: Props) => {

    const navigate = useNavigate();

    const [parametersInput, setParametersInput] = useState<ParameterInput[]>(props.selectedService.parameters);
    const [imageFile, setImageFile] = useState<string | null>();
    const [receivedResult, setResult] = useState<Result>();
    const [showResult, setShowResult] = useState<boolean>(false);

    const handleTextChange = (event: any) => {

        var newSampleInputs = [...parametersInput];

        for (var i = 0; i < newSampleInputs.length; i++) {
            if (event.id === newSampleInputs[i].name) {
                newSampleInputs[i].value = event.value;
            }
        }

        setParametersInput(newSampleInputs);
    }

    const handleFileChange = (event: EventTarget & HTMLInputElement) => {

        var newSampleInputs = [...parametersInput];
        var reader = new FileReader();

        reader.onload = (event) => {
            setImageFile(event.target?.result as string);
        }

        for (var i = 0; i < newSampleInputs.length; i++) {
            if (event.id === newSampleInputs[i].name) {
                newSampleInputs[i].value = event.files![0];
                reader.readAsDataURL(event.files![0]);
            }
        }

        setParametersInput(newSampleInputs);
    }

    const handleClose = () => {
        navigate('/', { replace: true });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        console.log(parametersInput);
        var bodyFormData = new FormData();

        for (var i = 0; i < parametersInput.length; i++) {
            if (parametersInput[i].type === 'File') {
                bodyFormData.append(parametersInput[i].name, parametersInput[i].value!);
            } else {
                bodyFormData.set(parametersInput[i].name, parametersInput[i].value!);
            }
        }

        axios.post(`${BACKEND_URL}/post/${props.selectedService.name}`, bodyFormData).then((res) => {
            setResult(res.data);
            setShowResult(true);
        });

    }

    let parameter_elements: JSX.Element[] = [];

    for (var i: number = 0; i < props.selectedService.parameters.length; i++) {
        const param = props.selectedService.parameters[i];
        var input: JSX.Element;

        switch (param.type) {
            case 'File':
                input = (
                    <Col key={'col' + i}>
                        <FileInput id={param.name} key={i} handleChange={handleFileChange} label={param.name} />
                    </Col>
                );
                break;
            case 'Text':
                input = (
                    <Col key={'col' + i}>
                        <TextInput key={i}
                            id={param.name}
                            label={param.name}
                            handleTextChange={handleTextChange}
                        />
                    </Col>
                );
                break;
            case 'Number':
                input = (
                    <Col key={'col' + i}>
                        <NumberInput handleNumberChange={handleTextChange} key={i} id={param.name} label={param.name} />
                    </Col>
                );
                break;
            default:
                input = <div></div>;
        }

        parameter_elements.push(input);
    }

    var modal_result: JSX.Element = (
        <ModalResultImage title="Result"
            message={receivedResult?.result.console as string}
            image={`${BACKEND_URL}/get/${props.selectedService.name}/result/${receivedResult?.result.file}`}
            show={true} handleClose={handleClose} />
    );

    return (
        <div>

            {showResult ? modal_result : <div></div>}

            <Container>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formAlgorithmName">
                        <Form.Label>Algorithm Name</Form.Label>
                        <Form.Control type="text" value={props.selectedService.name} readOnly={true} />
                    </Form.Group>

                    <Image src={imageFile!} />

                    <Form.Row>

                        {parameter_elements}

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

export default RunServiceForm
