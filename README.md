# TaskFlow — User Management App

A full-stack user management and task application built with React, Node.js, Express, and SQLite.

---

## Project Overview

TaskFlow lets users manage their account and daily tasks in one place.

### Features

- User authentication pages:
  - Login
  - Register
  - Forgot Password
  - Reset Password
- Dashboard with task overview
- Task management:
  - Add tasks
  - Edit tasks
  - Delete tasks
  - Mark tasks as completed
  - Filter tasks
  - Clear completed tasks
- User profile
- Edit profile
- Settings
- Express backend (in progress)
- SQLite database (planned)

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

### Database

- SQLite (planned)

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

- Connect Express routes to the frontend
- Add SQLite database
- Implement user authentication API
- Persist tasks on the backend


## Database SQLite 

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