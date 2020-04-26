import React, { FormEvent } from 'react'

import { Form, Button, Container, Col, Modal } from 'react-bootstrap';
import ParameterForm from './ParameterForm/ParameterForm';
import FileInput from '../Inputs/FileInput';
import { Parameter } from '../common';
import TextInput from '../Inputs/TextInput';

import { RouteComponentProps, useNavigate } from "@reach/router";

import axios from 'axios';
import ModalResult from '../Modal/ModalResult';

type Props = {

}

const AlgorithmForm: React.FC<RouteComponentProps> = props => {

    const navigate = useNavigate();
    const [numParameters, setNumParameters] = React.useState(0);
    const [selectedParameters, setSelectedParameters] = React.useState<Parameter[]>([]);
    const [serviceName, setServiceName] = React.useState<string>('');
    const [makefile, setMakefile] = React.useState<any>();
    const [sourceFile, setSourceFile] = React.useState<any>();

    const [show, setShow] = React.useState<boolean>(false);
    const [responseData, setResponse] = React.useState<string>('');

    let parameterForms: JSX.Element[] = [];
    let modal_result: JSX.Element = <div></div>;

    const handleClick = () => {
        const newNumParameters = numParameters + 1;
        const newSelectedParameters = [...selectedParameters];

        let param: Parameter = {
            name: '',
            type: 'Text'
        }

        newSelectedParameters.push(param);

        setSelectedParameters(newSelectedParameters);
        setNumParameters(newNumParameters);
    }

    const handleServiceName = (event: any) => {
        //console.log(event.value);
        const newServiceName = event.value;
        setServiceName(newServiceName);
    }

    const handleTextChange = (event: any) => {
        //console.log(event.value);
        const newSelectedParameters = [...selectedParameters];

        const changedId = +event.id.split('-')[1];
        newSelectedParameters[changedId].name = event.value;

        setSelectedParameters(newSelectedParameters);
    }

    const handleParameterChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const newSelectedParameters = [...selectedParameters];

        // console.log(event.currentTarget.value);
        // console.log(event.currentTarget.id);

        const changedId = +event.currentTarget.id.split('-')[1];
        newSelectedParameters[changedId].type = event.currentTarget.value;

        setSelectedParameters(newSelectedParameters);
    }

    const handleFileChange = (event: EventTarget & HTMLInputElement) => {
        console.log(event);

        const file: File = event.files![0];

        switch (event.id) {
            case 'makefile':
                setMakefile(file);
                break;
            case 'source':
                setSourceFile(file);
                break;
        }

    }

    const handleClose = () => {
        navigate('/', { replace: true });
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event.target);
        console.log(serviceName);
        console.log(selectedParameters);
        console.log(makefile);
        console.log(sourceFile);

        let paramString: string[] = selectedParameters.map((value: Parameter) => {
            return value.name + ',' + value.type;
        })

        console.log(paramString)


        // CREA EL SERVICIO
        axios.put('http://localhost:4000/api/put/service/' + serviceName, null,
            {
                params: {
                    parameters: paramString
                }
            }).then(res => {
                // SUBE EL MAKEFILE
                axios.put('http://localhost:4000/api/put/service/' + serviceName + '/makefile', makefile,
                    {
                        headers: {
                            'Content-Type': makefile.type
                        }
                    }).then(res => {
                        // SUBE EL ARCHIVO FUENTE
                        axios.put('http://localhost:4000/api/put/service/' + serviceName + '/source/' + sourceFile.name, sourceFile,
                            {
                                headers: {
                                    'Content-Type': sourceFile.type
                                }
                            }).then(res => {
                                // COMPILA EL SERVICIO
                                axios.post('http://localhost:4000/api/post/compile/' + serviceName).then(res => {
                                    console.log(res);
                                    setResponse(res.data.Result)
                                    setShow(true);
                                })
                            })

                    })
            })
    }

    for (var i: number = 0; i < numParameters; i++) {
        parameterForms.push(
            <ParameterForm key={i} id={i}
                handleTextChange={handleTextChange}
                handleValueChange={handleParameterChange}
                selectedValue={selectedParameters[i].type}
            />
        );
    }

    modal_result = (
        <ModalResult title="Upload Complete" message={responseData} handleClose={handleClose} show={show} />
    );

    return (
        <>
            {modal_result}

            < Container >

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formServiceName">
                        <TextInput label="Service Name" handleTextChange={handleServiceName} />
                    </Form.Group>

                    <Form.Row>
                        <Col>
                            <FileInput id="makefile" handleChange={handleFileChange} label="Makefile" />
                        </Col>
                        <Col>
                            <FileInput id="source" handleChange={handleFileChange} label="Source" />
                        </Col>
                    </Form.Row>
                    <br />

                    {parameterForms}

                    <Button variant="outline-secondary" onClick={handleClick}>Add Parameter</Button>
                    <br />
                    <br />
                    <Button variant="primary" type="submit">
                        Submit
                </Button>
                </Form>
            </Container >
        </>
    )
}

export default AlgorithmForm
