# 🎬 AI Video Content Studio

Convert a **Topic / Blog URL / Plain Text / .txt File** into a complete, ready-to-produce
video content package — title, hook, full script, voice-over, scenes, SEO, social captions,
b-roll ideas, and more — using **one single Gemini 2.5 Flash API call**.

## Stack
- **Frontend:** React (Vite, JavaScript) + Bootstrap 5 + Bootstrap Icons + Axios + React Router DOM + Context API
- **Backend:** Node.js + Express (MVC) + SQLite (`better-sqlite3`) + JWT + bcryptjs
- **AI:** Google Gemini 2.5 Flash — single request, `responseMimeType: application/json`, temperature 0.4
- **Deploy:** Frontend → Vercel · Backend → Render

---

## ⚠️ Security note
This project reads your Gemini key from a local `.env` file only — it is **never** committed
or hardcoded anywhere in the code. If you ever paste a real API key into a chat, doc, or
public repo, treat it as compromised and regenerate it at
[aistudio.google.com/apikey](https://aistudio.google.com/apikey).

---

## 1. Backend Setup

```bash
cd backend
cp .env.example .env
# open .env and paste your real GEMINI_API_KEY
npm install
npm run dev        # starts on http://localhost:5000
```

SQLite auto-initializes at `backend/database/studio.sqlite` on first boot — no manual migration needed.

### Backend environment variables (`backend/.env`)
| Variable | Default | Notes |
|---|---|---|
| `PORT` | `5000` | |
| `NODE_ENV` | `development` | |
| `JWT_SECRET` | — | change for production |
| `JWT_EXPIRES_IN` | `7d` | |
| `GEMINI_API_KEY` | — | **required**, your real key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | |
| `GEMINI_TEMPERATURE` | `0.4` | |
| `GEMINI_MAX_TOKENS` | `8192` | |
| `UPLOAD_PATH` | `./uploads` | temp storage for .txt uploads |
| `MAX_UPLOAD_SIZE` | `5mb` | |
| `CLIENT_URL` | `http://localhost:5173` | used for CORS |

## 2. Frontend Setup

```bash
cd client
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev             # starts on http://localhost:5173
```

Open `http://localhost:5173`, register an account, and go to **Generate** to create your first video package.

---

## 3. How Generation Works (single AI call)

1. User picks an input mode on the **Generate** page: Topic / Blog URL / Plain Text / Upload `.txt`.
2. Backend resolves that input to plain source text:
   - **Topic** → used directly.
   - **Blog URL** → fetched with `axios`, HTML stripped with `cheerio` down to readable text.
   - **Plain Text** → used directly.
   - **File** → `.txt` upload read from disk via `multer`, then deleted.
3. `AIService.generateVideoPackage()` builds one large, structured prompt (platform, tone,
   audience, language + source text) and calls `GeminiProvider.generateJson()` — **exactly one**
   Gemini request, `responseMimeType: application/json`, temperature `0.4`.
4. The JSON response is parsed, shape-validated against the required keys, saved to SQLite, and
   returned to the frontend.

### Response contract
```json
{
  "title": "", "hook": "", "introduction": "", "script": "", "voiceOver": "",
  "summary": "", "callToAction": "", "duration": "", "musicSuggestion": "",
  "thumbnailPrompt": "", "subtitle": "",
  "scenes": [{ "scene": 1, "title": "", "visual": "", "description": "", "duration": "" }],
  "seo": { "title": "", "description": "", "keywords": [], "tags": [] },
  "captions": { "youtube": "", "instagram": "", "linkedin": "", "twitter": "", "facebook": "" },
  "brollIdeas": []
}
```

---

## 4. Project Structure

```
ai-video-studio/
├── backend/
│   ├── config/            env.js, db.config.js
│   ├── controllers/       auth, user, project controllers
│   ├── models/            User.js, Project.js (SQLite data access)
│   ├── services/          auth.service, project.service, AIService
│   ├── providers/         GeminiProvider.js  ← only place that calls Gemini
│   ├── routes/            auth, user, project routes
│   ├── middleware/        auth, error, upload, validate
│   ├── validators/        express-validator chains
│   ├── utils/             asyncHandler, ApiError, generateToken, extractText
│   ├── database/          schema.sql, db.js, studio.sqlite (generated on boot)
│   ├── uploads/           temp .txt uploads (auto-deleted after read)
│   ├── app.js
│   └── server.js
└── client/
    └── src/
        ├── components/    Navbar, Sidebar, ProjectCard, CopyButton, Spinner, ProtectedRoute
        ├── pages/         Login, Register, Dashboard, Generate, Result, History, Profile, Settings, NotFound
        ├── layouts/       AuthLayout, MainLayout
        ├── context/       AuthContext, ThemeContext, ToastContext
        ├── services/      api.js (Axios instance + interceptors)
        ├── hooks/         useAuth, useTheme, useToast
        ├── utils/         download.js (copy/download helpers)
        ├── App.jsx
        └── main.jsx
```

---

## 5. API Reference

**Auth** (`/api/auth`)
- `POST /register` — `{ name, email, password }`
- `POST /login` — `{ email, password }`
- `GET /me` — protected

**Users** (`/api/users`) — all protected
- `GET /me` — profile + project count
- `PUT /me` — update name/theme/language/tone/temperature
- `PUT /me/password` — change password
- `DELETE /me` — delete account (cascades to projects)

**Projects** (`/api/projects`) — all protected
- `POST /generate` — `multipart/form-data`: `inputType`, one of `topic|url|text|file`, plus `platform`, `tone`, `audience`, `language`
- `GET /` — `?search=&favourites=true&sortBy=created_at&order=DESC`
- `GET /stats`
- `GET /:id`
- `PATCH /:id/rename` — `{ title }`
- `PATCH /:id/favourite`
- `POST /:id/duplicate`
- `DELETE /:id`

All responses follow `{ success: boolean, data?: ..., message?: string }`.

---

## 6. Deployment

### Backend → Render
1. Push `backend/` to a GitHub repo (or the whole monorepo, with Root Directory set to `backend`).
2. New **Web Service** on Render → connect repo → Root Directory: `backend`.
3. Build command: `npm install` · Start command: `npm start`.
4. Add the environment variables from the table above as Render secret env vars (`GEMINI_API_KEY`, `JWT_SECRET`, etc.). Set `CLIENT_URL` to your deployed Vercel URL.
5. **Note:** Render's free tier has an ephemeral filesystem — SQLite data resets on redeploy/restart. For a persistent demo, attach a Render Disk mounted at `backend/database`.

### Frontend → Vercel
1. New Project on Vercel → Root Directory: `client`.
2. Framework preset: **Vite**.
3. Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`.
4. Deploy.

---

## 7. Verified working
- ✅ Backend boots cleanly, SQLite schema auto-creates
- ✅ `POST /api/auth/register` → returns user + JWT (tested live)
- ✅ `POST /api/auth/login` → returns user + JWT (tested live)
- ✅ Frontend builds with zero errors (`npm run build`, Vite, 115 modules)

## 8. What's intentionally NOT included (per MVP scope)
No TypeScript, Tailwind, Material UI, Redux, MongoDB/Postgres, Firebase, OAuth, Docker, Redis,
image generation, TTS, or FFmpeg — this is a clean, single-AI-call MVP exactly as specified.
