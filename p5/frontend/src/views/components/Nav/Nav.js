import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinkM from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

import {Link} from "react-router-dom";

import { useSelector } from 'react-redux';
import { selectAuth } from '../../../features/authentication/authSlice';


const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    }
}));

export default function Nav() {
    const classes = useStyles();
    const authenticated = useSelector(selectAuth);

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        Compute Service
          </Typography>
                    <nav>
                        <LinkM component={Link} variant="button" color="textPrimary" to="/" className={classes.link}>
                            Home
            </LinkM>
                        <LinkM component={Link} variant="button" color="textPrimary" to="/services" className={classes.link}>
                            Run a Service
            </LinkM>
                        <LinkM component={Link} variant="button" color="textPrimary" to="/result" className={classes.link}>
                            Results
            </LinkM>

                        {authenticated ? <div></div> :
                            (<LinkM component={Link} variant="button" color="textPrimary" to="/register" className={classes.link}>
                                Register
                            </LinkM>)}

                    </nav>
                    {authenticated ?
                        (<Button component={Link} to="/user" color="secondary" variant="outlined" className={classes.link}>
                            Account
                        </Button>) :
                        (<Button component={Link} to="/login" color="secondary" variant="outlined" className={classes.link}>
                            Login
                        </Button>)}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}
