import React from 'react'
import { RouteComponentProps, useNavigate } from '@reach/router'
import { Row, Col, Container, Card, Button } from 'react-bootstrap'

const Index = (props: RouteComponentProps) => {

    const navigate = useNavigate();

    return (
        <Container>
            <Row className="p-4">
                <Col><h2>Welcome to Compute Service!</h2></Col>
            </Row>
            <Row className="p-2">
                <Col sm={6}>
                    <Card border="dark">
                        <Card.Body>
                            <Card.Title><h3>What is this page?</h3></Card.Title>
                            <Card.Text>This website offers you a web service where you can run different services/programs just by specifying the needed Makefile and source code.</Card.Text>
                            <Button variant="outline-dark">Learn How</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={6}>
                    <Card border="dark">
                        <Card.Body>
                            <Card.Title><h3>What can I do?</h3></Card.Title>
                            <Card.Text>Right now, you can just run the preinstalled services. If you have an account you may add as much services as you want with a simple form.</Card.Text>
                            <Button variant="outline-dark" onClick={() => navigate('/register', { replace: true })}>Register Now</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Index
