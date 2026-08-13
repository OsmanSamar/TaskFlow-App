import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validateEmail } from "../utils/validators";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const { user, setUser } = useContext(AuthContext);

  const emailError = validateEmail(loginData.email);
  // const passwordError = validatePassword(loginData.password);
  const passwordError = "";
  const isFormValid = !emailError && !passwordError;

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setLoginData({ ...loginData, email });
    setLoginError("");
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(email),
    }));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setLoginData({ ...loginData, password });
    // setLoginError("");
    // setErrors((prev) => ({
    //   ...prev,
    //   password: validatePassword(password),
    // }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setLoginError("");

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // Allow the browser to send and receive authentication cookies
        credentials: "include",
        
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError("Login incorrect");
        return;
      }
      setUser(data.user);
      navigate("/dashboard");

      console.log("Login successful:", data);
 
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Login incorrect");
    }
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
          <h1 className="login-hero__title">TaskFlow</h1>
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
                // className={`form-input${errors.email ? " form-input--error" : ""}`}
                className="form-input"
                value={loginData.email}
                onChange={handleEmailChange}
              />
              {/* {errors.email ? (
                <span className="form-error">{errors.email}</span>
              ) : null} */}
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
                  // className={`form-input${errors.password ? " form-input--error" : ""}`}
                  className="form-input"
                  value={loginData.password}
                  onChange={handlePasswordChange}
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
              {/* {errors.password ? (
                <span className="form-error">{errors.password}</span>
              ) : null} */}
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

            {loginError ? (
              <span className="form-error form-error--login">{loginError}</span>
            ) : null}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={!isFormValid}
            >
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
