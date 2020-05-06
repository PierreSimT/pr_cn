import firebase from 'firebase/app';
import 'firebase/auth';

import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authenticated: false,
        user: null,
    },
    reducers: {
        authenticate: (state) => {
            state.authenticated = true;
        },
        logout: (state) => {
            state.authenticated = false;
        }
    },
});

export const { logout, authenticate } = authSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const registerUser = account => dispatch => {
    // console.log(account);
    firebase.auth().createUserWithEmailAndPassword(account.email, account.password).then(val => {
        //console.log(val);
        firebase.auth().signInWithEmailAndPassword(account.email, account.password).then(user => {
            dispatch(authenticate());
        }, err => {
            console.log(err.code);
            console.log(err.message);
        })
    }, err => {
        console.log(err.code);
        console.log(err.message);
    });
};

export const authenticateUser = account => dispatch => {
    // console.log(account);
    firebase.auth().signInWithEmailAndPassword(account.email, account.password).then(val => {
        dispatch(authenticate());
    }, err => {
        console.log(err.code);
        console.log(err.message);
    })
};

export const disconnectUser = () => dispatch => {
    firebase.auth().signOut().then( result => {
        dispatch(logout);
    })
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectAuth = state => state.auth.authenticated;

export default authSlice.reducer;
