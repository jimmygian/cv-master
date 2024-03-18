import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/contexts/authContext";
import { doCreateUserWithEmailAndPassword } from "../../../config/auth";
import { db } from "../../../config/firebase";
import { createUserDocument } from "../../../config/firestore";
import "../login.css";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      const { user } = await doCreateUserWithEmailAndPassword(email, password);
      await createUserDocument(user);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main className="loginCompWrapper">
        <div className="loginWrapper">
          <h3 className="login-header">Create a New Account</h3>

          <form onSubmit={onSubmit} className="login-form">
            <div className="d-flex flex-column">
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
                  disabled={isRegistering}
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="login-input"
                />
              </div>

              <div className="d-flex flex-column">
                <label className="login-label">Confirm Password</label>
                <input
                  disabled={isRegistering}
                  type="password"
                  autoComplete="off"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                  className="login-input"
                />
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className={`login-submitBtn align-self-center align-self-sm-end mt-4 mt-sm-0 rounded  ${
                  isRegistering
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
                }`}
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            {errorMessage && (
              <span className="text-red-600 font-bold">{errorMessage}</span>
            )}

            <div className="mt-4 text-center login-smallPar">
              Already have an account? {"   "}
              <Link
                to={"/login"}
                className="text-center text-sm hover:underline font-bold"
              >
                Continue
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
