import React, { useState, useEffect } from 'react'
import List from '../../List/List'
import { Service } from '../../common';


import axios from 'axios';
import RunServiceForm from '../../Services/RunService/RunServiceForm';
import { RouteComponentProps } from '@reach/router';

const LoadService = (props: RouteComponentProps) => {

    const [algorithms, setAlgorithms] = useState<Service[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Service>();
    const [selected, setSelected] = useState<boolean>(false);

    useEffect(() => {
        axios.get(`/api/get/service/all`)
            .then(res => {
                console.log(res);
                setAlgorithms(res.data);
            })
    }, [])

    const handleCLick = (event: Service) => {

        setSelectedAlgorithm(event);
        setSelected(true);
    }

    return (
        <div>
            <br />
            <List algorithms={algorithms} handleClick={handleCLick} />
            {selected ?
                <RunServiceForm selectedService={selectedAlgorithm!} /> : <div></div>
            }
        </div>
    )
}

export default LoadService
