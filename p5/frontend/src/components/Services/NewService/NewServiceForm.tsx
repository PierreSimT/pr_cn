import React from 'react'

import { Form, Button, Container, Col } from 'react-bootstrap';
import ParameterForm from './ParameterForm/ParameterForm';
import FileInput from '../../Inputs/FileInput';
import { Parameter } from '../../common';
import TextInput from '../../Inputs/TextInput';

import { RouteComponentProps, useNavigate } from "@reach/router";

import axios from 'axios';
import ModalResult from '../../Modal/ModalResult';
import FormError from '../FormError';


const NewServiceForm: React.FC<RouteComponentProps> = () => {

    const navigate = useNavigate();
    const [numParameters, setNumParameters] = React.useState(0);
    const [selectedParameters, setSelectedParameters] = React.useState<Parameter[]>([]);
    const [serviceName, setServiceName] = React.useState<string>('');
    const [serviceDescription, setServiceDescription] = React.useState<string>('');
    const [makefile, setMakefile] = React.useState<any>();
    const [sourceFile, setSourceFile] = React.useState<any>();

    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [showError, setShowError] = React.useState<boolean>(false)

    const [show, setShow] = React.useState<boolean>(false);
    const [responseData, setResponse] = React.useState<string>('');

    let parameterForms: JSX.Element[] = [];
    let modal_result: JSX.Element = <div></div>;

    const handleAdd = () => {
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

    const handleDelete = () => {
        if (numParameters !== 0) {
            const newNumParameters = numParameters - 1;
            const newSelectedParameters = [...selectedParameters];

            newSelectedParameters.pop();

            setSelectedParameters(newSelectedParameters);
            setNumParameters(newNumParameters);
        }
    }

    const handleServiceName = (event: any) => {
        const newServiceName = event.value;
        setServiceName(newServiceName);
    }

    const handleDescription = (event: any) => {
        const newDescription = event.value;
        setServiceDescription(newDescription);
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
        // console.log(event);

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
        // console.log(event.target);
        // console.log(serviceName);
        // console.log(selectedParameters);
        // console.log(makefile);
        // console.log(sourceFile);

        let paramString: string[] = selectedParameters.map((value: Parameter) => {
            return value.name + ',' + value.type;
        })

        console.log(paramString)


        // CREA EL SERVICIO
        axios.put('/api/put/service/' + serviceName, null,
            {
                params: {
                    parameters: paramString,
                    description: serviceDescription,
                }
            }).then(() => {
                // SUBE EL MAKEFILE
                axios.put('/api/put/service/' + serviceName + '/makefile', makefile,
                    {
                        headers: {
                            'Content-Type': makefile.type
                        }
                    }).then(() => {
                        // SUBE EL ARCHIVO FUENTE
                        axios.put('/api/put/service/' + serviceName + '/source/' + sourceFile.name, sourceFile,
                            {
                                headers: {
                                    'Content-Type': sourceFile.type
                                }
                            }).then(() => {
                                // COMPILA EL SERVICIO
                                axios.post('/api/post/compile/' + serviceName).then(res => {
                                    console.log(res);
                                    setResponse(res.data.Result)
                                    setShow(true);
                                })
                            })

                    })
            }, err => {
                setErrorMessage(err);
                setShowError(true);
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

    var form_error: JSX.Element = (
        <FormError handleClose={() => setShowError(false)} message={errorMessage} />
    );

    return (
        <>
            {modal_result}

            < Container >
                {showError ? form_error : <div></div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formServiceName">
                        <TextInput label="Service Name" handleTextChange={handleServiceName} />
                    </Form.Group>

                    <Form.Group controlId="formServiceDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={(event: React.FormEvent) => handleDescription(event.currentTarget)} />
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

                    <Button variant="outline-danger" onClick={handleDelete}>Delete Parameter</Button>
                    {" "}
                    <Button variant="outline-success" onClick={handleAdd}>Add Parameter</Button>
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

export default NewServiceForm
