import React, { useState, useEffect } from 'react'
import ServiceList from './components/Services/ServiceList'

import axios from 'axios'
import { Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Button, FormControl, InputLabel, OutlinedInput, DialogContentText, FormHelperText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'


const RunServiceView = () => {

    const classes = useStyles();
    const [loadedList, setLoadedList] = useState(false);
    const [services, setServices] = useState()
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedService, setSelectedService] = useState();

    // STATE FOR PARAMETERS AND HANDLE SUBMIT
    const [parametersInput, setParametersInput] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [resultResponse, setResultResponse] = useState();

    useEffect(() => {
        axios.get(`/api/get/service/all`)
            .then(res => {
                //console.log(res);
                setServices(res.data);
                setLoadedList(true);
            })
    }, [])

    var result_dialog = (
        <Dialog
            open={showResult}
            onClose={() => setShowResult(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Result of Execution</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {showResult ? resultResponse.result.console : ''}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {showResult && resultResponse.result.file ?
                    <Button variant="contained" onClick={() => window.open(`/api/get/${selectedService.name}/result/${resultResponse.result.file}`)}>
                        Result File
                    </Button>
                    : <div></div>}
                <Button variant="contained" onClick={() => setShowResult(false)} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>)

    const onServiceSelect = (service) => {
        console.log(service)
        setParametersInput(service.parameters);
        setSelectedService(service);
        setOpenDialog(true);
    }

    const handleTextChange = (event) => {
        console.log(event.target)
        var newSampleInputs = [...parametersInput];

        for (var i = 0; i < newSampleInputs.length; i++) {
            if (event.target.id === newSampleInputs[i].name) {
                newSampleInputs[i].value = event.target.value;
            }
        }

        console.log(newSampleInputs);

        setParametersInput(newSampleInputs);
    }

    const handleFileChange = (event) => {

        var newSampleInputs = [...parametersInput];

        for (var i = 0; i < newSampleInputs.length; i++) {
            if (event.target.id === newSampleInputs[i].name) {
                newSampleInputs[i].value = event.target.files[0];
            }
        }

        console.log(newSampleInputs);
        setParametersInput(newSampleInputs);
    }


    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(event.target.elements);

        var bodyFormData = new FormData();

        for (var i = 0; i < parametersInput.length; i++) {
            if (parametersInput[i].type.toLowerCase() === 'file') {
                bodyFormData.append(parametersInput[i].name, parametersInput[i].value);
            } else {
                bodyFormData.set(parametersInput[i].name, parametersInput[i].value);
            }
        }

        console.log(bodyFormData);

        axios.post(`/api/post/${selectedService.name}`, bodyFormData).then((res) => {
            // setResult(res.data);
            // setShowResult(true);
            console.log(res.data);
            setResultResponse(res.data);
            setOpenDialog(false);
            setShowResult(true);
        }, err => {
            // setErrorMessage(err.data);
            // setShowError(true);
            setOpenDialog(false);
            alert(err.data.Error);
        });

    }

    return (
        <React.Fragment>
            <Container className={classes.heroContent}>
                {loadedList ? <ServiceList services={services} onServiceSelect={onServiceSelect} /> : <div></div>}
            </Container>
            {result_dialog}
            {openDialog ? (<Dialog open={openDialog} onClose={() => setOpenDialog(false)} >
                <DialogTitle>Run {selectedService.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{selectedService.description}</DialogContentText>
                    <form method="post" autoComplete="off" onSubmit={handleSubmit}>
                        <Grid container direction="column" justify="center" spacing={2}>
                            {
                                selectedService.parameters.map((param, idx) => {
                                    return (param.type.toLowerCase() == "file" ?
                                        <Grid item xs={12}>
                                            <Button
                                                key={idx}
                                                variant="contained"
                                                component="label"
                                                fullWidth
                                            >
                                                Upload {param.name}
                                                <input
                                                    type="file"
                                                    id={param.name}
                                                    style={{ display: "none" }}
                                                    onChange={handleFileChange}
                                                    required
                                                />
                                            </Button>
                                        </Grid> :
                                        <Grid item xs={12}>
                                            <FormControl key={idx} variant="outlined" fullWidth={true}>
                                                <InputLabel htmlFor={param.name}>{param.name}</InputLabel>
                                                <OutlinedInput
                                                    id={param.name}
                                                    label={param.name}
                                                    aria-describedby="component-error-text"
                                                    type={param.type.toLowerCase()}
                                                    onChange={handleTextChange} />
                                            </FormControl>
                                        </Grid>
                                    )
                                })
                            }
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Run
                        </Button>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>) : <div></div>}
        </React.Fragment>
    )
}

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    }
}));

export default RunServiceView
