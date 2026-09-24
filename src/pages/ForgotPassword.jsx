import "./forgot-password.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { validateEmail } from "../utils/validators";

const ForgotPassword = () => {
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

  // to ask if the object has errors
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

      // Parse the response
      const data = await response.json();

      // Check if the response is not ok
      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage(data.message);
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
  }
};


  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1 className="forgot-panel__title">Forgot your password?</h1>
        <p className="forgot-panel__subtitle">
          Enter your Email to access your account.
        </p>
        <form onSubmit={handleForgot}>
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
              value={forgotData.email}
              onChange={(e) => {
                setForgotData({ ...forgotData, email: e.target.value });
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

          <button type="submit" className="btn btn--primary">
            Send Email
          </button>

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}
        </form>
        <p className="login-footer">
          <Link className="login-footer-link" to="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
