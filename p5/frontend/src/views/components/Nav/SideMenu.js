import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { disconnectUser } from '../../../features/authentication/authSlice';
import { useDispatch } from 'react-redux';

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 224,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function SideMenu(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <React.Fragment>

                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={props.value}
                    onChange={props.handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label="Add Service" {...a11yProps(0)} />
                    <Tab label="Delete Service" {...a11yProps(1)} />
                    <Tab label="Logout" onClick={() => dispatch(disconnectUser())} />
                </Tabs>

        </React.Fragment>
    );
}
