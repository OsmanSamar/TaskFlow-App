import "./forgot-password.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { validateEmail } from "../utils/validators";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const [forgotData, setForgotData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const emailError = validateEmail(forgotData.email);

    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: forgotData.email,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message);
          return;
        }

        setMessage(data.message);
      } catch {
        setMessage(t("forgotPassword.somethingWentWrong"));
      }
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1 className="forgot-panel__title">
          {t("forgotPassword.title")}
        </h1>

        <p className="forgot-panel__subtitle">
          {t("forgotPassword.subtitle")}
        </p>

        <form onSubmit={handleForgot}>
          <div className="form-field">
            <label className="form-label" htmlFor="email">
              {t("forgotPassword.email")}
            </label>

            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@company.com"
              className={`form-input${
                errors.email ? " form-input--error" : ""
              }`}
              value={forgotData.email}
              onChange={(e) => {
                setForgotData({
                  ...forgotData,
                  email: e.target.value,
                });

                if (e.target.value.trim() !== "") {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }
              }}
            />

            {errors.email ? (
              <span className="form-error">
                {errors.email}
              </span>
            ) : (
              ""
            )}
          </div>

          <button type="submit" className="btn btn--primary">
            {t("forgotPassword.sendEmail")}
          </button>

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}
        </form>

        <p className="login-footer">
          <Link
            className="login-footer-link"
            to="/login"
          >
            {t("forgotPassword.backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

