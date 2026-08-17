import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Tracks whether the initial authentication check is  still running
  const [loading, setLoading] = useState(true);

  // Stores an authentication error when the initial session check fails
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check if there is an authenticated user when the app starts
    fetch("http://localhost:3000/api/users/me", {
      credentials: "include",
    })
      .then(async (response) => {
        if (response.status === 401) {
          return null;
        }

        if (!response.ok) {
          throw new Error(`Authentication check failed: ${response.status}`);
        }

        const data = await response.json();
        return data.user;
      })

      .then((currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        }

        // Authentication check is complete
        setLoading(false);
      })

      .catch((error) => {
        console.error("Failed to restore authentication:", error);

        // Store the authentication error
        setAuthError(error.message);

        // Stop loading even if the authentication check fails
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};
