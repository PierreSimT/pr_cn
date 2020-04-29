import React from 'react'
import { RouteComponentProps, Redirect } from '@reach/router'

interface Props {
    handleLogout: () => void;
}

const Logout = (props: Props & RouteComponentProps) => {

    props.handleLogout();

    return (
        <div>
            <Redirect from={props.path} to="/" noThrow/>
        </div>
    )
}

export default Logout
