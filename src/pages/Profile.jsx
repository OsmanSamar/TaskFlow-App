import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./profile.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Profile = () => {
   const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-main">
        <Header title={t("profile.title")} />

        <main className="profile-content">
          <div className="profile-layout">
            {/* Profile side panel */}
            <aside className="profile-aside">
              <div className="profile-aside__identity">
                <div
                  className={`profile-avatar ${
                    user?.profile_image_url ? "profile-avatar--has-image" : ""
                  }`}
                >
                  {user?.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.name}
                      className="profile-avatar__image"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>

                <h2 className="profile-aside__name">{user?.name}</h2>

                <span className="profile-aside__badge">  {t("profile.userBadge")}</span>

                <Link className="profile-aside__edit" to="/editprofile">
                  {t("profile.edit")}
                </Link>
              </div>
            </aside>

            {/* Main profile content */}
            <div className="profile-details">
              <header className="profile-details__header">
                <h1>{t("profile.overview")}</h1>
                <p>{t("profile.description")}</p>
              </header>

              {/* Cards grid */}
              <div className="profile-cards">
                {/* Personal Information */}
                <section id="personal" className="profile-card">
                  <h3 className="profile-card__title"> {t("profile.personal.title")}</h3>
                  <dl className="profile-info">
                    <div className="profile-info__row">
                      <dt>{t("profile.personal.fullName")}</dt>
                      <dd>{user?.name}</dd>
                    </div>
                    <div className="profile-info__row">
                     <dt>{t("profile.personal.email")}</dt>
                      <dd>{user?.email}</dd>
                    </div>
                    <div className="profile-info__row">
                      <dt>
                        <FaCalendarAlt className="profile-info__icon" />   
                        {t("profile.personal.joinDate")}
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
                  <h3 className="profile-card__title"> 
                    {t("profile.accountStatus.title")}
                    </h3>
                  <ul className="profile-status-list">
                    <li className="profile-status-item">
                     
                     <span>{t("profile.accountStatus.emailVerification")}</span>

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
                     <span>{t("profile.accountStatus.status")}</span>

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
                     <span>{t("profile.accountStatus.lastLogin")}</span>
                      <span className="profile-status-item__meta">
                        {user?.last_login
                          ? new Date(user.last_login).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                    </li>
                  </ul>
                </section>

                {/* Security */}
                <section id="security" className="profile-card">
                  <h3 className="profile-card__title">{t("profile.security.title")}</h3>
                  <div className="profile-setting">
                    <div>
                      <p className="profile-setting__label"> {t("profile.security.changePassword")}</p>
                      <p className="profile-setting__hint">
                         {t("profile.security.passwordHint")}
                      </p>
                    </div>

                    <Link
                      className="profile-btn profile-btn--ghost"
                      to="/changepassword"
                    >
                       {t("profile.security.change")}
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
