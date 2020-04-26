import React, { useState, useEffect } from 'react'
import List from '../List/List'
import { ListGroup } from 'react-bootstrap';
import { Service, BACKEND_URL } from '../common';


import axios from 'axios';
import RunServiceForm from '../LoadAlgorithm/RunServiceForm';
import { RouteComponentProps } from '@reach/router';

interface Props {

}

const LoadService = (props: RouteComponentProps) => {

    const [algorithms, setAlgorithms] = useState<Service[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Service>();
    const [selected, setSelected] = useState<boolean>(false);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/get/service/all`)
            .then(res => {
                console.log(res);
                setAlgorithms(res.data);
            })
    }, [])

    const handleCLick = (event: Service) => {
        let newSelectedService = event;

        setSelectedAlgorithm(event);
        setSelected(true);
    }

    return (
        <div>
            <List algorithms={algorithms} handleClick={handleCLick} />
            {selected ?
                <RunServiceForm selectedService={selectedAlgorithm!} /> : <div></div>
            }
        </div>
    )
}

export default LoadService
