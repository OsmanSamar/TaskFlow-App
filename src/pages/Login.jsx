import { Link } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    // Regex en test()
    // const emailPattern= /[a-z]+@[a-z]+\.[a-z]+/;
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    // const passwordPattern =/^.{8,}$/;
    if (loginData.email.trim() === "") {
      newErrors.email = "Email is required";
    } else {
      if (!emailPattern.test(loginData.email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (loginData.password.trim() === "") {
      newErrors.password = "Password is required";
    } else {
      if (!passwordPattern.test(loginData.password)) {
        newErrors.password = "Invalid  password";
      }
    }

    setErrors(newErrors);
  };

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
          <h1 className="login-hero__title">Code blauw</h1>
        </aside>
        <main className="login-panel">
          <h1 className="login-panel__title">Sign in</h1>
          <p className="login-panel__subtitle">
            Enter your credentials to access your account.
          </p>
          <form onSubmit={handleLogin}>
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`form-input${errors.password ? " form-input--error" : ""}`}
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
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
                <span className="form-error">{errors.password}</span>
              ) : (
                ""
              )}
            </div>

            <div className="form-row">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={loginData.remember}
                  onChange={(e) => {
                    setLoginData({ ...loginData, remember: e.target.checked });
                  }}
                />
                <span>Remember me</span>
              </label>
              <Link className="form-link" to="/forgotpassword">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn--primary">
              Sign in
            </button>
          </form>

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
