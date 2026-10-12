import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validateEmail } from "../utils/validators";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Input from "../components/Input";
const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    // Indicates whether the user wants a longer login session
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const [loginError, setLoginError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { setUser } = useContext(AuthContext);

  const emailError = validateEmail(loginData.email);
  // const passwordError = validatePassword(loginData.password);
  const passwordError = "";
  const isFormValid = !emailError && !passwordError;

  const handleResendVerification = async () => {
    setIsResending(true);

    try {
      const email = loginData.email;

      const response = await fetch(
        "http://localhost:3000/api/users/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setResendMessage(data.message);
    } finally {
      setIsResending(false);
    }
  };

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
      const response = await fetch(
        "http://localhost:3000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
            rememberMe: loginData.rememberMe,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || t("login.loginIncorrect"));
        return;
      }

      const meResponse = await fetch(
        "http://localhost:3000/api/users/me",
        {
          credentials: "include",
        },
      );

      const meData = await meResponse.json();

      setUser(meData.user);

      navigate("/dashboard");

      console.log("Login successful:", data);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(t("login.loginIncorrect"));
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <aside className="login-hero" aria-hidden="true">
          <img
            src="/favicon.svg"
            alt=""
            className="login-hero__logo"
          />

          {/* <p className="login-hero__eyebrow">
            {t("login.userManagement")}
          </p> */}

          <p className="login-hero__desc login-hero__desc--mobile">
            {t("login.heroDescriptionMobile")}
          </p>

          <p className="login-hero__desc login-hero__desc--desktop">
            {t("login.heroDescriptionDesktop")}
          </p>

          <h1 className="login-hero__title">TaskFlow</h1>
        </aside>

        <main className="login-panel">
          <h1 className="login-panel__title">
            {t("login.title")}
          </h1>

          <p className="login-panel__subtitle">
            {t("login.subtitle")}
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-field">
              <label className="form-label" htmlFor="email">
                {t("login.email")}
              </label>

              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@company.com"
                className="form-input"
                value={loginData.email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="password">
                {t("login.password")}
              </label>

              <div className="form-input-wrap">
                <Input
                  id="password"
                  type={!showPassword ? "password" : "text"}
                  name="password"
                  autoComplete="current-password"
                  placeholder={t("login.passwordPlaceholder")}
                  className="form-input"
                  value={loginData.password}
                  onChange={handlePasswordChange}
                />

                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn--password-eye"
                  aria-label={
                    showPassword
                      ? t("login.hidePassword")
                      : t("login.showPassword")
                  }
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </div>

            <div className="form-row">
              <label className="form-checkbox">
                <Input
                  type="checkbox"
                  id="rememberMe"
                  checked={loginData.rememberMe}
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      rememberMe: e.target.checked,
                    });
                  }}
                />

                <span>{t("login.rememberMe")}</span>
              </label>

              <Link
                className="form-link"
                to="/forgotpassword"
              >
                {t("login.forgotPassword")}
              </Link>
            </div>

            {loginError ? (
              <span className="form-error form-error--login">
                {loginError}
              </span>
            ) : null}

            {loginError ===
            "Please verify your email before logging in." ? (
              <div className="resend-verification">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <span
                        className="resend-verification__spinner"
                        aria-hidden="true"
                      />
                      {t("login.sending")}
                    </>
                  ) : (
                    t("login.resendVerification")
                  )}
                </button>

                {resendMessage ? (
                  <div
                    className="resend-verification__success"
                    role="status"
                    aria-live="polite"
                  >
                    <span
                      className="resend-verification__check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <div className="resend-verification__success-text">
                      <p className="resend-verification__success-title">
                        {resendMessage}
                      </p>

                      <p className="resend-verification__success-hint">
                        {t("login.checkInbox")}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={!isFormValid}
            >
              {t("login.signIn")}
            </button>
          </form>

          <p className="login-footer">
            <Link
              className="login-footer-link"
              to="/register"
            >
              {t("login.signUp")}
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default Login;

