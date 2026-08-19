import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./editprofile.css";
import { FaCamera, FaCalendarAlt } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState();
  const [name, setName] = useState(user?.name || "");

  // Tracks whether the profile is currently being saved, this prevents the user from submitting the same request multiple times.
  const [saving, setSaving] = useState(false);

  // Acts as an immediate lock to prevent duplicate save request. Unlike state, ref updates immediately without waiting for  a re-render.
  const savingRef = useRef(false);

  // Tracks whether the profile image is currently being deleted. Used to update the btn UI while the request is running
  const [deleting, setDeleting] = useState(false);

  // Acts as immediate lock to  prevent duplicate delete requests
  const deletingRef = useRef(false);

  const handleSave = async () => {
    // Prevent duplicate requests if the user clicks Save multiple times
    if (savingRef.current) return;

    // Lock the save operation immediately.
    savingRef.current = true;

    // Update the UI to show that saving is in progress.
    setSaving(true);

    try {
      // Create a FormData object so we can send both text data and a file
      const formData = new FormData();

      formData.append("name", name);

      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to update profile:", data);
        return;
      }

      // Update the global authenticated user with the new profile data
      setUser(data.user);

      console.log("Updated user:", data.user);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      // Replace the request lock so the user can save again.
      savingRef.current = false;

      // Return the button to its  normal state.
      setSaving(false);
    }
  };

  //Delete the user's current profile image.
  // The backend removes the image from Cloudinary and clears
  // the image URL and public ID from the database.
  const handleDeletePhoto = async () => {
    // Prevent multiple delete requests from being sent at the same time.
    if (deletingRef.current) return; // Lock the delete operation immediately.

    deletingRef.current = true; // Update the UI to show that deletion is in progress.

    setDeleting(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/users/me/avatar",
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      console.log("Delete photo response status:", response.status);

      const data = await response.json(); // Stop if the backend returned an error.

      if (!response.ok) {
        console.error("Failed to delete profile image:", data);
        return;
      }

      console.log("Profile image deleted:", data); // Remove the image from the global user state immediately.

      setUser((currentUser) => ({
        ...currentUser,
        profile_image_url: null,
        profile_image_public_id: null,
      })); // Clear any locally selected image.

      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to delete profile image:", error);
    } finally {
      // Release the request lock so deletion can be performed again later.
      deletingRef.current = false; // Return the button to its normal state.

      setDeleting(false);
    }
  };

  return (
    <div className="editprofile-page">
      <Sidebar />

      <div className="editprofile-main">
        <Header title="Edit Profile" />

        <main className="editprofile-content">
          <section className="editprofile-header">
            <div className="editprofile-header__avatar-wrap">
              <div className="editprofile-header__avatar">
                {selectedImage || user?.profile_image_url ? (
                  <img
                    className="editprofile-header__avatar-image"
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : user.profile_image_url
                    }
                    alt={user?.name}
                  />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setSelectedImage(file);
                  }
                }}
              />

              <button
                type="button"
                className="editprofile-header__photo-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaCamera />
                Change Photo
              </button>

              <button
                type="button"
                className="editprofile-header__delete-btn"
                onClick={handleDeletePhoto}
                disabled={deleting}
              >
                <MdDeleteSweep />
                {deleting ? "Deleting..." : " Delete Photo"}
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
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
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
                  </span>
                </div>

                <div className="editprofile-readonly__row">
                  <span className="editprofile-readonly__label">
                    Account status
                  </span>

                  <span
                    className={`editprofile-chip ${
                      user?.account_status === "active"
                        ? "editprofile-chip--success"
                        : "editprofile-chip--warning"
                    }`}
                  >
                    {user?.account_status}
                  </span>
                </div>
              </div>
            </section>

            <div className="editprofile-actions">
              <button
                type="button"
                className="editprofile-btn editprofile-btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
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
