/**
 * TaskFlow API entry point.
 * Configures Express middleware, mounts routes, and starts the HTTP server.
 */
import express from "express";
import usersRouter from "./routes/users.routes.js";


// يشغل Express
const app = express();
const PORT = 3000;

// Parse incoming JSON request bodies  يجهز Middleware
app.use(express.json());

// API routes
app.use("/api/users", usersRouter);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running",
  });
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
