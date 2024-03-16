import React from 'react'
import Login from '../auth/login'
import Register from '../auth/register'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../utils/contexts/authContext'

export default function Welcome() {
    const {userLoggedIn} = useAuth();
  return (
    <>
        {userLoggedIn ? <Navigate to={'/home'} replace={true} /> : <Navigate to={'/login'} replace={true} />}
    </>
  )
}
