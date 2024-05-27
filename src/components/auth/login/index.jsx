import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSendEmailVerification,
} from "../../../config/auth";
import { useAuth } from "../../../utils/contexts/authContext";
import { createUserDocument } from "../../../config/firestore";
import "../login.css";

const Login = () => {
  const { userLoggedIn, currentUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      try {
        setIsSigningIn(true);
        const { user } = await doSignInWithEmailAndPassword(email, password);
        console.log("User Credential:", user);
        // await doSendEmailVerification();
        await createUserDocument(user);
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode)
        console.log(errorMessage)
        if (errorCode === 'auth/invalid-credential') {
          console.error("Incorrect email and/or password. Please try again")
          setIsSigningIn(false);
        }
      }
      // Inside your submitUser function's catch block:
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();

    try {
      if (!isSigningIn) {
        setIsSigningIn(true);
        const { user } = await doSignInWithGoogle();
        await createUserDocument(user);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode)
      console.log(errorMessage)
      if (errorCode === 'auth/popup-closed-by-user') {
        console.error("Did not get user's email (popup closed by user). Please try again")
        setIsSigningIn(false);
      } else {
        console.error(errorMessage, "Please try again.")
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main className="loginCompWrapper">
        <div className="loginWrapper">
          <h3 className="login-header">Welcome to CV Master</h3>

          <form onSubmit={onSubmit} className="login-form">
            <div className="d-flex flex-column flex-sm-row">
              <div className="d-flex flex-column">
                <label className="login-label">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="login-input"
                />
              </div>

              <div className="d-flex flex-column">
                <label className="login-label">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="login-input"
                />
              </div>
              <div className="d-flex flex-column flex-sm-row">
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className={`login-submitBtn align-self-center align-self-sm-end mt-4 mt-sm-0 rounded-end ${
                    isSigningIn
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
                  }`}
                >
                  {isSigningIn ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}
          </form>
          <p className="text-center login-smallPar">
            Don't have an account?{" "}
            <Link to={"/register"} className="hover:underline font-bold">
              Sign up
            </Link>
          </p>
          <div className="flex flex-row text-center">
            <div className="login-or">OR</div>
          </div>
          <button
            disabled={isSigningIn}
            onClick={(e) => {
              onGoogleSignIn(e);
            }}
            className={`login-google d-flex justify-content-center p-2 px-3 border rounded-5 text-sm font-medium  ${
              isSigningIn
                ? "cursor-not-allowed"
                : "hover:bg-gray-100 transition duration-300 active:bg-gray-100"
            }`}
          >
            <svg
              className="login-googleIcon me-2"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_17_40)">
                <path
                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                  fill="#4285F4"
                />
                <path
                  d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                  fill="#34A853"
                />
                <path
                  d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                  fill="#FBBC04"
                />
                <path
                  d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {isSigningIn ? "Signing In..." : "Continue with Google"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
