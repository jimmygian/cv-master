import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from 'universal-cookie';


const cookies = new Cookies();
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [userDocRef, setUserDocRef] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    setUserDocRef(null)
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      // console.log("USER: ", user.accessToken)
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
      setUserDocRef(doc(db, "users", `${user.uid}`))
      cookies.set("auth-token", user.accessToken);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setUserDocRef(null);
      setIsAuth(false);
    }
    setLoading(false);
  }


  // AUTH CONTEXT VALUES
  const value = {
    currentUser,
    userLoggedIn,
    loading,
    isAuth,
    userDocRef,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
