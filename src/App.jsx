import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { useGlobalContext } from './utils/GlobalContext';
import NavTabs from './components/NavTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editor from './components/Editor';
import Home from './components/Home';
import MyCVs from './components/MyCVs';
import SearchJobs from './components/SearchJobs';
import './utils/globalStyles.css'
import { useAuth } from './utils/contexts/authContext';
import Welcome from './components/Welcome';
import Login from './components/auth/login';
import Register from './components/auth/register';

function App() {
  const { userLoggedIn } = useAuth()
  const { isAuth, setIsAuth, authenticated, setAuthenticated, getCVMCurrentUser } = useGlobalContext();

  useEffect(() => {
    const currentUser = getCVMCurrentUser();
    if (currentUser){
      allowUserIn();
    }
  }, [authenticated]);

  useEffect(() => {
    console.log("is Auth?", isAuth)
  }, [isAuth])

  function allowUserIn() {
    setAuthenticated(true)
  }

  return (
    <Router>
        <>
          {userLoggedIn && <NavTabs />}
          {/* Wraps Route elements in a Routes component */}
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="myCVs" element={<MyCVs />} />
            <Route path="searchJobs" element={<SearchJobs />} />
            <Route path="/editor/*" element={<Editor />} /> {/* Adjust the path for the Editor component */}
          </Routes>
        </>
    </Router>
  )
}

export default App