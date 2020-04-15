import React from 'react';
import logo from './logo.svg';
import AlgorithmForm from './components/AlgorithmForm/AlgorithmForm';
import LoadAlgorithm from './components/LoadAlgorithm/LoadAlgorithm';

import './App.css';
import Navigation from './components/Navigation/Navigation';
import List from './components/List/List';
import { Container } from 'react-bootstrap';


function App() {
  return (
    <div className="App">
      <Navigation />
      <Container>
        {/* <List /> */}
        <AlgorithmForm />
        {/* <LoadAlgorithm /> */}
      </Container>
    </div>
  );
}

export default App;
