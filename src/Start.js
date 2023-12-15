import React from 'react'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import App from './App'
import './App.css';

const Start = () => {
  return (
    <Router>
      <Routes>
            <Route path='/' element={<App/>}/>
      </Routes>
    </Router>
  )
}

export default Start;
