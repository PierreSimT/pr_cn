import React, { useState, useEffect } from 'react'
import ServiceList from '../Services/ServiceList'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete'
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Input, DialogContentText } from '@material-ui/core'

import axios from 'axios'

const DeleteService = () => {
    const [loadedList, setLoadedList] = useState(false);
    const [services, setServices] = useState()
    const [openDialog, setOpenDialog] = useState(false);
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
        setOpenDialog(true);
    }

    return (
        <React.Fragment>
            {openDialog ? (<Dialog open={openDialog} onClose={() => setOpenDialog(false)} >
                <DialogTitle>Delete {selectedService.name}</DialogTitle>
                <form method="post" noValidate autoComplete="off" onSubmit={(e) => {
                    e.preventDefault()
                    console.log(e.currentTarget.elements)
                }}>
                    <DialogContent>

                        <DialogContentText component="h5">Name of the service to confirm deletion:</DialogContentText>
                        <FormControl fullWidth={true}>
                            <InputLabel htmlFor="serviceName" fullWidth>Service Name</InputLabel>
                            <Input
                                id="serviceName"
                                type="text"
                                // value={"serviceName"}
                                // onChange={handleServiceName}
                                autoComplete="off"
                            // fullWidth
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>) : <div></div>}
            <Container>
                {loadedList ?
                    <ServiceList
                        services={services}
                        onServiceSelect={onServiceSelect}
                        button={(<Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            fullWidth
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>)} /> : <div></div>}
            </Container>
        </React.Fragment>
    )
}

export default DeleteService
