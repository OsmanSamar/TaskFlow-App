import { Link } from "react-router-dom";
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

const Settings = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="dashboard-page settings-page">
      <Sidebar />

      <div className="dashboard-main">
        <Header title="Settings" />

        <main className="dashboard-content settings-content">
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
                  to="/resetpassword"
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
                  <input type="checkbox" readOnly />
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
                <select className="settings-select" defaultValue="en">
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
                  <input type="checkbox" defaultChecked readOnly />
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
                  <input type="checkbox" defaultChecked readOnly />
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
                <button
                  type="button"
                  className="settings-btn settings-btn--danger"
                >
                  Delete account
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
