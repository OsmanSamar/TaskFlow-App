import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../utils/validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PasswordCriteria } from "../components/PasswordCriteria";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./change-password.css";
import Button from "../components/Button";
import Input from "../components/Input";

export const ChangePassword = () => {
  const { t } = useTranslation();

  const [changeData, setChangeData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChangeData = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const passwordError = validatePassword(changeData.newPassword);

    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    const confirmPasswordError = validateConfirmPassword(
      changeData.newPassword,
      changeData.confirmPassword,
    );

    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    if (!changeData.currentPassword.trim()) {
      newErrors.currentPassword = t("changePassword.currentPasswordRequired");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/me/password",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: changeData.currentPassword,
            newPassword: changeData.newPassword,
            confirmPassword: changeData.confirmPassword,
          }),
        },
      );

      const data = await response.json();

      console.log("Change password response:", response.status, data);

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: data.message || t("changePassword.failed"),
        }));

        return;
      }

      setSuccessMessage(t("changePassword.successMessage"));
    } catch (error) {
      console.error("Change password request failed:", error);

      setErrors((prev) => ({
        ...prev,
        currentPassword: t("changePassword.somethingWentWrong"),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h1 className="reset-password-panel__title">
          {t("changePassword.title")}
        </h1>

        <form onSubmit={handleChangeData}>
          <div className="form-field">
            <label className="form-label" htmlFor="currentPassword">
              {t("changePassword.currentPassword")}
            </label>

            <div className="form-input-wrap">
              <Input
                id="currentPassword"
                type={!showCurrentPassword ? "password" : "text"}
                name="currentPassword"
                autoComplete="current-password"
                placeholder={t("changePassword.passwordPlaceholder")}
                className={`form-input${
                  errors.currentPassword ? " form-input--error" : ""
                }`}
                value={changeData.currentPassword}
                onChange={(e) => {
                  setChangeData({
                    ...changeData,
                    currentPassword: e.target.value,
                  });

                  if (e.target.value.trim() !== "") {
                    setErrors((prev) => ({
                      ...prev,
                      currentPassword: "",
                    }));
                  }
                }}
              />

              <Button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="btn--password-eye"
                aria-label={
                  showCurrentPassword
                    ? t("changePassword.hidePassword")
                    : t("changePassword.showPassword")
                }
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="newPassword">
              {t("changePassword.newPassword")}
            </label>

            <div className="form-input-wrap">
              <input
                id="newPassword"
                type={!showNewPassword ? "password" : "text"}
                name="newPassword"
                autoComplete="new-password"
                placeholder={t("changePassword.passwordPlaceholder")}
                className={`form-input${
                  errors.newPassword ? " form-input--error" : ""
                }`}
                value={changeData.newPassword}
                onChange={(e) => {
                  setChangeData({
                    ...changeData,
                    newPassword: e.target.value,
                  });

                  if (e.target.value.trim() !== "") {
                    setErrors((prev) => ({
                      ...prev,
                      newPassword: "",
                    }));
                  }
                }}
              />

              <Button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="btn--password-eye"
                aria-label={
                  showNewPassword
                    ? t("changePassword.hidePassword")
                    : t("changePassword.showPassword")
                }
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>

            <PasswordCriteria password={changeData.newPassword} />

            {errors.newPassword ? (
              <span className="form-error">{errors.newPassword}</span>
            ) : (
              ""
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirmPassword">
              {t("changePassword.confirmPassword")}
            </label>

            <div className="form-input-wrap">
              <input
                id="confirmPassword"
                type={!showConfirmPassword ? "password" : "text"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder={t("changePassword.passwordPlaceholder")}
                className={`form-input${
                  errors.confirmPassword ? " form-input--error" : ""
                }`}
                value={changeData.confirmPassword}
                onChange={(e) => {
                  setChangeData({
                    ...changeData,
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
                    ? t("changePassword.hideConfirmPassword")
                    : t("changePassword.showConfirmPassword")
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

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading
              ? t("changePassword.changing")
              : t("changePassword.change")}
          </button>
        </form>
      </div>

      {successMessage && (
        <div className="change-password-modal-overlay" role="presentation">
          <div
            className="change-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-success-title"
          >
            <h2
              id="change-password-success-title"
              className="change-password-modal__title"
            >
              {t("changePassword.updated")}
            </h2>

            <p className="change-password-modal__text">{successMessage}</p>

            <div className="change-password-modal__actions">
              <button
                type="button"
                className="change-password-modal__btn change-password-modal__btn--primary"
                onClick={() => navigate("/login")}
              >
                {t("changePassword.goToLogin")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
