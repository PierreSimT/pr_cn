import React from 'react'
import { Nav } from 'react-bootstrap'
import { Link } from '@reach/router'

import { useLocation } from "@reach/router"

interface Props {

}

const SideMenu = () => {

    const location = useLocation();

    let activeIndex = '';
    let activeAdd = '';
    let activeDel = '';

    if (location.pathname.endsWith('user')) {
        activeIndex = 'active';
    } else if (location.pathname.endsWith('add/service')) {
        activeAdd = 'active';
    } else if (location.pathname.endsWith('del/service')) {
        activeDel = 'active';
    }


    return (
        <Nav variant="pills" className="flex-column">
            <Nav.Item>
                <Link to="./" className={`nav-link ${activeIndex}`}>Index</Link>
            </Nav.Item>
            <Nav.Item>
                <Link to="add/service" className={`nav-link ${activeAdd}`}>Add Service</Link>
            </Nav.Item>
            <Nav.Item>
                <Link to="del/service" className={`nav-link ${activeDel}`}>Delete Service</Link>
            </Nav.Item>
            <Nav.Item>
                <Link to="../logout" className="nav-link">Logout</Link>
            </Nav.Item>
        </Nav>
    )
}

export default SideMenu
