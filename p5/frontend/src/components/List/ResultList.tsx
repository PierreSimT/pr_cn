import React from 'react'
import { Service, Result, BACKEND_URL } from '../common';
import { ListGroup, Container, Jumbotron, Table } from 'react-bootstrap';

type Props = {
    serviceName: string;
    results: Result[];
}

const ResultList = (props: Props) => {
    let resultList: JSX.Element[] = [];

    console.log(props.results);

    if (props.results.length > 0) {
        resultList = props.results.map((value: Result, idx: number) => {
            console.log(value);
            const date = new Date(value.date);
            const date_string = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

            var vars_string = '';
            
            for ( let param in value.vars ) {
                vars_string += `${value.vars[param]} `;
            }


            let resultFile: string;
            if (value.result.file != '') {
                resultFile = `${BACKEND_URL}/get/${props.serviceName}/result/${value.result.file}`
            } else {
                resultFile = 'N/A'
            }

            return (
                <>
                    <tr key={idx}>
                        <td>{date_string}</td>
                        <td>{vars_string}</td>
                        <td>{value.result.console}</td>
                        <td><a href={resultFile}>{resultFile}</a></td>
                    </tr>
                </>
            );
        })
    }
    return (
        <Container>
            <h2>Results</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date of Execution</th>
                        <th>Used parameters</th>
                        <th>Console Output</th>
                        <th>File Output</th>
                    </tr>
                </thead>
                <tbody>
                    {resultList}
                </tbody>
            </Table>
        </Container>
    )
}

export default ResultList
