import "./forgot-password.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
      <h1 className="forgot-panel__title">Forgot your password?</h1>
          <p className="forgot-panel__subtitle">
            Enter your Email  to access your account.
          </p>
        <form>
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
              // value={}
            />
            {/* {errors.email ? (
              <span className="form-error ">{errors.email}</span>
            ) : (
              ""
            )} */}
          </div>

          <button type="submit" className="btn btn--primary">
            Send Email
          </button>
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
