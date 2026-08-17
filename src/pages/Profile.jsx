import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./profile.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-main">
        <Header title="Profile" />

        <main className="profile-content">
          <div className="profile-layout">
            {/* Profile side panel */}
            <aside className="profile-aside">
              <div className="profile-aside__identity">
                <div className="profile-aside__avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <h2 className="profile-aside__name">{user?.name}</h2>

                <span className="profile-aside__badge">TaskFlow User</span>

                <Link className="profile-aside__edit" to="/editprofile">
                  Edit Profile
                </Link>
              </div>
            </aside>

            {/* Main profile content */}
            <div className="profile-details">
              <header className="profile-details__header">
                <h1>Profile Overview</h1>
                <p>Manage your personal information and account preferences.</p>
              </header>

              {/* Cards grid */}
              <div className="profile-cards">
                {/* Personal Information */}
                <section id="personal" className="profile-card">
                  <h3 className="profile-card__title">Personal Information</h3>
                  <dl className="profile-info">
                    <div className="profile-info__row">
                      <dt>Full name</dt>
                      <dd>{user?.name}</dd>
                    </div>
                    <div className="profile-info__row">
                      <dt>Email</dt>
                      <dd>{user?.email}</dd>
                    </div>
                    <div className="profile-info__row">
                      <dt>
                        <FaCalendarAlt className="profile-info__icon" /> Join
                        date
                      </dt>
                      <dd>
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* Account Status */}
                <section className="profile-card">
                  <h3 className="profile-card__title">Account Status</h3>
                  <ul className="profile-status-list">
                    <li className="profile-status-item">
                      <span>Email verification</span>

                      <span
                        className={`profile-chip ${
                          user?.email_verified
                            ? "profile-chip--success"
                            : "profile-chip--warning"
                        }`}
                      >
                        {user?.email_verified ? "Verified" : "Not verified"}
                      </span>
                    </li>
                    <li className="profile-status-item">
                      <span>Account status</span>

                      <span
                        className={`profile-chip ${
                          user?.account_status === "active"
                            ? "profile-chip--success"
                            : "profile-chip--warning"
                        }`}
                      >
                        {user?.account_status}
                      </span>
                    </li>
                    <li className="profile-status-item">
                      <span>Last login</span>
                      <span className="profile-status-item__meta">
                        <dd>
                          {user?.last_login
                            ? new Date(user.last_login).toLocaleString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                },
                              )
                            : "—"}
                        </dd>
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Security */}
                <section id="security" className="profile-card">
                  <h3 className="profile-card__title">Security</h3>
                  <div className="profile-setting">
                    <div>
                      <p className="profile-setting__label">Change Password</p>
                      <p className="profile-setting__hint">
                        Update your password regularly
                      </p>
                    </div>

                    <Link
                      className="profile-btn profile-btn--ghost"
                      to="/resetpassword"
                    >
                      Change
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
