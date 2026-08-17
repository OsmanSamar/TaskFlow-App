import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SpinnerLoad from "./SpinnerLoad";

const ProtectedRoute = ({ children }) => {
  const { user, loading, authError } = useContext(AuthContext);

  // Wait for initial authentication check  to  finish
  if (loading) {
    return <SpinnerLoad />;
  }

  // Show an error if the authentication check failed
  if (authError) {
    return <div>Authentication error. Please try again.</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
