-- AI Video Content Studio schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'English',
  tone TEXT DEFAULT 'Casual',
  temperature REAL DEFAULT 0.4,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  input_type TEXT NOT NULL,        -- topic | url | text | file
  source_content TEXT,             -- original raw input (topic/url/text/filename)
  platform TEXT,                   -- YouTube | Shorts | Reels | TikTok
  tone TEXT,
  audience TEXT,
  language TEXT,
  result_json TEXT NOT NULL,       -- full Gemini JSON response, stringified
  is_favourite INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
