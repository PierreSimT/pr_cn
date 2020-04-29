import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Jumbotron, Form, Button } from 'react-bootstrap'

type Props = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Login = (props: RouteComponentProps & Props) => {
    return (
        <div>
            <Jumbotron>
                <Form onSubmit={props.handleSubmit}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </Jumbotron>
        </div>
    )
}

export default Login
