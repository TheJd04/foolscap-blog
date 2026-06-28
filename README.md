# Foolscap — A Full-Stack Blogging Platform

A multi-user blog where anyone can read posts publicly, and signed-up users can write, edit, and delete their own posts, plus comment on any post.

**Stack:** React (Vite) · Express.js · MongoDB (Mongoose) · JWT authentication · Tailwind CSS

---

## Project structure

```
foolscap-blog/
├── backend/     Express REST API
└── frontend/    React single-page app
```

---

## 1. Set up MongoDB Atlas (free tier)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free "M0" cluster (any region is fine).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add your current IP (or `0.0.0.0/0` for "allow from anywhere" while developing).
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add a database name to the end of it, e.g. `.../foolscap?retryWrites=true&w=majority`

---

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — the connection string from step 1
- `JWT_SECRET` — any long random string (you can generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

Then start the server:

```bash
npm run dev
```

You should see:
```
MongoDB connected: cluster0-shard-...
Foolscap API running on http://localhost:5000
```

Test it's alive: open http://localhost:5000/api/health in your browser — you should see `{"status":"ok","service":"foolscap-api"}`.

---

## 3. Run the frontend

In a **new terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

---

## How it works

- **Sign up / log in** — issues a JWT, stored in `localStorage`, sent on every API request via an `Authorization: Bearer <token>` header.
- **Public reading** — anyone can browse `/` and read any published post without logging in.
- **Authoring** — logged-in users can write new posts (`/new`), see their own posts in a dashboard (`/dashboard`), and edit or delete only posts they own (enforced both in the UI and on the backend).
- **Comments** — any logged-in user can comment on any post; users can delete their own comments.
- **Search** — the search bar on the home page uses MongoDB's text index across title, content, and tags.

## API reference

| Method | Route | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create an account |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/posts` | No | List posts (`?search=`, `?tag=`, `?mine=true`) |
| GET | `/api/posts/:slug` | No | Get one post |
| POST | `/api/posts` | Yes | Create a post |
| PUT | `/api/posts/:id` | Yes (owner) | Update a post |
| DELETE | `/api/posts/:id` | Yes (owner) | Delete a post |
| GET | `/api/posts/:postId/comments` | No | List comments on a post |
| POST | `/api/posts/:postId/comments` | Yes | Add a comment |
| DELETE | `/api/comments/:id` | Yes (owner) | Delete a comment |

## Things worth knowing for an interview

- Passwords are hashed with `bcryptjs` before saving — never stored in plain text.
- JWTs expire after 7 days (`JWT_EXPIRES_IN` in `.env`).
- Ownership checks happen **server-side** on every edit/delete — the frontend hiding a button is not the real security boundary.
- Slugs are auto-generated from titles and de-duplicated if two posts share a title.
- There's a centralized Express error handler (`middleware/errorHandler.js`) so every controller can just `next(err)` instead of repeating try/catch boilerplate.
