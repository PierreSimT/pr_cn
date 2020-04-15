import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Algorithm } from '../common';
import { Container, ListGroup, Jumbotron } from 'react-bootstrap';

interface Props {

}

const List = (props: Props) => {

    const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
    let algorithmList: JSX.Element[] = [];

    useEffect(() => {
        axios.get('http://localhost:4000/api/get/service/all')
            .then(res => {
                console.log(res);
                setAlgorithms(res.data);
            })
    }, [])

    console.log(algorithmList);

    algorithmList = algorithms.map((value: Algorithm, idx: number) => {
        console.log(value);
        return (
            <ListGroup.Item key={idx} action>
                {value.name}
            </ListGroup.Item>
        );
    })

    return (
        <Container>
            <Jumbotron>
                <h2>Algoritmos almacenados</h2>
                <ListGroup>
                    {algorithmList}
                </ListGroup>
            </Jumbotron>
        </Container>
    )
}

export default List
