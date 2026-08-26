import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "./verify-email.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    const token = searchParams.get("token");
    console.log("Verification token:", token);

    verificationStarted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/verify-email?token=${encodeURIComponent(token)}`,
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.message || "Email verification failed.");
          return;
        }

        setStatus("success");
        setMessage(data.message);
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-card">
        {status === "verifying" && (
          <>
            <div className="verify-email-spinner" aria-hidden="true" />
            <h1 className="verify-email-panel__title">Verifying email</h1>
            <p className="verify-email-panel__subtitle">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="verify-email-panel__title">Email verified</h1>
            <p className="verify-email-panel__message">
              {message || "Your email has been verified successfully."}
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="verify-email-panel__title">Verification failed</h1>
            <p className="verify-email-panel__message verify-email-panel__message--error">
              {message}
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
            <p className="login-footer">
              <Link className="login-footer-link" to="/register">
                Back to Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
