import React, { useState, useEffect } from 'react'
import { Service, Result, BACKEND_URL } from '../common';
import List from '../List/List';
import RunServiceForm from '../LoadAlgorithm/RunServiceForm';

import axios from 'axios';
import ResultList from '../List/ResultList';
import { RouteComponentProps } from '@reach/router';


interface Props {

}

const ResultsService = (props: RouteComponentProps) => {
    const [algorithms, setAlgorithms] = useState<Service[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Service>();
    const [serviceResults, setServiceResults] = useState<Result[]>();
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

        console.log(event);
        setServiceResults(event.results);
        setSelectedAlgorithm(event);
        setSelected(true);

        console.log(serviceResults)
    }

    return (
        <div>
            <List algorithms={algorithms} handleClick={handleCLick} />
            {selected ?
                <ResultList serviceName={selectedAlgorithm!.name} results={selectedAlgorithm?.results!} /> : <div></div>
            }
        </div>
    )
}

export default ResultsService
