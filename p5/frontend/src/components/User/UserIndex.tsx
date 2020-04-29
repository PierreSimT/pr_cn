import React from 'react'
import { RouteComponentProps } from '@reach/router'

interface Props {
    
}

const UserIndex = (props: RouteComponentProps) => {
    return (
        <div>
            <h3>Dashboard</h3>
            <h4 style={{ float: 'left'}}>My Services</h4>
        </div>
    )
}

export default UserIndex
