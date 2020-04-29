import React, { useState, useEffect } from 'react'
import { Service, Result } from '../../common';
import List from '../../List/List';

import axios from 'axios';
import ResultList from '../../List/ResultList';
import { RouteComponentProps } from '@reach/router';

const ResultsService = (props: RouteComponentProps) => {
    const [algorithms, setAlgorithms] = useState<Service[]>([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Service>();
    const [serviceResults, setServiceResults] = useState<Result[]>();
    const [selected, setSelected] = useState<boolean>(false);

    useEffect(() => {
        axios.get(`/api/get/service/all`)
            .then(res => {
                console.log(res);
                setAlgorithms(res.data);
            })
    }, [])

    const handleCLick = (event: Service) => {
        console.log(event);
        setServiceResults(event.results);
        setSelectedAlgorithm(event);
        setSelected(true);

        console.log(serviceResults)
    }

    return (
        <div>
            <br />
            <List algorithms={algorithms} handleClick={handleCLick} />
            {selected ?
                <ResultList serviceName={selectedAlgorithm!.name} results={selectedAlgorithm?.results!} /> : <div></div>
            }
        </div>
    )
}

export default ResultsService
