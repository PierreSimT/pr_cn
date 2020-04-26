import React from 'react';
import logo from './logo.svg';
import AlgorithmForm from './components/AlgorithmForm/AlgorithmForm';
import RunServiceForm from './components/LoadAlgorithm/RunServiceForm';

import './App.css';
import Navigation from './components/Navigation/Navigation';
import List from './components/List/List';

import { Router } from '@reach/router';

import { Container } from 'react-bootstrap';
import LoadService from './components/Navigation/LoadService';
import ResultsService from './components/Navigation/ResultsService';



function App() {
  return (
    <div className="App">
      <Navigation />
      <Container>
        <Router>
          <AlgorithmForm path="/" />
          <LoadService path="/services" />
          <ResultsService path="/results" />
        </Router>
      </Container>
    </div>
  );
}

export default App;
