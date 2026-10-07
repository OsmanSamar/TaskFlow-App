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
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

const Settings = () => {
  const { t, i18n } = useTranslation();
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
        <Header title={t("settings.title")} />

        <main className="settings-content">
          <header className="settings-header">
            <h1>{t("settings.title")}</h1>
            <p>{t("settings.description")}</p>
          </header>

          <div className="settings-sections">
            {/* Account Settings */}
            <section className="settings-card">
              <h2 className="settings-card__title">
                {" "}
                {t("settings.account.title")}
              </h2>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaEnvelope className="settings-row__icon" />
                    {t("settings.account.email")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.account.emailHint")}
                  </p>
                </div>
                <p className="settings-row__value">{user?.email}</p>
              </div>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    {t("settings.account.status")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.account.statusHint")}
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
                    {t("settings.account.password")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.account.passwordHint")}
                  </p>
                </div>

                <Link
                  className="settings-btn settings-btn--ghost"
                  to="/changepassword"
                >
                  {t("settings.account.changePassword")}
                </Link>
              </div>
            </section>

            {/* Appearance */}
            <section className="settings-card">
              <h2 className="settings-card__title">
                {t("settings.appearance.title")}
              </h2>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaMoon className="settings-row__icon" />
                    {t("settings.appearance.darkMode")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.appearance.darkModeHint")}
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

                      // Apply Dark Mode globally.
                      document.documentElement.classList.toggle(
                        "dark",
                        value === 1,
                      );

                      // Remember the selected theme after refresh.
                      localStorage.setItem("darkMode", String(value === 1));

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
                    {t("settings.language")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.languageHint")}
                  </p>
                </div>
                {/* Keep the language dropdown synchronized with the backend settings. */}
                <select
                  className="settings-select"
                  value={settings.language}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Update the language in the i18n system immediately.
                    i18n.changeLanguage(value);

                    // Update the UI state immediately.
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
              <h2 className="settings-card__title">
                {t("settings.notifications.title")}
              </h2>

              <div className="settings-row">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    <FaBell className="settings-row__icon" />
                    {t("settings.notifications.email")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.notifications.emailHint")}
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
                    {t("settings.notifications.reminders")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.notifications.remindersHint")}
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
                {t("settings.danger.title")}
              </h2>

              <div className="settings-row settings-row--danger">
                <div className="settings-row__info">
                  <p className="settings-row__label">
                    {" "}
                    {t("settings.danger.delete")}
                  </p>
                  <p className="settings-row__hint">
                    {t("settings.danger.deleteHint")}
                  </p>
                </div>
                {/* Open the Delete Account confirmation UI. The actual
                deletion will happen only after password confirmation. */}
                <Button
                  type="button"
                  className="settings-btn settings-btn--danger"
                  onClick={() => {
                    setShowDeleteAccount(true);
                    setDeleteError("");
                  }}
                >
                  {t("settings.danger.delete")}
                </Button>
              </div>
            </section>

            {/* Delete Account confirmation modal */}
            {showDeleteAccount && (
              <div className="delete-account-modal">
                <div className="delete-account-modal__content">
                  <h2 className="delete-account__title">
                    {t("settings.danger.confirmTitle")}
                  </h2>

                  <p className="delete-account__message">
                    {t("settings.danger.confirmMessage")}
                  </p>

                  <label
                    htmlFor="delete-password"
                    className="delete-account__label"
                  >
                    {t("settings.danger.enterPassword")}
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

                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn--password-eye"
                      aria-label={
                        showPassword
                          ? t("settings.danger.hidePassword")
                          : t("settings.danger.showPassword")
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
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
                      {t("settings.danger.cancel")}
                    </button>

                    <button
                      type="button"
                      className="settings-btn settings-btn--danger"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount
                        ? t("settings.danger.deleting")
                        : t("settings.danger.delete")}
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
