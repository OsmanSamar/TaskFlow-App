
// CRUD
import express from "express";
import { randomUUID } from "crypto";
import users from "../data/users.js";

const router = express.Router();

// Get read Router

router.get("/", (req, res) => {
  res.json(users);
});

// Get user by id Read

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);
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
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: " Name and email are required",
    });
  }

  const newUser = {
    id: randomUUID(),

    ...req.body,
  };

  users.push(newUser);

  res.status(201).json(newUser);

  // 201 means Succesfully created new user
});

// Update user by id Put
router.put("/:id", (req, res) => {
  const userId = req.params.id;

  const user = users.find((user) => user.id === userId);

  // Error Handling
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.name = req.body.name;
  user.email = req.body.email;

  res.json(user);
});

// Patch user by id

router.patch("/:id", (req, res) => {
  const userId = req.params.id;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (req.body.name) {
    user.name = req.body.name;
  }

  if (req.body.email) {
    user.email = req.body.email;
  }

  res.json(user);
});

// Delete by id
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === userId);

  // Error Handling
  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  users.splice(userIndex, 1);

  res.json({
    message: "User deleted successfully",
  });
});

export default router;
