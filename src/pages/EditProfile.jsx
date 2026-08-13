import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./editprofile.css";
import { FaCamera, FaCalendarAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const EditProfile = () => {
  const {user} =useContext(AuthContext);
  return (
    <div className="editprofile-page">
      <Sidebar />

      <div className="editprofile-main">
        <Header title="Edit Profile" />

        <main className="editprofile-content">
          <section className="editprofile-header">
            <div className="editprofile-header__avatar-wrap">
              <img
                className="editprofile-header__avatar"
                src=""
                alt={user?.name}
              />
              <button type="button" className="editprofile-header__photo-btn">
                <FaCamera />
                Change Photo
              </button>
            </div>
            <div className="editprofile-header__info">
              <h1>{user?.name}</h1>
              <p>Update your personal information</p>
            </div>
          </section>

          <div className="editprofile-sections">
            <section className="editprofile-card">
              <h2 className="editprofile-card__title">Personal Information</h2>

              <div className="editprofile-field">
                <label className="editprofile-label" htmlFor="full-name">
                  Full name
                </label>
                <input
                  id="full-name"
                  type="text"
                  className="editprofile-input"
                  defaultValue={user?.name}
                 
                />
              </div>

              <div className="editprofile-field">
                <label className="editprofile-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="editprofile-input"
                  defaultValue={user?.email}
                  readOnly
                />
              </div>
            </section>

            <section className="editprofile-card">
              <h2 className="editprofile-card__title">Profile Information</h2>

              <div className="editprofile-readonly">
                <div className="editprofile-readonly__row">
                  <span className="editprofile-readonly__label">
                    <FaCalendarAlt className="editprofile-readonly__icon" />
                    Join date
                  </span>
                  <span className="editprofile-readonly__value">
                    March 12, 2024
                  </span>
                </div>

                <div className="editprofile-readonly__row">
                  <span className="editprofile-readonly__label">
                    Account status
                  </span>
                  <span className="editprofile-chip editprofile-chip--success">
                    Active
                  </span>
                </div>
              </div>
            </section>

            <div className="editprofile-actions">
              <button
                type="button"
                className="editprofile-btn editprofile-btn--primary"
              >
                Save Changes
              </button>
              <Link
                to="/profile"
                className="editprofile-btn editprofile-btn--ghost"
              >
                Cancel
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
