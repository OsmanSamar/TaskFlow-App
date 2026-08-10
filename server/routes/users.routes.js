// CRUD
import express from "express";
import { randomUUID } from "crypto";
import db from "../database/database.js";
import validator from "validator";

const router = express.Router();

// Get read Router
router.get("/", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();

  res.json(users);
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

// Post Create
router.post("/", (req, res) => {
  // Validation
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  if (!req.body.email || !validator.isEmail(req.body.email)) {
    return res.status(400).json({
      message: "A valid email is required",
    });
  }

  const newUser = {
    id: randomUUID(),

    ...req.body,
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
    INSERT INTO users (id, name, email)
    VALUES (?, ?, ?)
    `,
    ).run(newUser.id, newUser.name, newUser.email);
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
  res.status(201).json(newUser);

  // 201 means Succesfully created new user
});

// Update user by id Put
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

  db.prepare(
    ` 
    UPDATE users
    SET name = ? , email = ? 
    WHERE id = ?
    `,
  ).run(user.name, user.email, userId);

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
