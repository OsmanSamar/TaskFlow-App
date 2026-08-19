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

  //Handles saving the user's profile changes
  const handleSave = async () => {
    // Create a FormData object so we can send both text data and a file
    const formData = new FormData(); // Add the updated user's name to the form data

    formData.append("name", name); // Add the selected profile image only if the user chose a new image

    if (selectedImage) {
      formData.append("avatar", selectedImage);
    } // Send the profile changes to the backend

    const response = await fetch("http://localhost:3000/api/users/me", {
      // Use PUT because we are updating the authenticated user's profile
      method: "PUT", // Include the session cookie so the backend knows which user is logged in

      credentials: "include", // Send the name and image as multipart/form-data
      // The browser automatically sets the correct Content-Type boundary

      body: formData,
    }); // Check the HTTP status returned by the backend

    console.log("Response status:", response.status); // Convert the backend's JSON response into a JavaScript object

    const data = await response.json(); // Replace the old user data in AuthContext with the updated user data
    // This makes the new name and profile image available throughout the app

    setUser(data.user); // Display the updated user data for debugging/testing

    console.log("Updated user:", data.user); // Display the values that were prepared before sending the request
    // Useful for checking that the correct name and image were selected

    console.log("FormData prepared:", {
      name,
      selectedImage,
    });
  };

  //Delete the user's current profile image.
  // The backend removes the image from Cloudinary and clears
  // the image URL and public ID from the database.
  const handleDeletePhoto = async () => {
    const response = await fetch("http://localhost:3000/api/users/me/avatar", {
      method: "DELETE",
      credentials: "include",
    });

    console.log("Delete photo response status:", response.status);

    const data = await response.json();

    // Stop here if the backend returned an error
    if (!response.ok) {
      console.error("Failed to delete profile image:", data);
      return;
    }

    console.log("Profile image deleted:", data);

    // Remove the image from the current user state immediately
    // so the UI updates without requiring a page refresh.
    setUser((currentUser) => ({
      ...currentUser,
      profile_image_url: null,
      profile_image_public_id: null,
    }));

    // Clear any locally selected image as well
    setSelectedImage(null);
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
                  <span >
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
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
              >
                <MdDeleteSweep />
                Delete Photo
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
