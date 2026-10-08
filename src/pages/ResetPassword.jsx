import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../utils/validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PasswordCriteria } from "../components/PasswordCriteria";
import { useTranslation } from "react-i18next";
import "./reset-password.css";
import Button from "../components/Button";
import Input from "../components/Input";

export const ResetPassword = () => {
  const { t } = useTranslation();

  console.log("ResetPassword component rendered");

  const [resetData, setResetData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Get token from URL query parameters
  const token = new URLSearchParams(window.location.search).get("token");

  const handleResetData = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const passwordError = validatePassword(resetData.password);

    if (passwordError) {
      newErrors.password = passwordError;
    }

    const confirmPasswordError = validateConfirmPassword(
      resetData.password,
      resetData.confirmPassword,
    );

    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const response = await fetch(
        "http://localhost:3000/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: resetData.password,
            confirmPassword: resetData.confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          form: data.message || t("resetPassword.resetFailed"),
        });
        return;
      }

      console.log("Password reset successful:", data);
      navigate("/login");
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h1 className="reset-password-panel__title">
          {t("resetPassword.title")}
        </h1>

        <form onSubmit={handleResetData}>
          <div className="form-field">
            <label className="form-label" htmlFor="password">
              {t("resetPassword.newPassword")}
            </label>

            <div className="form-input-wrap">
              <Input
                id="password"
                type={!showPassword ? "password" : "text"}
                name="password"
                autoComplete="new-password"
                placeholder={t("resetPassword.passwordPlaceholder")}
                className={`form-input${
                  errors.password ? " form-input--error" : ""
                }`}
                value={resetData.password}
                onChange={(e) => {
                  setResetData({
                    ...resetData,
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
                    ? t("resetPassword.hidePassword")
                    : t("resetPassword.showPassword")
                }
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>

            <PasswordCriteria password={resetData.password} />

            {errors.password ? (
              <span className="form-error">{errors.password}</span>
            ) : (
              ""
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirmPassword">
              {t("resetPassword.confirmPassword")}
            </label>

            <div className="form-input-wrap">
              <Input
                id="confirmPassword"
                type={!showConfirmPassword ? "password" : "text"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder={t("resetPassword.passwordPlaceholder")}
                className={`form-input${
                  errors.confirmPassword ? " form-input--error" : ""
                }`}
                value={resetData.confirmPassword}
                onChange={(e) => {
                  setResetData({
                    ...resetData,
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="btn--password-eye"
                aria-label={
                  showConfirmPassword
                    ? t("resetPassword.hideConfirmPassword")
                    : t("resetPassword.showConfirmPassword")
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>

            {errors.confirmPassword ? (
              <span className="form-error">{errors.confirmPassword}</span>
            ) : (
              ""
            )}
          </div>

          {errors.form ? (
            <span className="form-error">{errors.form}</span>
          ) : null}

          <button type="submit" className="btn btn--primary">
            {t("resetPassword.resetPassword")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
