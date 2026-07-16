import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailError = validateEmail(registerData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(registerData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const ConfirmpasswordError = validateConfirmPassword(
      registerData.password,
      registerData.confirmPassword,
    );
    if (ConfirmpasswordError) {
      newErrors.confirmPassword = ConfirmpasswordError;
    }

    // to ask if the object has errors
    if (Object.keys(newErrors).length === 0) {
      navigate("/login");
    }

    setErrors(newErrors);
  };

  return (
    <div className="register-page">
      <div className="register-card">
      <h1 className="register-panel__title">Create an account </h1>
        <form onSubmit={handleRegister}>
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
              onChange={(e) => {
                setRegisterData({ ...registerData, email: e.target.value });
                if (e.target.value.trim() !== "") {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
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
                type={!showPassword ? "password" : "text"}
                name="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                className={`form-input${errors.password ? " form-input--error" : ""}`}
                value={registerData.password}
                onChange={(e) => {
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  });
                  if (e.target.value.trim() !== "") {
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="form-input__eye"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password ? (
              <span className="form-error ">{errors.password}</span>
            ) : (
              ""
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="form-input-wrap">
              <input
                id="confirmPassword"
                type={!showConfirmPassword ? "password" : "text"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm your password"
                className={`form-input${errors.confirmPassword ? " form-input--error" : ""}`}
                value={registerData.confirmPassword}
                onChange={(e) => {
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  });
                  if (e.target.value.trim() !== "") {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                  }
                }}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="form-input__eye"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <span className="form-error ">{errors.confirmPassword}</span>
            ) : (
              ""
            )}
          </div>

          <button type="submit" className="btn btn--primary">
            Sign Up
          </button>
        </form>
        <p className="login-footer">
          Already have an account?
          <Link className="login-footer-link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
