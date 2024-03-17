import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { userLoggedIn } = useAuth()

  return (
    <Router>
        <>
          {userLoggedIn && <NavTabs />}
          {/* Wraps Route elements in a Routes component */}
          <Routes>
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute> } />
            <Route path="/myCVs" element={<ProtectedRoute><MyCVs /></ProtectedRoute> } />
            <Route path="/searchJobs" element={<ProtectedRoute><SearchJobs /></ProtectedRoute> } />
            <Route path="/editor/*" element={<ProtectedRoute> <Editor /></ProtectedRoute>} /> {/* Adjust the path for the Editor component */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </>
    </Router>
  )
}

export default App