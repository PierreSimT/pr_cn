import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'

import { Link } from '@reach/router';

interface Props {

}

const Navigation = (props: Props) => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                    <Navbar.Brand href="#home">CN</Navbar.Brand>
                    <Nav className="mr-auto">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="services" className="nav-link">Services</Link>
                    <Link to="queue" className="nav-link">Queue</Link>
                    <Link to="results" className="nav-link">Results</Link>
                    </Nav>
            </Container>
        </Navbar>
    )
}

export default Navigation
