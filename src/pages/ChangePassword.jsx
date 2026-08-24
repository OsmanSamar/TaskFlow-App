import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../utils/validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { PasswordCriteria } from "../components/PasswordCriteria";
import { useNavigate } from "react-router-dom";
import "./change-password.css";

export const ChangePassword = () => {
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

    // Validate the new password.
    const passwordError = validatePassword(changeData.newPassword);

    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    // Validate that the new password and confirmation match.
    const confirmPasswordError = validateConfirmPassword(
      changeData.newPassword,
      changeData.confirmPassword,
    );

    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    // Current password is required.
    if (!changeData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    setErrors(newErrors);

    // Stop here if frontend validation failed.
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    //API request.
    //Prevent duplicate requests while the password is being changed.
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
        // Show the backend error to the user.
        setErrors((prev) => ({
          ...prev,
          currentPassword: data.message || "Failed to change password",
        }));

        return;
      } // Password was changed successfully.

      //Keep the user on this page so they can clearly see the sucess message.
      setSuccessMessage("Password changed successfully.");
    } catch (error) {
      console.error("Change password request failed:", error);

      setErrors((prev) => ({
        ...prev,
        currentPassword: "Something went wrong. Please try again.",
      }));
    } finally {
      // Always stop loading, whether the request succeeds or fails.
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <h1 className="reset-password-panel__title">Change password </h1>
        <form onSubmit={handleChangeData}>
          <div className="form-field">
            <label className="form-label" htmlFor="currentPassword">
              Current password
            </label>
            <div className="form-input-wrap">
              <input
                id="currentPassword"
                type={!showCurrentPassword ? "password" : "text"}
                name="currentPassword"
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`form-input${errors.currentPassword ? " form-input--error" : ""}`}
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

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="form-input__eye"
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* <PasswordCriteria password={changeData.currentPassword} />
            {errors.currentPassword ? (
              <span className="form-error ">{errors.currentPassword}</span>
            ) : (
              ""
            )} */}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="newPassword">
              New password
            </label>
            <div className="form-input-wrap">
              <input
                id="newPassword"
                type={!showNewPassword ? "password" : "text"}
                name="newPassword"
                autoComplete="new-password"
                placeholder="Enter your password"
                className={`form-input${errors.newPassword ? " form-input--error" : ""}`}
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

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="form-input__eye"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <PasswordCriteria password={changeData.newPassword} />
            {errors.newPassword ? (
              <span className="form-error ">{errors.newPassword}</span>
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
                placeholder="Enter your password"
                className={`form-input${errors.confirmPassword ? " form-input--error" : ""}`}
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

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Change Password..." : "Change Password"}
          </button>
        </form>
      </div>

      {successMessage && (
        <div
          className="change-password-modal-overlay"
          role="presentation"
          
        >
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
              Password updated
            </h2>
            <p className="change-password-modal__text">{successMessage}</p>
            <div className="change-password-modal__actions">
              <button
                type="button"
                className="change-password-modal__btn change-password-modal__btn--primary"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChangePassword;
