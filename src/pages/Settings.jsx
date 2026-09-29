import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./settings.css";
import {
  FaEnvelope,
  FaLock,
  FaMoon,
  FaGlobe,
  FaBell,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // Controls the Delete Account confirmation UI.
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Stores the password entered to confirm account deletion.
  const [deletePassword, setDeletePassword] = useState("");

  // Stores any error returned during account deletion.
  const [deleteError, setDeleteError] = useState("");

  // Prevents multiple delete requests while the account is being deleted.
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Stores the user's settings loaded from the backend.
  // These values will control the switches and language dropdown.
  const [settings, setSettings] = useState({
    dark_mode: 0,
    language: "en",
    email_notifications: 1,
    task_reminders: 1,
  });

  const { clearUser } = useContext(AuthContext);

  // Load the authenticated user's saved settings from the backend.
  // The session cookie identifies which user's settings should be returned.
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/me/settings",
          {
            // Send the session cookie with the request.
            credentials: "include",
          },
        );

        const data = await response.json();

        // Stop if the backend rejected the request.
        if (!response.ok) {
          console.error("Failed to load settings:", data.message);
          return;
        }

        // Replace the default settings with the values saved in SQLite.
        setSettings(data.settings);
      } catch (error) {
        // Handle network/server connection errors.
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  // Sync the saved Dark Mode setting with the global <html> element.
  // Tailwind will use the "dark" class to apply dark-mode styles across the app.
  useEffect(() => {
    // Debug: verify the saved Dark Mode value reaching this effect.
    console.log("Dark Mode value:", settings.dark_mode);
    // console.log(
    //   "document.documentElement.classList.contains('dark')",
    //   document.documentElement.classList.contains("dark"),
    // );

    // console.log(
    //   "Dark Mode value:",
    //   settings.dark_mode,
    //   "Type:",
    //   typeof settings.dark_mode,
    // );
  // Add "dark" when Dark Mode is enabled, otherwise remove it.
  document.documentElement.classList.toggle(
    "dark",
    settings.dark_mode === 1,
  );
 // Confirm the actual class currently applied to <html>.
  console.log(
    "HTML has dark:",
    document.documentElement.classList.contains("dark"),
  );
// Debug


    
   document.documentElement.classList.toggle("dark", settings.dark_mode === 1);
  }, [settings.dark_mode]);

  // Update one user setting in the backend.
  // This keeps the frontend state and SQLite database synchronized.
  const handleSettingChange = async (setting, value) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/me/settings",
        {
          method: "PATCH",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          // Send only the setting that changed.
          body: JSON.stringify({
            [setting]: value,
          }),
        },
      );

      const data = await response.json();

      // Stop if the backend rejected the update.
      if (!response.ok) {
        console.error("Failed to update setting:", data.message);
        return;
      }

      // Use the updated values returned by the backend.
      // This keeps React state synchronized with SQLite.
      setSettings(data.settings);
    } catch (error) {
      // Handle network/server connection errors.
      console.error("Failed to update setting:", error);
    }
  };

  // Delete the currently authenticated user's account.
  // The backend requires the user's password before performing the deletion.
  const handleDeleteAccount = async () => {
    // Prevent sending the request without a password.
    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }

    // Show loading state and clear any previous error.
    setIsDeletingAccount(true);
    setDeleteError("");

    try {
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "DELETE",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          // Send only the password needed to confirm account deletion.
          password: deletePassword,
        }),
      });

      const data = await response.json();

      // Display the backend error if the deletion was rejected.
      if (!response.ok) {
        setDeleteError(data.message || "Account deletion failed");
        return;
      }

      // The account was deleted successfully.
      // Close the confirmation modal and clear the password from component state.
      setShowDeleteAccount(false);
      setDeletePassword("");

      // Remove the deleted account from frontend authentication state.
      clearUser();

      // Redirect the user to Login because the session was destroyed by the backend.
      navigate("/login");
    } catch {
      // Handle network/server connection errors.
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      // Re-enable the Delete button after the request finishes.
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="dashboard-page settings-page">
      <Sidebar />

      <div className="dashboard-main">
        <Header title="Settings" />

        <main className="settings-content">
          <header className="settings-header">
            <h1>Settings</h1>
            <p>Manage your TaskFlow account and preferences.</p>
          </header>

          <div className="settings-sections">
            {/* Account Settings */}
            <section className="settings-card">
              <h2 className="settings-card__title">Account Settings</h2>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaEnvelope className="settings-row__icon" />
                    Email address
                  </p>
                  <p className="settings-row__hint">
                    Your login email for TaskFlow
                  </p>
                </div>
                <p className="settings-row__value">{user?.email}</p>
              </div>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">Account status</p>
                  <p className="settings-row__hint">
                    Your account is active and verified
                  </p>
                </div>

                <span
                  className={`settings-chip ${
                    user?.account_status === "active"
                      ? "settings-chip--success"
                      : "settings-chip--warning"
                  }`}
                >
                  {user?.account_status}
                </span>
              </div>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaLock className="settings-row__icon" />
                    Password
                  </p>
                  <p className="settings-row__hint">
                    Update your account password
                  </p>
                </div>

                <Link
                  className="settings-btn settings-btn--ghost"
                  to="/changepassword"
                >
                  Change password
                </Link>
              </div>
            </section>

            {/* Appearance */}
            <section className="settings-card">
              <h2 className="settings-card__title">Appearance</h2>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaMoon className="settings-row__icon" />
                    Dark mode
                  </p>
                  <p className="settings-row__hint">
                    Use dark theme across the app
                  </p>
                </div>
                <label className="settings-switch">
                  {/* Keep the Dark Mode switch connected to the settings state. */}
                  <input
                    type="checkbox"
                    checked={settings.dark_mode === 1}
                    // Update Dark Mode locally and save the new value in SQLite.
                    onChange={(e) => {
                      const value = e.target.checked ? 1 : 0;

                      // Update the UI immediately.
                      setSettings({
                        ...settings,
                        dark_mode: value,
                      });

                      // Save the changed setting in the backend.
                      handleSettingChange("dark_mode", value);
                    }}
                  />
                  <span className="settings-switch__slider" />
                </label>
              </div>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaGlobe className="settings-row__icon" />
                    Language
                  </p>
                  <p className="settings-row__hint">
                    Choose your preferred language
                  </p>
                </div>
                {/* Keep the language dropdown synchronized with the backend settings. */}
                <select
                  className="settings-select"
                  value={settings.language}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Update the selected language immediately in the UI.
                    setSettings({
                      ...settings,
                      language: value,
                    });

                    // Save the new language in SQLite.
                    handleSettingChange("language", value);
                  }}
                >
                  <option value="en">English</option>
                  <option value="nl">Dutch</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
            </section>

            {/* Notifications */}
            <section className="settings-card">
              <h2 className="settings-card__title">Notifications</h2>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaBell className="settings-row__icon" />
                    Email notifications
                  </p>
                  <p className="settings-row__hint">
                    Receive updates about your account
                  </p>
                </div>
                <label className="settings-switch">
                  {/* Keep Email Notifications synchronized with the saved backend setting. */}
                  <input
                    type="checkbox"
                    checked={settings.email_notifications === 1}
                    onChange={(e) => {
                      const value = e.target.checked ? 1 : 0;

                      // Update the UI immediately.
                      setSettings({
                        ...settings,
                        email_notifications: value,
                      });

                      // Save the new value in SQLite.
                      handleSettingChange("email_notifications", value);
                    }}
                  />
                  <span className="settings-switch__slider" />
                </label>
              </div>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaClock className="settings-row__icon" />
                    Task reminders
                  </p>
                  <p className="settings-row__hint">
                    Get reminded about upcoming tasks
                  </p>
                </div>
                <label className="settings-switch">
                  {/* Keep Task Reminders synchronized with the saved backend setting. */}
                  <input
                    type="checkbox"
                    checked={settings.task_reminders === 1}
                    onChange={(e) => {
                      const value = e.target.checked ? 1 : 0;

                      // Update the UI immediately.
                      setSettings({
                        ...settings,
                        task_reminders: value,
                      });

                      // Save the new value in SQLite.
                      handleSettingChange("task_reminders", value);
                    }}
                  />
                  <span className="settings-switch__slider" />
                </label>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="settings-card settings-card--danger">
              <h2 className="settings-card__title settings-card__title--danger">
                <FaExclamationTriangle className="settings-card__title-icon" />
                Danger Zone
              </h2>

              <div className="settings-row settings-row--danger">
                <div className="settings-row__info">
                  <p className="settings-row__label">Delete account</p>
                  <p className="settings-row__hint">
                    Permanently remove your account and all task data
                  </p>
                </div>
                {/* Open the Delete Account confirmation UI. The actual
                deletion will happen only after password confirmation. */}
                <button
                  type="button"
                  className="settings-btn settings-btn--danger"
                  onClick={() => {
                    setShowDeleteAccount(true);
                    setDeleteError("");
                  }}
                >
                  Delete account
                </button>
              </div>
            </section>

            {/* Delete Account confirmation modal */}
            {showDeleteAccount && (
              <div className="delete-account-modal">
                <div className="delete-account-modal__content">
                  <h2 className="delete-account__title">
                    Delete your account?
                  </h2>

                  <p className="delete-account__message">
                    This action is permanent. Your TaskFlow account will be
                    deleted.
                  </p>

                  <label
                    htmlFor="delete-password"
                    className="delete-account__label"
                  >
                    Enter your password to continue
                  </label>

                  <div className="form-input-wrap">
                    <input
                      id="delete-password"
                      type={!showPassword ? "password" : "text"}
                      name="delete-password"
                      className="form-input"
                      value={deletePassword}
                      onChange={(e) => {
                        //  Keep the password used to confirm account deletion in component state.
                        setDeletePassword(e.target.value);

                        // Clear the previous error once the user starts correcting the input.
                        setDeleteError("");
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="form-input__eye"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Display an API or validation error when deletion fails. */}
                  {deleteError && <p className="form-error">{deleteError}</p>}

                  <div className="delete-account-modal__actions">
                    <button
                      type="button"
                      className="settings-btn settings-btn--secondary"
                      onClick={() => {
                        // Close the confirmation UI without deleting anything.
                        setShowDeleteAccount(false);

                        // Clear sensitive password data from memory.
                        setDeletePassword("");

                        // Clear any previous error.
                        setDeleteError("");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="settings-btn settings-btn--danger"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount ? "Deleting..." : "Delete account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
