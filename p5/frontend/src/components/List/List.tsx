import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { Service } from '../common';
import { RouteComponentProps } from "@reach/router"
import { Container, ListGroup, Jumbotron } from 'react-bootstrap';
import RunServiceForm from '../LoadAlgorithm/RunServiceForm';

type Props = {
    algorithms: Service[];
    handleClick: (event: Service) => void;
}

const List = (props: Props) => {

    let algorithmList: JSX.Element[] = [];

    console.log(algorithmList);

    algorithmList = props.algorithms.map((value: Service, idx: number) => {
        console.log(value);
        return (
            <ListGroup.Item key={idx} onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => props.handleClick(value)} action>
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
