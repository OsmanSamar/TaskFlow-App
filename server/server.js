import express from "express";
import { randomUUID } from "crypto";

const app = express();

// Create the Express application instance.
// The "app" object is used to configure the server,
// define API routes, and handle HTTP requests.

app.use(express.json());
const PORT = 3000;
const users = [];

// Get Read
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Get user by id Read
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const user = users.find((user) => user.id === userId);
  res.json(user);
});

// Update user by id Put
app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const user = users.find((user) => user.id === userId);

  user.name = req.body.name;
  user.email = req.body.email;

  res.json(user);
});

// Post Create
app.post("/api/users", (req, res) => {
  const newUser = {
    id: randomUUID(),

    ...req.body,
  };

  users.push(newUser);

  res.status(201).json(newUser);

  // 201 means Succesfully created new user
});

// Delete by id

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === userId);

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
