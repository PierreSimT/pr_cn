import React from 'react'
import { Button, Grid, makeStyles, FormControl, MenuItem, InputLabel, Input, Select } from '@material-ui/core'
import red from '@material-ui/core/colors/red';
import { jwtToken } from '../../../token';

import axios from 'axios';

const AddService = () => {
    const classes = useStyles();

    const [numParameters, setNumParameters] = React.useState(0);
    const [serviceName, setServiceName] = React.useState('');
    const [serviceDescription, setServiceDescription] = React.useState('');
    const [serviceParameters, setServiceParameters] = React.useState([]);
    const [makefile, setMakefile] = React.useState();
    const [sourcefile, setSourceFile] = React.useState();

    const [uploadValidated, setUploadValidated] = React.useState(false);
    const [uploadError, setUploadError] = React.useState(false);

    let parameterForms = [];

    const handleAdd = () => {
        const newNumParameters = numParameters + 1;
        const newSelectedParameters = [...serviceParameters];

        let param = {
            name: '',
            type: 'text'
        }

        newSelectedParameters.push(param);

        setServiceParameters(newSelectedParameters);
        setNumParameters(newNumParameters);
    }

    const handleDelete = () => {
        if (numParameters !== 0) {
            const newNumParameters = numParameters - 1;
            const newSelectedParameters = [...serviceParameters];

            newSelectedParameters.pop();

            setServiceParameters(newSelectedParameters);
            setNumParameters(newNumParameters);
        }
    }

    const handleServiceName = (event) => {
        const name = event.target.value;
        setServiceName(name);
    }

    const handleServiceDescription = (event) => {
        const description = event.target.value;
        setServiceDescription(description);
    }

    const handleParameters = (event) => {

        const newSelectedParameters = [...serviceParameters];
        const eventType = event.target.name.split('-')[0];
        const changedId = +event.target.name.split('-')[1];

        switch (eventType) {
            case 'param':
                newSelectedParameters[changedId].name = event.target.value;
                break;
            case 'paramselect':
                newSelectedParameters[changedId].type = event.target.value;
                break;
        }

        setServiceParameters(newSelectedParameters);
    }

    const handleFileUpload = (event) => {
        switch (event.target.id) {
            case 'makefile':
                setMakefile(event.target.files[0])
                break;
            case 'sourcefile':
                setSourceFile(event.target.files[0])
                break;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let paramString = serviceParameters.map((value) => {
            return value.name + ',' + value.type;
        })

        // CREA EL SERVICIO
        axios.put('/api/put/service/' + serviceName, null,
            {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                params: {
                    parameters: paramString,
                    description: serviceDescription,
                }
            }).then(() => {
                // SUBE EL MAKEFILE
                axios.put('/api/put/service/' + serviceName + '/makefile', makefile,
                    {
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`,
                            'Content-Type': makefile.type
                        }
                    }).then(() => {
                        // SUBE EL ARCHIVO FUENTE
                        axios.put('/api/put/service/' + serviceName + '/source/' + sourcefile.name, sourcefile,
                            {
                                headers: {
                                    'Authorization': `Bearer ${jwtToken}`,
                                    'Content-Type': sourcefile.type
                                }
                            }).then(() => {
                                // COMPILA EL SERVICIO
                                axios.post('/api/post/compile/' + serviceName, null, {
                                    headers: {
                                        'Authorization': `Bearer ${jwtToken}`
                                    }
                                }).then(res => {
                                    alert(res.data.Result);
                                    setUploadValidated(true);
                                })
                            })

                    })
            }, err => {
                alert(err);
                setUploadError(true);
            })
    }


    for (var i = 0; i < numParameters; i++) {
        parameterForms.push((
            <Grid container spacing={3} justify="space-between">
                <Grid item>
                    <FormControl className={classes.control} fullWidth={true}>
                        <InputLabel htmlFor={`param-${i}`} fullWidth>Parameter</InputLabel>
                        <Input
                            id={`param-${i}`}
                            name={`param-${i}`}
                            type="text"
                            onChange={handleParameters}
                            autoComplete="off"
                            fullWidth={true}
                        />
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl className={classes.control} fullWidth={true}>
                        <InputLabel id={`paramtype-${i}`}>Type</InputLabel>
                        <Select labelId={`paramtype-${i}`}
                            id={`paramselect-${i}`}
                            onChange={handleParameters}
                            name={`paramselect-${i}`}
                            value={serviceParameters[i].type}>
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="file">File</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        ));
    }

    return (
        <React.Fragment>
            <Grid item xs={12}>
                <form className={classes.form} onSubmit={handleSubmit} method="post" noValidate>
                    {/* SERVICE NAME */}
                    <FormControl className={classes.control} fullWidth={true}>
                        <InputLabel htmlFor="serviceName" fullWidth>Service Name</InputLabel>
                        <Input
                            id="serviceName"
                            type="text"
                            value={serviceName}
                            onChange={handleServiceName}
                            autoComplete="off"
                            fullWidth={true}
                        />
                    </FormControl>
                    {/* DESCRIPTION */}
                    <FormControl className={classes.control} fullWidth={true}>
                        <InputLabel htmlFor="serviceDesc" fullWidth>Service Description</InputLabel>
                        <Input
                            id="serviceDesc"
                            type="textarea"
                            multiline={true}
                            rows={2}
                            onChange={handleServiceDescription}
                            autoComplete="off"
                            fullWidth={true}
                        />
                    </FormControl>
                    {/* INPUT FILES */}
                    <Grid container spacing={3} justify="space-between" style={{ paddingTop: 20 }}>
                        <Grid item>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Makefile
                        <input
                                    type="file"
                                    id="makefile"
                                    style={{ display: "none" }}
                                    onChange={handleFileUpload}
                                    required
                                />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload Source
                        <input
                                    type="file"
                                    id="sourcefile"
                                    style={{ display: "none" }}
                                    onChange={handleFileUpload}
                                    required
                                />
                            </Button>
                        </Grid>
                    </Grid>

                    {parameterForms}

                    <Button className={classes.parameterButton} onClick={handleAdd} variant="outlined" fullWidth={true}>
                        Add Parameter
                    </Button>
                    <Button className={classes.deleteButton} onClick={handleDelete} variant="outlined" fullWidth={true}>
                        Delete Parameter
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit
                    </Button>
                </form>
            </Grid>
        </React.Fragment>
    )
}

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    control: {
        width: '100%', // Fix IE 11 issue.
        margin: theme.spacing(1, 0, 1),
    },
    parameterButton: {
        width: '100%', // Fix IE 11 issue.
        margin: theme.spacing(2, 0, 0),
    },
    deleteButton: {
        width: '100%', // Fix IE 11 issue.
        color: red[300],
        borderColor: red[200],
        margin: theme.spacing(2, 0, 0),
        '&:hover': {
            backgroundColor: "#ffebee0d"
        }
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default AddService
