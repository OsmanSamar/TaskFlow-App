
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
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

const Register = () => {
  const { t } = useTranslation();

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

    const confirmPasswordError = validateConfirmPassword(
      registerData.password,
      registerData.confirmPassword,
    );

    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);

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
            form: data.message || t("register.registrationFailed"),
          });
          return;
        }

        navigate("/login");
      } catch (error) {
        console.error("Registration request failed:", error);

        setErrors({
          form: t("register.serverError"),
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-panel__title">
          {t("register.title")}
        </h1>

        <form onSubmit={handleRegister}>
          <div className="form-field">
            <label className="form-label" htmlFor="name">
              {t("register.name")}
            </label>

            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder={t("register.namePlaceholder")}
              className={`form-input${
                errors.name ? " form-input--error" : ""
              }`}
              value={registerData.name}
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
                  name: e.target.value,
                });

                if (e.target.value.trim() !== "") {
                  setErrors((prev) => ({
                    ...prev,
                    name: "",
                  }));
                }
              }}
            />

            {errors.name ? (
              <span className="form-error">{errors.name}</span>
            ) : (
              ""
            )}

            <label className="form-label" htmlFor="email">
              {t("register.email")}
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
              value={registerData.email}
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
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
              <span className="form-error">{errors.email}</span>
            ) : (
              ""
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="password">
              {t("register.password")}
            </label>

            <div className="form-input-wrap">
              <input
                id="password"
                type={!showPassword ? "password" : "text"}
                name="password"
                autoComplete="new-password"
                placeholder={t("register.passwordPlaceholder")}
                className={`form-input${
                  errors.password ? " form-input--error" : ""
                }`}
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

              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn--password-eye"
                aria-label={
                  showPassword
                    ? t("register.hidePassword")
                    : t("register.showPassword")
                }
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>

            <PasswordCriteria password={registerData.password} />

            {errors.password ? (
              <span className="form-error">{errors.password}</span>
            ) : (
              ""
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirmPassword">
              {t("register.confirmPassword")}
            </label>

            <div className="form-input-wrap">
              <input
                id="confirmPassword"
                type={!showConfirmPassword ? "password" : "text"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder={t("register.confirmPasswordPlaceholder")}
                className={`form-input${
                  errors.confirmPassword
                    ? " form-input--error"
                    : ""
                }`}
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

              <Button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="btn--password-eye"
                aria-label={
                  showConfirmPassword
                    ? t("register.hideConfirmPassword")
                    : t("register.showConfirmPassword")
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </Button>
            </div>

            {errors.confirmPassword ? (
              <span className="form-error">
                {errors.confirmPassword}
              </span>
            ) : (
              ""
            )}
          </div>

          {errors.form && (
            <span className="form-error">{errors.form}</span>
          )}

          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
          >
            {loading
              ? t("register.signingUp")
              : t("register.signUp")}
          </button>
        </form>

        <p className="login-footer">
          {t("register.haveAccount")}{" "}
          <Link className="login-footer-link" to="/login">
            {t("register.login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
