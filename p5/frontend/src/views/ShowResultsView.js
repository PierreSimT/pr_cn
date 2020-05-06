import React, { useState, useEffect } from 'react'
import ServiceList from './components/Services/ServiceList'

import axios from 'axios'
import { Container, Dialog, DialogContent, DialogTitle, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const ShowResultsView = () => {
    const classes = useStyles();
    const [loadedList, setLoadedList] = useState(false);
    const [services, setServices] = useState()
    const [openTable, setOpenTable] = useState(false);
    const [selectedService, setSelectedService] = useState();

    useEffect(() => {
        axios.get(`/api/get/service/all`)
            .then(res => {
                //console.log(res);
                setServices(res.data);
                setLoadedList(true);
            })
    }, [])

    const onServiceSelect = (service) => {
        console.log(service)
        setSelectedService(service);
        setOpenTable(true);
    }

    return (
        <React.Fragment>
            <Grid container direction="column" justify="center" className={classes.heroContent}>
                {loadedList ? <Grid item><ServiceList services={services} onServiceSelect={onServiceSelect} /></Grid> : <div></div>}
                {openTable ? (
                    <Grid item>
                        <Container>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="resultTable">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell align="right">Parameters</TableCell>
                                            <TableCell align="right">Console Result</TableCell>
                                            <TableCell align="right">File Result</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedService.results.map((result, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell component="th" scope="row">
                                                    {result.date}
                                                </TableCell>
                                                <TableCell align="right">{result.vars}</TableCell>
                                                <TableCell align="right">{result.result.console}</TableCell>
                                                <TableCell align="right"><a href={`/api/get/${selectedService.name}/result/${result.result.file}`}>{`/api/get/${selectedService.name}/result/${result.result.file}`}</a></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Container>
                    </Grid>
                ) : <div></div>}
            </Grid>
        </React.Fragment>
    )
}

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    }
}));

export default ShowResultsView
