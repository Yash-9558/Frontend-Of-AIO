import React from 'react'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import App from './App'

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
