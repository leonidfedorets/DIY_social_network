# DIY Social Network

A full-stack social network prototype built with:

- **Frontend:** React (Create React App) + styled-components.
- **Backend:** Express + MongoDB (Mongoose) + JWT authentication.

## Implemented features

- User registration/login/logout and auth check.
- Role-based access control (`user` / `admin`).
- Create/list/read/update/delete posts.
- File upload support for post media (JPEG/PNG/MP4).
- Reactions on posts (`like`, `love`, `laugh`, `angry`).
- Backoffice screens for user role and permission management.

## Project structure

- `client/` – React frontend.
- `server/` – Express API and MongoDB models/routes/controllers.

## Local development

### 1) Install dependencies

```bash
npm install
cd client && npm install
```

### 2) Set environment variables

Create a `.env` file (project root or server runtime environment):

```env
MONGODB_URI=mongodb://localhost:27017/mydatabase
JWT_SECRET=change_me
PORT=4000
```

### 3) Run backend

```bash
node server/server.js
```

### 4) Run frontend

```bash
cd client
npm start
```

Frontend default URL: `http://localhost:3000`  
Backend default URL: `http://localhost:4000`
