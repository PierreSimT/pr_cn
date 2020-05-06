import React from 'react';
import Nav from './views/components/Nav/Nav';
import Footer from './views/components/Footer/Footer';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect} from "react-router-dom";
import Register from './views/Auth/Register';
import Login from './views/Auth/Login';

import { useSelector, useDispatch } from 'react-redux';
import { authenticate, logout, selectAuth } from './features/authentication/authSlice';

import firebase from 'firebase/app';
import 'firebase/auth';
import RunServiceView from './views/RunServiceView';
import ShowResultsView from './views/ShowResultsView';
import UserView from './views/UserView';

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      dispatch(authenticate());
    } else {
      dispatch(logout());
    }
  });

  return (
    <React.Fragment>
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/">
              <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                  Compute Service
        </Typography>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                  Build and load online services on a private cluster.
        </Typography>
              </Container>
            </Route>
            <Route path="/services">
              <RunServiceView />
            </Route>
            <Route path="/result">
              <ShowResultsView />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/user">
              <UserView />
            </PrivateRoute>
          </Switch>

          <Footer />
        </div>
      </Router>
    </React.Fragment>
  );
}

function PrivateRoute({ children, ...rest }) {

  const authenticated = useSelector(selectAuth);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  }
}));

export default App;
