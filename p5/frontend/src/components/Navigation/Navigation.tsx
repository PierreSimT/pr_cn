import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'

import { Link } from '@reach/router';

import FA from 'react-fontawesome';
import Cookies from 'js-cookie';

interface Props {

}

const Navigation = (props: Props) => {

    let isLoggedIn = false;
    if (Cookies.get('jwt') != undefined)
        isLoggedIn = true

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Compute Service</Navbar.Brand>
                <Nav className="mr-auto">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/services" className="nav-link">Services</Link>
                    <Link to="/results" className="nav-link">Results</Link>
                </Nav>
                <Nav>
                    {isLoggedIn ?
                        <Link to="/user" className="nav-link">Account</Link> : (<>
                            <Link to="/register" className="nav-link">Register</Link>
                            <Link to="/login" className="nav-link">Log-In</Link>
                        </>)}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Navigation
