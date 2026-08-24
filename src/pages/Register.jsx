import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validators";
import { PasswordCriteria } from "../components/PasswordCriteria";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const nameError = validateName(registerData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

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

    setErrors(newErrors);

    // to ask if the object has errors
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            setErrors({
              email: data.message,
            });
            return;
          }

          setErrors({
            form: data.message || "Registration failed",
          });
          return;
        }

        navigate("/login");
      } catch (error) {
        console.error("Registration request failed:", error);

        setErrors({
          form: "Unable to connect to the server. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-panel__title">Create an account </h1>
        <form onSubmit={handleRegister}>
          <div className="form-field">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="John"
              className={`form-input${errors.name ? " form-input--error" : ""}`}
              value={registerData.name}
              onChange={(e) => {
                setRegisterData({ ...registerData, name: e.target.value });
                if (e.target.value.trim() !== "") {
                  setErrors((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }
              }}
            />
            {errors.name ? (
              <span className="form-error ">{errors.name}</span>
            ) : (
              ""
            )}
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
            <PasswordCriteria password={registerData.password} />
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

          {errors.form && <span className="form-error">{errors.form}</span>}

          <button type="submit" className="btn btn--primary"
          disabled={loading}>
           {loading ? "Sign up..." : "Sign up"}
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
