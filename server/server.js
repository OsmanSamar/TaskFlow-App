/**
 * TaskFlow API entry point.
 * Configures Express middleware, mounts routes, and starts the HTTP server.
 */
import express from "express";
import usersRouter from "./routes/users.routes.js";
import cors from "cors";
import session from "express-session";

// يشغل Express
const app = express();
const PORT = 3000;

app.use(cors());

//Important: Must be registered before routes that use req.session

//Session middleware

// Important: Must be registered before routes that use req.session

// We place it before express.json() to keep authentication middleware organized

app.use(
  session({
    // Used to sign the session cookie
    // TODO: Move this secret to an environment variable (.env)
    secret: "taskflow-secret-key",

    // Do not save the session again if it has not changed
    resave: false,

    // Do not create a session until something is actually stored in it
    saveUninitialized: false,
  }),
);

// Middleware for parsing incoming JSON request bodies
app.use(express.json());

// API routes
// Session must already be available befor
app.use("/api/users", usersRouter);

// Parse incoming JSON request bodies  يجهز Middleware
app.use(express.json());

// API routes
app.use("/api/users", usersRouter);

// for test
console.log("Users routes mounted at /api/users");

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
