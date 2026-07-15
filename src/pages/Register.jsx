import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = ({handleRegister, errors, setErrors}) => {

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@company.com"
            className={`form-input${errors.email ? " form-input--error" : ""}`}
            value={registerData.email}
            onChange={(e)=>{
              setRegisterData({...registerData, email: e.target.value});
              if(e.target.value.trim() !==""){
                setErrors(false);
              }
            }}
          />
           {errors.email ? (
              <span className="form-error ">{errors.email}</span>
            ) : (
              ""
            )}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="form-input-wrap">
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              className="form-input"
              value={registerData.password}
              onChange={(e)=>{
                setRegisterData({...registerData, password: e.target.value});
                if(e.target.value.trim() !==""){
                  setErrors(false);
                }
              }}
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <div className="form-input-wrap">
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm your password"
              className="form-input"
              value={registerData.confirmPassword}
              onChange={(e)=>{
                setRegisterData({...registerData, confirmPassword: e.target.value});

              }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn--primary"
         onClick={handleRegister}
        >
          Sign Up
        </button>

        <p className="login-footer">
          Already have an account? 
            <Link className="login-footer-link" to="/login">
               Sign up
            </Link>
          </p>
      </div>
    </div>
  );
};

export default Register;
