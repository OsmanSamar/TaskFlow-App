
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import i18n from "../i18n";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Tracks whether the initial authentication check is still running
  const [loading, setLoading] = useState(true);

  // Stores an authentication error when the initial session check fails
  const [authError, setAuthError] = useState(null);

  // Clears the authenticated user from frontend state.
  // Used after logout or destructive actions such as account deletion
  const clearUser = () => {
    setUser(null);
  };

  useEffect(() => {
    // Restore Dark Mode immediately when the app starts.
    // This prevents Dark Mode from disappearing after a refresh.
    const savedDarkMode = localStorage.getItem("darkMode");

    document.documentElement.classList.toggle(
      "dark",
      savedDarkMode === "true",
    );

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

      .then(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);

          // Load the user's saved settings from the backend.
          const settingsResponse = await fetch(
            "http://localhost:3000/api/users/me/settings",
            {
              credentials: "include",
            },
          );

          if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json();
            const userSettings = settingsData.settings;

            // Apply the saved language globally.
            if (userSettings.language) {
              i18n.changeLanguage(userSettings.language);
            }
          }
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
    <AuthContext.Provider
      value={{
        user,
        setUser,
        clearUser,
        loading,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
