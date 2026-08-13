import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Tracks whether the initial authentication check is  still running
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is an authenticated user when the app starts
    fetch("http://localhost:3000/api/users/me", {
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
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
        // Stop loading even if the authentication check fails
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
