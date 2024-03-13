import React, { useState } from "react";
import { googleProvider, auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Cookies from "universal-cookie";
import { useGlobalContext } from "../../utils/GlobalContext";
const cookies = new Cookies();

export default function Auth() {
  const { isAuth, setIsAuth } = useGlobalContext();

  const [logIn, setLogIn] = useState({
    email: "",
    password: "",
  });

  console.log(logIn);
  console.log(auth?.currentUser?.email);

  function submitUser(e) {
    e.preventDefault();
    signUp();
  }

  const logout = async () => {
    try {
      await signOut(auth);
      cookies.remove("auth-token");
      setIsAuth(false);
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        logIn.email,
        logIn.password
      );
      console.log(result);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        await signIn();
      }
    }
  };


  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, logIn.email, logIn.password);
      console.log("SIGNED IN AGAIN!")
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        console.error("WRONG PASSWORD")
      } else {
        console.error(err)
      }
    }
  }


  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setLogIn((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  return (
    <>
      <form onSubmit={(e) => submitUser(e)}>
        <input
          name="email"
          type="email"
          placeholder="Email..."
          onChange={(e) => handleChange(e)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password..."
          onChange={(e) => handleChange(e)}
        />
        <button> Sign In</button>
      </form>
      <button onClick={signInWithGoogle}> Sign In With Google </button>
    </>
  );
}
