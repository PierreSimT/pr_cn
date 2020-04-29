import React, { useState, useEffect } from 'react';

import Navigation from './components/Navigation/Navigation';

import { Router, Redirect, RouteComponentProps, redirectTo } from '@reach/router';

import { Container } from 'react-bootstrap';
import LoadService from './components/Navigation/Services/LoadService';
import ResultsService from './components/Navigation/Services/ResultsService';
import Login from './components/Navigation/Auth/Login';
import User from './components/Navigation/User';

import Cookies from 'js-cookie';
import axios from 'axios';
import Index from './components/Navigation/Index';
import Logout from './components/Navigation/Auth/Logout';
import Register from './components/Navigation/Auth/Register';

function App() {

  const [jwtToken, setToken] = useState<any>()
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (Cookies.get('jwt') !== undefined)
      setAuthenticated(true);
  }, [])

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Login');
    var username: any = event.currentTarget.elements[0];
    var password: any = event.currentTarget.elements[1];
    console.log(username.value);
    console.log(password.value);

    axios.post('/auth/login', {
      username: username.value,
      password: password.value
    }).then(res => {
      console.log(res);
      Cookies.set('jwt', res.data.token)
      setToken(res.data.token);
      setAuthenticated(true);
      redirectTo('/');
    }, err => {

    })
  }

  const handleLogout = () => {
    Cookies.remove('jwt');
    setAuthenticated(false);    
  }

  return (
    <div className="App">
      <Navigation />
      <Container>
        <Router>
          <Index path="/" />
          <LoadService path="/services" />
          <ResultsService path="/results" />
          <Login path="/login" handleSubmit={handleLogin} />
          <Logout path="/logout" handleLogout={handleLogout} />
          <Register path="/register" />
          <PrivateRoute as={User} path="/user/*" />
        </Router>
      </Container>
    </div>
  );
}

type PrivateProps = {
  as: React.FC<RouteComponentProps>
}

const PrivateRoute = (props: PrivateProps & RouteComponentProps) => {
  let Comp = props.as;

  if (Cookies.get('jwt') !== undefined)
    return (
      <Comp {...props} />
    )
  else {
    return (
      <Redirect from={props.path} to="/login" noThrow/>
    )
  }
}

export default App;
