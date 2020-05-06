import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import auth from 'firebase/auth'
import * as serviceWorker from './serviceWorker';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

var app = firebase.initializeApp({
  apiKey: "AIzaSyD8thscCqXq3Kc2COQE_6LQ-uijyJVWA3Q",
  authDomain: "cn-service.firebaseapp.com",
  databaseURL: "https://cn-service.firebaseio.com",
  projectId: "cn-service",
  storageBucket: "cn-service.appspot.com",
  messagingSenderId: "615852070953",
  appId: "1:615852070953:web:9713c9fd0484858144e438"
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
