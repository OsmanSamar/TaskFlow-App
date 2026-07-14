// import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = ({ loginData, setLoginData, handleLogin, errors, setErrors }) => {
  return (
    <div className="login-page">
      <div className="login-card">
        <aside className="login-hero" aria-hidden="true">
          <img src="/favicon.svg" alt="" className="login-hero__logo" />
          <p className="login-hero__eyebrow">User Management</p>
          <p className="login-hero__desc login-hero__desc--mobile">
            Streamline user access for modern development teams.
          </p>
          <p className="login-hero__desc login-hero__desc--desktop">
            Streamline user access, roles, and permissions — built for modern
            development teams.
          </p>
          <h1 className="login-hero__title">DevPortal</h1>
        </aside>
        <main className="login-panel">
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
              value={loginData.email}
              onChange={(e) => {
                setLoginData({ ...loginData, email: e.target.value });
                if (e.target.value.trim() !== "") {
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
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`form-input${errors.password ? " form-input--error" : ""}`}
                value={loginData.password}
                onChange={(e) => {
                  setLoginData({ ...loginData, password: e.target.value });
                  if (e.target.value.trim() !== "") {
                    setErrors(false);
                  }
                }}
              />
              {errors.password ? (
                <span className="form-error">{errors.password}</span>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="form-row">
            <label className="form-checkbox">
              <input
              type="checkbox"
              checked={loginData.remember}
              onChange={(e)=>{
                setLoginData({ ...loginData, remember: e.target.checked });
              }}
              
              />
              <span>Remember me</span>
            </label>
            <Link className="form-link" to="/forgotpassword">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            onClick={handleLogin}
          >
            Sign in
          </button>

          <p className="login-footer">
            <Link className="login-footer-link" to="/register">
              Sign up
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default Login;
