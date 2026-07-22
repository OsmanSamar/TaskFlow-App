import express from "express";
import { randomUUID } from "crypto";

const app = express();

// Create the Express application instance.
// The "app" object is used to configure the server,
// define API routes, and handle HTTP requests.

app.use(express.json());
const PORT = 3000;
const users = [];

// Post Create
app.post("/api/users", (req, res) => {
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

// Get Read
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Get user by id Read
app.get("/api/users/:id", (req, res) => {
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

// Update user by id Put
app.put("/api/users/:id", (req, res) => {
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

app.patch("/api/users/:id", (req, res) => {
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
app.delete("/api/users/:id", (req, res) => {
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

// Created GEt route
//  / = The route inside the API
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running",
  });
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
