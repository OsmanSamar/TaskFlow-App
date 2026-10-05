// CRUD
import express from "express";
import { randomUUID, randomBytes } from "crypto";
import db from "../database/database.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { isValidEmail, isValidPassword } from "../utils/validators.js";
import multer from "multer";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";

// To check
// const password = "MyPassword@123";
// const hashedPassword = await bcrypt.hash(password, 10);
// console.log("Original password:", password);
// console.log("Hashed", hashedPassword);

// const isMatch = await bcrypt.compare("MyPassword@123", hashedPassword,);
// console.log("Password matches", isMatch);
// run node server/server.js
// output Password matches true/flase

const router = express.Router();
console.log("LOGIN ROUTE HIT");

const upload = multer({
  storage: multer.memoryStorage(),
});

// Get read Router
router.get("/", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();

  res.json(users);
});

// Post Create
router.post("/", async (req, res) => {
  // Validation
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  if (!req.body.email || !isValidEmail(req.body.email)) {
    return res.status(400).json({
      message: "A valid email is required",
    });
  }

  if (!req.body.password || !isValidPassword(req.body.password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number and specail charater",
    });
  }

  // Hash password before storing it in the database
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = {
    id: randomUUID(),
    name: req.body.name,
    email: req.body.email,
    created_at: new Date().toISOString(),
  };

  //Generate a secure random token for email verification
  const verificationToken = randomBytes(32).toString("hex");
  const verificationExpires = new Date(
    Date.now() + 15 * 60 * 1000,
  ).toISOString();

  // Create the email verification link using the verification token
  const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;

  console.log("Sending verification emai to:", newUser.email);
  console.log("verification URL", verificationUrl);

  //Send the email verification link to the new user
  await sendEmail({
    to: newUser.email,
    subject: "Verify your TaskFlow email",
    html: `
<h2>Welcome to TaskFlow!</h2>
<p>Please verify your email address by clicking the link below:</p>

<a href="${verificationUrl}">
Verify Email
</a>

<p>This link will expire in 15 minutes.</p>
`,
  });

  console.log("Verification email sent successfully");

  // try {
  //   db.prepare(`
  //   INSERT INTO users (id, name, email)
  //   VALUES (?, ?, ?)
  //   `).run(
  //   newUser.id,
  //   newUser.name,
  //   newUser.email,
  //   );
  //   } catch (error) {
  //   console.log(error);
  //   console.log("Error code:", error.code);
  //   }

  try {
    db.prepare(
      `
    INSERT INTO users (id, name, email, password, created_at, email_verification_token, email_verification_expires)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      newUser.id,
      newUser.name,
      newUser.email,
      hashedPassword,
      newUser.created_at,
      verificationToken,
      verificationExpires,
    );
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    console.log("Database error:", error);
    console.log("Error code:", error.code);

    return res.status(500).json({
      message: "Database error",
    });
  }
  // Return user data without password or password hash
  res.status(201).json(newUser);

  // 201 means Succesfully created new user
});

//Verify user's email address using token sent by email

router.get("/verify-email", (req, res) => {
  const { token } = req.query;

  console.log("Token received by backend: ", token);

  // Check if a verification token was provided
  if (!token) {
    return res.status(400).json({
      message: "Verification token is required",
    });
  }

  // Find the user using the verification token
  const user = db
    .prepare(
      `
      SELECT id, email, email_verified, email_verification_expires
      FROM users
      WHERE email_verification_token = ?
    `,
    )
    .get(token);

  console.log("User found token : ", user);

  // Token does not exist or was already used
  if (!user) {
    return res.status(400).json({
      message: "Invalid verification token",
    });
  }

  // Check if the token has expired
  if (
    !user.email_verification_expires ||
    new Date(user.email_verification_expires) < new Date()
  ) {
    return res.status(400).json({
      message: "Verification token has expired",
    });
  }

  // Mark the user's email as verified
  // Clear the token so the verification link caant be reused
  db.prepare(
    `
    UPDATE users
    SET email_verified = 1,
        email_verification_token = NULL,
        email_verification_expires = NULL
    WHERE id = ?
  `,
  ).run(user.id);

  // Email verification successful
  res.json({
    message: "Email verified successfully",
  });
});

// Login user(POST)
// Cretae endpoint for login
router.post("/login", async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  const { email, password, rememberMe } = req.body;
  // RememberMe controls how long the session cookie should  remain active

  // Validation
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      message: "A valid email is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  // Find user by email
  const user = db.prepare("SELECT * FROM users WHERE email =?").get(email);

  if (!user) {
    return res.status(401).json({
      message: "Login incorrect",
    });
  }

  // Compare entered password with sorted bcrypt hash
  const isMatch = await bcrypt.compare(password, user.password);
  // console.log("Password match:", isMatch);

  // Check if the entered password matches the hashed password stored in the database
  if (!isMatch) {
    const result = db
      .prepare(
        `
    UPDATE users
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE id = ?
  `,
      )
      .run(user.id);

    const failedAttempts = result.changes
      ? db
          .prepare("SELECT failed_login_attempts FROM users WHERE id = ?")
          .get(user.id).failed_login_attempts
      : 0;

    if (failedAttempts === 3 && user.email_notifications === 1) {
      await sendEmail({
        to: user.email,
        subject: "Security alert: Failed login attempts",
        html: `
        <h2>Security Alert</h2>
        <p>There have been 3 failed login attempts on your TaskFlow account.</p>
        <p>If this was not you, we recommend changing your password immediately.</p>
      `,
      });
    }

    return res.status(401).json({
      message: "Login incorrect",
    });
  }

  // Check if the user's email has been verified.

  // console.log("Email verified value:", user.email_verified);

  if (!user.email_verified) {
    return res.status(403).json({
      message: "Please verify your email before logging in.",
    });
  }

  // Store the authenticated user's ID in the session
  // This allows the server to remember the logged-in user
  req.session.userId = user.id;

  // Log the session user ID to confirm that login creates an authenticated session.
  console.log("SESSION USER ID:", req.session.userId);

  // Log the session user ID to confirm that login creates an authenticated session.
  // This log message is used for debugging and can be removed in production.
  req.session.cookie.maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 //Remember Me: 30 days
    : 30 * 60 * 1000; //Default: 30 minutes

  //  Debug: verify the session duration selected by Remember Me checkbox
  //  console.log("RememberMe:", rememberMe,"Cookie maxAge:", req.session.cookie.maxAge)

  // Update the user's last login time
  const lastLogin = new Date().toISOString();
  db.prepare(
    `
  UPDATE users
  SET last_login = ?, failed_login_attempts = 0
  WHERE id = ?
`,
  ).run(lastLogin, user.id);
  console.log("Last login:", lastLogin);

  // Send email notification if email notifications are enabled
  // This alerts the user of a new login, helping to prevent unauthorized access.
  if (user.email_notifications === 1) {
    await sendEmail({
      to: user.email,
      subject: "New login to your TaskFlow account",
      html: `
      <h2>New login detected</h2>
      <p>Your TaskFlow account was just accessed.</p>
      <p>If this was not you, please change your password immediately.</p>
    `,
    });
  }

  // Login successful
  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
  });
});

// Forgot password (POST)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Validation
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      message: "A valid email is required",
    });
  }

  // Find user by email
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Create a secure password reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Token expires after 15 minutes
  const resetExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  // Save reset token and expiration
  db.prepare(
    `
    UPDATE users
    SET password_reset_token = ?,
        password_reset_expires = ?
    WHERE id = ?
  `,
  ).run(resetToken, resetExpires, user.id);

  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  // Send email with reset link
  await sendEmail({
    to: user.email,
    subject: "Reset your TaskFlow password",
    html: `
    <h2>Reset your TaskFlow password</h2>
    <p>You requested to reset your password.</p>
    <p>This link will expire in 15 minutes.</p>
    <a href="${resetLink}">Reset Password</a>
  `,
  });

  res.json({
    message: "Password reset token created",
  });
});

// Reset password (POST)
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  console.log("Reset password request:", { token, password });

  // Validation
  if (!token || !password) {
    return res.status(400).json({
      message: "Token and password are required",
    });
  }

  const user = db
    .prepare(
      `SELECT * FROM users WHERE password_reset_token= ? AND password_reset_expires > ?`,
    )
    .get(token, new Date().toISOString());

  // Check if user exists and token is valid
  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired reset token",
    });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user's password

  db.prepare(
    `
    UPDATE users
    SET password = ?, 
        password_reset_token = NULL,
        password_reset_expires = NULL
    WHERE id = ?
  `,
  ).run(hashedPassword, user.id);

  res.json({
    message: "Password has been reset successfully",
  });
});

//Get the currently authenticated user
// Uses the user ID stored in the session
router.get("/me", (req, res) => {
  // Check if a user ID exists in the current session
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Find the user by the ID stored in the session
  const user = db
    .prepare(
      "SELECT id, name, email, created_at, last_login, account_status, email_verified, profile_image_url, profile_image_public_id  FROM users WHERE id = ?",
    )
    .get(req.session.userId);

  // The user may have been deleted after the session was created
  if (!user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Return the authenticated user's safe data
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      last_login: user.last_login,
      account_status: user.account_status,
      email_verified: user.email_verified,
      profile_image_url: user.profile_image_url,
      profile_image_public_id: user.profile_image_public_id,
    },
  });
});

// Get settings for the currently authenticated user.
// The session user ID determines which user's settings can be read.
router.get("/me/settings", (req, res) => {
  // Check if the user is authenticated.
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Read only the settings fields needed by the frontend.
  const settings = db
    .prepare(
      `
      SELECT dark_mode, language, email_notifications, task_reminders
      FROM users
      WHERE id = ?
    `,
    )
    .get(req.session.userId);

  // The user may have been deleted while the session still exists.
  if (!settings) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Return the authenticated user's current settings.
  res.json({
    settings: {
      dark_mode: settings.dark_mode,
      language: settings.language,
      email_notifications: settings.email_notifications,
      task_reminders: settings.task_reminders,
    },
  });
});

// Update settings for the currently authenticated user.
// The session user ID ensures users can only modify their own settings.
router.patch("/me/settings", (req, res) => {
  // Check if the user is authenticated.
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Get the settings sent by the frontend.
  const { dark_mode, language, email_notifications, task_reminders } = req.body;

  // Validate boolean-style settings when they are provided.
  // SQLite stores these values as 0 or 1.
  if (dark_mode !== undefined && dark_mode !== 0 && dark_mode !== 1) {
    return res.status(400).json({
      message: "dark_mode must be 0 or 1",
    });
  }

  if (
    email_notifications !== undefined &&
    email_notifications !== 0 &&
    email_notifications !== 1
  ) {
    return res.status(400).json({
      message: "email_notifications must be 0 or 1",
    });
  }

  if (
    task_reminders !== undefined &&
    task_reminders !== 0 &&
    task_reminders !== 1
  ) {
    return res.status(400).json({
      message: "task_reminders must be 0 or 1",
    });
  }

  // Only allow the languages supported by the application.
  if (language !== undefined && !["en", "nl", "ar"].includes(language)) {
    return res.status(400).json({
      message: "Unsupported language",
    });
  }
  // Update only the settings that were actually provided.
  // COALESCE keeps the existing database value for fields not included
  // in the request.
  db.prepare(
    `
    UPDATE users
    SET
      dark_mode = COALESCE(?, dark_mode),
      language = COALESCE(?, language),
      email_notifications = COALESCE(?, email_notifications),
      task_reminders = COALESCE(?, task_reminders)
    WHERE id = ?
  `,
  ).run(
    dark_mode,
    language,
    email_notifications,
    task_reminders,
    req.session.userId,
  );

  // Return the updated settings so the frontend can use the new values.
  const updatedSettings = db
    .prepare(
      `
      SELECT dark_mode, language, email_notifications, task_reminders
      FROM users
      WHERE id = ?
    `,
    )
    .get(req.session.userId);

  // The user may have been deleted while the session was active.
  if (!updatedSettings) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  res.json({
    message: "Settings updated successfully",
    settings: updatedSettings,
  });
});

// Change the Password of currently authenticated user
router.patch("/me/password", async (req, res) => {
  // Check if the user is authenticated.
  // The session user ID tells us which account is allowed to change its password.
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }
  // Get the current and new password sent by the frontend.
  const { currentPassword, newPassword, confirmPassword } = req.body; // Validate that all password fields were provided.

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "All password fields are required",
    });
  }
  //Validate the new password against the application's rules,
  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 charachters and include uppercase, number and special charachter",
    });
  }

  // Make sure the confirmation matches the new password.
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  //Find the currently authenticated user by the ID  stored in the session.
  // We only select the password hash because that is all we need for verification.
  const user = db
    .prepare(
      "SELECT id, password, email, email_notifications FROM users WHERE id = ?",
    )
    .get(req.session.userId);

  //The user may have been deleted after  the session was created.
  if (!user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  //Compare the current password entered by the uuser
  // With the bcrypt hash stored in the db.
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  //  Stop the password change if the current password is incorrect
  if (!isCurrentPasswordValid) {
    return res.status(401).json({
      message: "Current password is incorrect",
    });
  }

  //Temporary debugs response.
  //THis confirms that the current password was verified successfully.
  // console.log("Current password verification passed");
  // return res.json({
  //   message:"Current password is correct",
  // });

  //Hash the new password before storing it in the db
  //We never store  the user's plain-text password.
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  //  Update the user's password  with new bcrypt hash

  db.prepare("UPDATE users SET password = ? WHERE ID =? ").run(
    hashedNewPassword,
    req.session.userId,
  );

  // Send email notification if email notifications are enabled
  if (user.email_notifications === 1) {
    await sendEmail({
      to: user.email,
      subject: "Your TaskFlow password was changed",
      html: `
      <h2>Password changed</h2>
      <p>Your TaskFlow account password was successfully changed.</p>
      <p>If you did not make this change, please contact support immediately.</p>
    `,
    });
  }

  // Return a success response after the password has been updated.
  res.json({
    message: "Password change successfully",
  });
});

// Delete the currently authenticated user's account
router.delete("/me", async (req, res) => {
  // Make sure the user is authenticated before allowing account deletion.
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Get the password entered by the user to confirm account deletion.
  const { password } = req.body;

  // A password is required because deleting an account is a destructive action.
  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  // Get the user's password hash and Cloudinary image ID.
  // We need the password to confirm deletion and the image ID to clean up
  // the user's uploaded profile image after the account is deleted.
  const user = db
    .prepare(
      `
    SELECT id, password, profile_image_public_id
    FROM users
    WHERE id = ?
  `,
    )
    .get(req.session.userId);

  // The account may have already been deleted while the session still exists.
  if (!user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Verify that the password entered by the user matches the stored bcrypt hash.
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // Stop the deletion if the password is incorrect.
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Password is incorrect",
    });
  }

  // Delete the user's profile image from Cloudinary if one exists.
  // Image cleanup is separate from account deletion so a Cloudinary problem
  // does not prevent the user account from being removed from the database.
  if (user.profile_image_public_id) {
    try {
      await cloudinary.uploader.destroy(user.profile_image_public_id);
    } catch (error) {
      // Keep the account deletion process running even if Cloudinary cleanup fails.
      console.error("Failed to delete profile image from Cloudinary:", error);
    }
  }

  // Delete the user's account from the database.
  db.prepare("DELETE FROM users WHERE id = ?").run(user.id);

  // Destroy the current session so the deleted account cannot remain authenticated.
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Account was deleted, but the session could not be cleared",
      });
    }

    // Clear the session cookie from the browser.
    res.clearCookie("connect.sid");

    return res.json({
      message: "Account deleted successfully",
    });
  });
});

//Update the currently authenticated user's profile
// Uses the user ID stored in the current session
router.put("/me", upload.single("avatar"), async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Validate the new name
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  // Find the currently authenticated user
  const user = db
    .prepare(
      `
SELECT
  id,
  name,
  email,
  created_at,
  last_login,
  account_status,
  email_verified,
  profile_image_url,
  profile_image_public_id,
  email_notifications
FROM users
WHERE id = ?
`,
    )
    .get(req.session.userId);

  // The user may have been deleted after the session was created
  if (!user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Keep the current profile image URL if no new image is uploaded
  let profileImageUrl = user.profile_image_url;

  //If no new images is uploaded, we keep the existing image information
  let profileImagePublicId = user.profile_image_public_id;

  //Keep the old Cloudinary public ID so we can delete the old image only after the new image has been successfully saved in the database.
  const oldProfileImagePublicId = user.profile_image_public_id;

  //Check if a profile image was uploaded
  if (req.file) {
    console.log("Profile image received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Upload the profile image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    profileImageUrl = result.secure_url;

    //Store the new Cloudinary public ID so the image can be deleted from Cloudinary later
    profileImagePublicId = result.public_id;

    console.log("Profile image uploaded", profileImageUrl);
  }

  // Check what actually changed
  const nameChanged = req.body.name.trim() !== user.name;
  const imageChanged = Boolean(req.file);

  //Update the user's name, profile image URL, and Cloudinary public ID in the database
  // The public ID will be used later to delete the old Cloudinary image
  db.prepare(
    "UPDATE users SET name = ?, profile_image_url = ?, profile_image_public_id = ?  WHERE id =?",
  ).run(req.body.name.trim(), profileImageUrl, profileImagePublicId, user.id);

  // Send email notification if email notifications are enabled and something changed
  if (user.email_notifications === 1 && (nameChanged || imageChanged)) {
    await sendEmail({
      to: user.email,
      subject: "Your TaskFlow profile was updated",
      html: `
      <h2>Profile updated</h2>
      <p>Your TaskFlow profile was successfully updated.</p>
      <p>If you did not make this change, please secure your account immediately.</p>
    `,
    });
  }

  //Delete the old Cloudinary image only after the database has been
  // successfully updated to use the new image.
  // If deletion fails, we keep the new profile working and log the error
  // so the old Cloudinary file can be cleaned up later.
  if (
    req.file &&
    oldProfileImagePublicId &&
    oldProfileImagePublicId !== profileImagePublicId
  ) {
    try {
      await deleteFromCloudinary(oldProfileImagePublicId);

      console.log("Old profile image deleted:", oldProfileImagePublicId);
    } catch (error) {
      console.error(
        "Warning: Failed to delete old profile image from Cloudinary:",
        error,
      );
    }
  }

  // Return the updated user data
  res.json({
    message: "Profile updated successfully",
    user: {
      id: user.id,
      name: req.body.name.trim(),
      email: user.email,
      created_at: user.created_at,
      last_login: user.last_login,
      account_status: user.account_status,
      email_verified: user.email_verified,
      profile_image_url: profileImageUrl,
      profile_image_public_id: user.profile_image_public_id,
    },
  });
});

// For test
// router.post("/test-upload", upload.single("avatar"),
// (req , res)=>{

//   console.log("File received:", req.file);

//   res.json({
//     message:"File received successfully",
//     file:{
//       originalname: req.file?.originalname,
//       mimetype: req.file?.mimetype,
//       size:req.file?.size,
//     },
//   });

// });

//Delete the authenticated user's profile image.
// The old image is removed from Cloudinary and its image data
// is cleared from the user's database record.
router.delete("/me/avatar", async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // Find the currently authenticated user and get the Cloudinary public ID
  const user = db
    .prepare("SELECT id, profile_image_public_id FROM users WHERE id = ?")
    .get(req.session.userId);

  // The user may have been deleted after the session was created
  if (!user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  // If the user does not have a profile image, there is nothing to delete
  if (!user.profile_image_public_id) {
    return res.status(400).json({
      message: "No profile image to delete",
    });
  }

  //Delete the image from Cloudinary using its public ID.
  // If Cloudinary fails, we do not clear the database values because
  // the image may still exist and we need to keep the DB consistent.
  try {
    await deleteFromCloudinary(user.profile_image_public_id);
  } catch (error) {
    console.error("Failed to delete profile image from Cloudinary:", error);

    return res.status(500).json({
      message: "Failed to delete profile image",
    });
  }

  // Remove the image information from the user's database record
  db.prepare(
    "UPDATE users SET profile_image_url = NULL, profile_image_public_id = NULL WHERE id = ?",
  ).run(user.id);

  // Return a successful response
  res.json({
    message: "Profile image deleted successfully",
  });
});

// We use avatar name for Postman / Multer
router.post("/test-upload", upload.single("avatar"), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer);

    console.log("Cloudinary upload successful:", result.secure_url);

    res.json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    res.status(500).json({
      message: "Image upload failed",
    });
  }
});

// Get user by id Read
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const user = db.prepare("SELECT * FROM users WHERE id =?").get(userId);

  // Error Handling
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});

// Update user by id Put(PUT)
router.put("/:id", (req, res) => {
  const userId = req.params.id;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

  // Error Handling
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({
      message: " Name is required",
    });
  }

  if (!req.body.email || !validator.isEmail(req.body.email)) {
    return res.status(400).json({
      message: " A valid email is required",
    });
  }

  user.name = req.body.name;
  user.email = req.body.email;

  try {
    db.prepare(
      `
    UPDATE users SET name = ? , email = ?
    WHERE id = ?
    `,
    ).run(user.name, user.email, userId);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Database error",
    });
  }

  res.json(user);
});

// Patch user by id
router.patch("/:id", (req, res) => {
  const userId = req.params.id;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Validation PATCH fields here
  if (req.body.name !== undefined && req.body.name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  if (req.body.email !== undefined && !validator.isEmail(req.body.email)) {
    return res.status(400).json({
      message: " A valid email is required",
    });
  }

  // Apply validated fields to the user
  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  if (req.body.email !== undefined) {
    user.email = req.body.email;
  }

  try {
    db.prepare(
      `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
    `,
    ).run(user.name, user.email, userId);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Database error",
    });
  }

  res.json(user);
});

// Delete by id
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

  // Error Handling
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  db.prepare("DELETE FROM users WHERE id = ?").run(userId);

  res.json({
    message: "User deleted successfully",
  });
});

// Logout of the current user
// Destroys the server-side session

// Create POST /api/users/logout
router.post("/logout", (req, res) => {
  console.log("LOGOUT ROUTE HIT");

  // Delete the session from the server
  req.session.destroy((error) => {
    if (error) {
      console.log("Failed to destroy session:", error);

      return res.status(500).json({
        message: " Logout failed",
      });
    }

    // Clear the session cookie from the browser
    res.clearCookie("connect.sid");

    res.json({
      message: "Logout successful",
    });
  });
});

//Test email
router.post("/test-email", async (req, res) => {
  try {
    const { sendEmail } = await import("../utils/sendEmail.js");

    const result = await sendEmail({
      to: req.body.email,
      subject: "TaskFlow Email Test",
      html: `
  <h2>Hello from TaskFlow :wave:</h2>
  <p>This is a test email from your backend.</p>
  <p>Resend is working correctly.</p>
  `,
    });

    res.json({
      message: "Email sent successfully",
      result,
    });
  } catch (error) {
    console.error("Email sending failed:", error);

    res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
});

//Resend email verification link
router.post("/resend-verification", async (req, res) => {
  // const email =req.body.email;
  const { email } = req.body;

  //Check if an email was provided
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  //Get the user
  const user = db.prepare("SELECT * FROM users WHERE  email = ? ").get(email);

  //Check if the user exists
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check if the email is already verified

  if (user.email_verified) {
    return res.status(400).json({
      message: "Email is already verified",
    });
  }

  const verificationToken = randomBytes(32).toString("hex");
  const verificationExpires = new Date(
    Date.now() + 15 * 60 * 1000,
  ).toISOString();

  db.prepare(
    `UPDATE users SET email_verification_token = ?, email_verification_expires = ? WHERE id = ? `,
  ).run(verificationToken, verificationExpires, user.id);

  //
  const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;

  //
  await sendEmail({
    to: user.email,
    subject: "Verify your TaskFlow email",
    html: `
    <h2>Welcome back to FlowTask!</h2>
    <p>Please verify your email address by clicking the link below:</p>

    <a href="${verificationUrl}">
      Verify Email
   </a>
    <p>This link will be expire in 15 minutes.</p>
    
    `,
  });

  return res.json({
    message: "Verification email sent successfully",
  });
});

// Create a new task for the currently authenticated user.
// The session user ID ensures the task belongs to the correct account.
router.post("/me/tasks", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({
      message: "Task text is required",
    });
  }

  const task = {
    id: crypto.randomUUID(),
    user_id: req.session.userId,
    text: text.trim(),
    done: 0,
    created_at: new Date().toISOString(),
  };

  db.prepare(
    `
    INSERT INTO tasks (
      id,
      user_id,
      text,
      done,
      created_at
    )
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(task.id, task.user_id, task.text, task.done, task.created_at);

  res.status(201).json({
    message: "Task created successfully",
    task,
  });
});

// Get all tasks belonging to the currently authenticated user.
router.get("/me/tasks", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const tasks = db
    .prepare(
      `
      SELECT id, text, done, created_at
      FROM tasks
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    )
    .all(req.session.userId);

  res.json({
    tasks,
  });
});

// Update the text and/or completed status of a task owned by the authenticated user.
router.put("/me/tasks/:id", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const { id } = req.params;
  const { text, done } = req.body;

  if (text !== undefined && text.trim() === "") {
    return res.status(400).json({
      message: "Task text cannot be empty",
    });
  }

  if (done !== undefined && done !== 0 && done !== 1) {
    return res.status(400).json({
      message: "done must be 0 or 1",
    });
  }

  const currentTask = db
    .prepare(
      `
      SELECT id, text, done, created_at
      FROM tasks
      WHERE id = ? AND user_id = ?
    `,
    )
    .get(id, req.session.userId);

  if (!currentTask) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  db.prepare(
    `
    UPDATE tasks
    SET
      text = COALESCE(?, text),
      done = COALESCE(?, done)
    WHERE id = ? AND user_id = ?
  `,
  ).run(
    text !== undefined ? text.trim() : null,
    done !== undefined ? done : null,
    id,
    req.session.userId,
  );

  const updatedTask = db
    .prepare(
      `
      SELECT id, text, done, created_at
      FROM tasks
      WHERE id = ? AND user_id = ?
    `,
    )
    .get(id, req.session.userId);

  res.json({
    message: "Task updated successfully",
    task: updatedTask,
  });
});

// Delete all completed tasks owned by the authenticated user.
router.delete("/me/tasks/completed", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const result = db
    .prepare(
      `
      DELETE FROM tasks
      WHERE user_id = ? AND done = 1
    `,
    )
    .run(req.session.userId);

  res.json({
    message: "Completed tasks deleted successfully",
    deletedCount: result.changes,
  });
});

// Delete a task owned by the authenticated user.
router.delete("/me/tasks/:id", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  const { id } = req.params;

  const result = db
    .prepare(
      `
      DELETE FROM tasks
      WHERE id = ? AND user_id = ?
    `,
    )
    .run(id, req.session.userId);

  if (result.changes === 0) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json({
    message: "Task deleted successfully",
  });
});

export default router;
