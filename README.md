# TaskFlow — User Management App

A full-stack user management and task application built with React, Node.js, Express, and SQLite.

---

## Project Overview

TaskFlow lets users manage their account and daily tasks in one place.

### Features

#### Completed

- User authentication:
  - Login page
  - Register page
  - User registration
  - Password hashing with bcrypt
  - User login
  - Session-based authentication
  - Authentication cookies
  - Authenticated `/me` endpoint
  - Logout
  - Email verification
  - Secure email verification tokens
  - Verification token expiration
  - Prevention of reused/invalid verification tokens after successful verification
  - Login protection for users whose email has not been verified
  - Resend verification email functionality
  - Generation of a new verification token when resending
  - Change password functionality
  - `last_login` tracking
- Email verification UX:
  - Verification status feedback
  - Verification success page
  - Verification failure state
  - Resend verification email action from the Login page
  - Loading state while resending (`Sending...`)
  - Success feedback after the verification email is sent
- User profile
- Edit profile (including profile image upload via Cloudinary)
- Task management (frontend):
  - Add tasks
  - Edit tasks
  - Delete tasks
  - Mark tasks as completed
  - Filter tasks
  - Clear completed tasks
- Express backend with SQLite database integration for user data

#### Frontend-only (UI exists, backend integration pending)

- Dashboard with task overview (currently uses sample data)
- Settings:
  - Dark Mode
  - Language selection
  - Email notification setting for Tasks
- Task management persistence (`localStorage` only; backend/database persistence not yet completed)

#### Planned / In progress

- User authentication pages:
  - Forgot Password (page exists; backend flow not yet completed)
  - Reset Password (page exists; backend flow not yet completed)
- Remember Me
- Delete Account
- Backend/database integration for Settings
- Dashboard implementation (full backend-connected version)
- Backend/database persistence for Todo data
- Deployment

---

## Technologies

### Frontend

- React
- React Router
- Vite
- Tailwind CSS
- React Icons

### Backend

- Node.js
- Express
- bcrypt (password hashing)
- express-session (session-based authentication)
- CORS (frontend/backend cookie communication)
- Multer (profile image uploads)
- Cloudinary (cloud image storage)
- Resend (transactional email delivery)

### Database

- SQLite (`better-sqlite3`) — persistent user data storage

---

## Requirements

- Node.js
- npm
- NVM (optional, but recommended)

---

## Installation

Clone the project and navigate to the project folder:

```bash
cd User-management-app
npm install
```


---

## Node.js setup
 This project is currently using:

 Node.js v24.18.0 LST
 
 - Check installed Node.js version

 nvm ls

 - Install Node.js version 24

  nvm install 24

- Use Node.js version

nvm use 24

- Check the current Node.js version

node-v



## Frontend

Start the React/Vite development server:

```bash
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

---

## Backend Setup

### 1. Node.js version (optional with NVM)

```bash
nvm ls
nvm install 24
nvm use 24
```

### 2. Install dependencies

```bash
npm install
```

Express is already included for the backend:

```bash
npm install express
```

Express is used to:

- Create the backend server
- Define API routes
- Handle HTTP requests
- Connect the application to the database
- Connect the frontend with the backend

### 3. Backend entry file

The backend entry file is:

```text
project-root/server.js
```

### 4. Start the backend server

```bash
node server/server.js
```

The API will run on:

```text
http://localhost:3000
```

Test it in the browser or with:

```bash
curl http://localhost:3000
```

You should see:

```json
{ "message": "TaskFlow API is running" }
```

---

## Project Structure

```text
User-management-app/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── server.js
├── package.json
├── vite.config.js
└── README.md
```

---

## Available Scripts

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start Vite frontend            |
| `npm run build` | Build frontend for production  |
| `npm run preview` | Preview production build     |
| `npm run lint`  | Run ESLint                     |
| `node server/server.js`| Start Express backend          |

---

## Next Steps

- [x] Connect Express routes to the frontend
- [x] Add SQLite database
- [x] Implement user authentication API
- [ ] Implement Forgot Password backend flow
- [ ] Implement Reset Password backend flow
- [ ] Persist tasks on the backend
- [ ] Connect Dashboard to real task data
- [ ] Integrate Settings preferences with backend/database
- [ ] Deployment


## Database SQLite 

SQLite is now integrated for persistent user data. The notes below document the database setup and integration process.

- We will use SQLite as our database  to persist application data instead of storing users temporarily inmemory.
- We will use `better-sqlite3` as the bridge between Node.js and the SQLite database.

### Installing SQLite Driver

```bash
 npm install better-sqlite3

 
 ### Database Folder

We created a dedicated `database` folder inside the `server` directory to keep all database-related files organized.

```text
server/
├── server.js
├── routes/
├── data/
└── database/
```

The SQLite database file will be created automatically later when we establish the database connection. We do not create the `.sqlite` file manually at this stage.



### Creating the SQLite Database

We created a `database.js` file inside the `server/database` folder to connect the Node.js application to SQLite using `better-sqlite3`.

The database connection is created with:

```js
const db = new Database("./server/database/database.sqlite");
```

If the database file does not exist, `better-sqlite3` creates it automatically.

We also created the `users` table using SQL:

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
```

The table structure is:

```text
users
├── id
├── name
└── email
```

The database file is stored locally at:

```text
server/database/database.sqlite
```

To verify the database connection and create the database file, we ran:

```bash
node server/database/database.js
```

This successfully created the SQLite database file.



### Connecting SQLite to the Existing Express CRUD

After creating the SQLite database and the `users` table, we connected SQLite to the existing Express CRUD routes.

The API no longer uses the old in-memory `users` array from the `data` folder. Instead, all user data is now stored and managed in the SQLite database.

The current project structure is:

```text
server/
├── database/
│   ├── database.js
│   └── database.sqlite
├── routes/
│   └── users.routes.js
└── server.js
```

The database connection is imported into the routes:

```js
import db from "../database/database.js";
```

The CRUD operations now use SQL queries through `better-sqlite3`:

```text
GET     → SELECT
POST    → INSERT
PUT     → UPDATE
PATCH   → UPDATE
DELETE  → DELETE
```

Examples:

```sql
SELECT * FROM users;
```

```sql
INSERT INTO users (id, name, email)
VALUES (?, ?, ?);
```

```sql
UPDATE users
SET name = ?, email = ?
WHERE id = ?;
```

```sql
DELETE FROM users
WHERE id = ?;
```

We also use parameterized queries with `?` placeholders to safely pass values to SQLite.

The API was tested using Postman, and the data was verified using SQLite database tools, including DB Browser for SQLite and the SQLite3 Editor extension in VS Code.

This confirms that the Express API is now connected to a persistent SQLite database instead of storing users only in memory.

---

## Input Validation

We added input validation to the user routes using the `validator` package.

Install the package:

```bash
npm install validator
```

Import it in `users.routes.js`:

```js
import validator from "validator";
```

### POST /users

- `name` must exist and must not be an empty string.
- `email` must exist and must be a valid email address (`validator.isEmail(...)`).
- Invalid input returns HTTP `400`.

### PUT /users/:id

- `name` must exist and must not be empty.
- `email` must exist and must be a valid email address.
- Invalid input returns HTTP `400`.

### PATCH /users/:id

- `name` is validated only when it is included in the request, and must not be an empty string.
- `email` is validated only when it is included in the request, and must be a valid email address.
- Invalid input returns HTTP `400`.

### Testing

Validation was tested with Postman:

- Invalid email was rejected.
- Empty name was rejected.
- Valid POST data successfully created a user and returned HTTP `201 Created`.
