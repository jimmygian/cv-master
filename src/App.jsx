import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useState, useEffect } from 'react';
import { useGlobalContext } from './utils/GlobalContext';
import NavTabs from './components/NavTabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editor from './components/Editor';
import Login from './components/Login';
import MyCVs from './components/MyCVs';
import SearchJobs from './components/SearchJobs';
import './utils/globalStyles.css'

function App() {
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
      {!authenticated ? (
        <Login allowUserIn={allowUserIn}/>
      ) : (
        <>
          <NavTabs />
          {/* Wraps Route elements in a Routes component */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="myCVs" element={<MyCVs />} />
            <Route path="searchJobs" element={<SearchJobs />} />
            <Route path="/editor/*" element={<Editor />} /> {/* Adjust the path for the Editor component */}
          </Routes>
        </>
      )}
    </Router>
  )
}

export default App
