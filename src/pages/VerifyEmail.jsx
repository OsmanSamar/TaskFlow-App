import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

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
    <div>
      {status === "verifying" && <p>Verifying your email...</p>}

      {status === "success" && (
        <>
          <h1>Email Verified!</h1>
          <p>{message}</p>

          <button type="button" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <h1>Verification Failed</h1>
          <p>{message}</p>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
