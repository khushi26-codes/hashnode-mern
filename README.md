# Hashnode-style Developer Blogging Platform (MERN)

A beginner-friendly MERN project based on the supplied PRD. It includes:
- Register/login with bcrypt password hashing and JWT
- Protected routes and ownership checks
- Create, read, update, delete posts
- Draft/published status
- Markdown rendering and code highlighting
- Tags, title search, public feed
- Public author profiles and editable profile settings
- Dashboard for a user's drafts and published posts

## Requirements
Install Node.js LTS and npm. Create a MongoDB Atlas database (or use local MongoDB).

## 1. Configure MongoDB
Create a database and copy its connection string. Do not commit real secrets.

## 2. Configure the backend
Open a terminal in this folder:
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and fill in `MONGO_URI` and a long random `JWT_SECRET`.
Start backend:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

## 3. Configure the frontend
Open a second terminal:
```bash
cd client
npm install
```
Copy `client/.env.example` to `client/.env` if needed. The default API URL is `http://localhost:5000/api`.
Start frontend:
```bash
npm run dev
```
Open the URL Vite prints (normally `http://localhost:5173`).

## 4. Test the application
1. Register a user.
2. Log in.
3. Open Dashboard and create a post.
4. Save it as a draft, then edit and publish it.
5. Open the public feed and test search and tags.
6. Open a post and check Markdown/code formatting.
7. Visit your profile and update the bio/avatar URL.

## Security notes
- Passwords are hashed with bcryptjs.
- JWTs are stored in localStorage for this educational project, as specified in the PRD.
- The API checks post ownership on the server.
- Never expose `.env` or commit real credentials.
- For production, add rate limiting, stronger validation, secure cookie/session strategy, and a dedicated Markdown sanitization policy.

## Project structure
```text
server/
  config/ models/ controllers/ routes/ middleware/ utils/
client/
  src/
    api/ components/ context/ hooks/ pages/
```
