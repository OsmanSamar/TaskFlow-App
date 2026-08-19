// CRUD
import express from "express";
import { randomUUID } from "crypto";
import db from "../database/database.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { isValidEmail, isValidPassword } from "../utils/validators.js";
import multer from "multer";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

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
    INSERT INTO users (id, name, email, password, created_at)
    VALUES (?, ?, ?, ?, ?)
    `,
    ).run(
      newUser.id,
      newUser.name,
      newUser.email,
      hashedPassword,
      newUser.created_at,
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

// Login user(POST)
// Cretae endpoint for login
router.post("/login", async (req, res) => {
  console.log("LOGIN ROUTE HIT");

  const { email, password } = req.body;

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

  if (!isMatch) {
    return res.status(401).json({
      message: "Login incorrect",
    });
  }

  // Store the authenticated user's ID in the session
  // This allows the server to remember the logged-in user

  req.session.userId = user.id;

  // Update the user's last login time
  const lastLogin = new Date().toISOString();
  db.prepare("UPDATE users SET last_login = ? WHERE id = ?").run(
    lastLogin,
    user.id,
  );
  console.log("Last login:", lastLogin);

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
      "SELECT id, name, email, created_at, last_login, account_status, email_verified, profile_image_url FROM users WHERE id = ?",
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
    },
  });
});

//Update the currently authenticated user's profile
// Uses the user ID sorted in the current session
router.put("/me", upload.single("avatar"), async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.userId) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  //Validate the new name
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  // Find the currently authenticated user
  const user = db
    .prepare(
      "SELECT id, name, email, created_at, last_login, account_status, email_verified, profile_image_url FROM users WHERE id = ?",
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

  
  //Update the user's name, profile image URL, and Cloudinary public ID in the database
  // The public ID will be used later to delete the old Cloudinary image
  db.prepare(
    "UPDATE users SET name = ?, profile_image_url = ?, profile_image_public_id = ?  WHERE id =?",
  ).run(req.body.name.trim(), profileImageUrl, profileImagePublicId, user.id);

  // Return the updated user data
  res.json({
    message: "Profile updated succcessfully",
    user: {
      id: user.id,
      name: req.body.name.trim(),
      email: user.email,
      created_at: user.created_at,
      last_login: user.last_login,
      account_status: user.account_status,
      email_verified: user.email_verified,
      profile_image_url: profileImageUrl,
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

export default router;
