// CRUD
import express from "express";
import { randomUUID } from "crypto";
import db from "../database/database.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { isValidEmail, isValidPassword } from "../utils/validators.js";


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
    INSERT INTO users (id, name, email, password)
    VALUES (?, ?, ?, ?)
    `,
    ).run(newUser.id, newUser.name, newUser.email, hashedPassword);
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

  // Login successful

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
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

export default router;
