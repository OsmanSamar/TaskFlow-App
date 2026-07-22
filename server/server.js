import express from "express";

const app = express();

// Create the Express application instance.
// The "app" object is used to configure the server,
// define API routes, and handle HTTP requests.

app.use(express.json());
const PORT = 3000;

// Created GEt route
//  / = The route inside the API
app.get("/", (reg, res) => {
  res.json({
    message: "TaskFlow API is running",
  });
});

// Start the server

app.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
