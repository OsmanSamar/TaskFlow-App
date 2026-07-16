import { useState } from "react";
import { validatePassword, validateConfirmPassword } from "../utils/validators";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [restData, setRestData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRestData = (e) => {
    e.preventDefault();
    const newErrors = {};

    const passwordError = validatePassword(restData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const ConfirmpasswordError = validateConfirmPassword(
      restData.password,
      restData.confirmPassword,
    );
    if (ConfirmpasswordError) {
      newErrors.confirmPassword = ConfirmpasswordError;
    }

    setErrors(newErrors);

      // to ask if the object has errors
      if (Object.keys(newErrors).length === 0) {
        navigate("/login");
      }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-panel__title">Reset password </h1>
        <form onSubmit={handleRestData}>
          <div className="form-field">
            <label className="form-label" htmlFor="password">
              New password
            </label>
            <div className="form-input-wrap">
              <input
                id="password"
                type={!showPassword ? "password" : "text"}
                name="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                className={`form-input${errors.password ? " form-input--error" : ""}`}
                value={restData.password}
                onChange={(e) => {
                  setRestData({
                    ...restData,
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
              Re - enter password
            </label>
            <div className="form-input-wrap">
              <input
                id="confirmPassword"
                type={!showConfirmPassword ? "password" : "text"}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Enter your password"
                className={`form-input${errors.confirmPassword ? " form-input--error" : ""}`}
                value={restData.confirmPassword}
                onChange={(e) => {
                  setRestData({
                    ...restData,
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
           Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
