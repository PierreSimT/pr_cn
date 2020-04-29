import React, {  } from 'react'

import { Service } from '../common';
import { Jumbotron, CardDeck, Card } from 'react-bootstrap';

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
            <Card key={idx}>
                <Card.Body>
                    <Card.Title>{value.name}</Card.Title>
                    <Card.Text>
                        <p>{value.description}</p>
                    </Card.Text>
                    <Card.Link href="#" onClick={() => props.handleClick(value)}>Select</Card.Link>
                </Card.Body>
            </Card>
        );
    })

    return (
            <Jumbotron>
                <h2>Saved Services</h2>
                <CardDeck>
                    {algorithmList}
                </CardDeck>
            </Jumbotron>
    )
}

export default List
