import React from 'react'
import NewServiceForm from '../Services/NewService/NewServiceForm'
import { RouteComponentProps, Router } from '@reach/router'
import SideMenu from '../User/SideMenu'
import UserIndex from '../User/UserIndex'
import {Row, Col, Jumbotron } from 'react-bootstrap'
import DeleteServiceForm from '../Services/DeleteServiceForm/DeleteServiceForm'

interface Props {

}

const User = (props: RouteComponentProps) => {
    return (
        <>
            <br/>
            <Jumbotron>
                <Row>
                    <Col sm={2}>
                        <SideMenu />
                    </Col>
                    <Col sm={10}>
                        <Router>
                            <UserIndex path="/" />
                            <NewServiceForm path="add/service" />
                            <DeleteServiceForm path="del/service" />
                            
                        </Router>
                    </Col>
                </Row>
            </Jumbotron>
        </>
    )
}

export default User
