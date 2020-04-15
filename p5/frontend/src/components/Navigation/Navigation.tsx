import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'

interface Props {

}

const Navigation = (props: Props) => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">CN</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#services">Services</Nav.Link>
                    <Nav.Link href="#queue">Queue</Nav.Link>
                    <Nav.Link href="#results">Results</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Navigation
