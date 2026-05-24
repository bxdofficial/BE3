-- ByteEgypt CMS Database Schema
-- Stores all editable content for the public site

-- ============ Site Settings (key-value pairs) ============
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============ Images (stored as base64 data URLs) ============
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,            -- e.g. 'logo', 'hero_bg', 'feature_1'
  name TEXT NOT NULL,             -- display name in dashboard
  description TEXT,               -- where it appears on site
  data_url TEXT NOT NULL,         -- data:image/png;base64,...  OR external URL
  mime_type TEXT,
  size_bytes INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============ Features cards ============
CREATE TABLE IF NOT EXISTS features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL,             -- FontAwesome class e.g. 'fa-solid fa-code'
  gradient TEXT NOT NULL,         -- CSS gradient string
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ Future vision cards ============
CREATE TABLE IF NOT EXISTS future_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge TEXT DEFAULT 'قريباً',
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ Steps ============
CREATE TABLE IF NOT EXISTS steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  step_num INTEGER NOT NULL,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ FAQ ============
CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ Roles (chips) ============
CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_name TEXT NOT NULL,       -- 'years' or 'specializations'
  label TEXT NOT NULL,            -- includes emoji + text
  color TEXT NOT NULL,            -- CSS color
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ Stats (about section) ============
CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL,
  number TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ Safety points ============
CREATE TABLE IF NOT EXISTS safety_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL,
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ Marquee items ============
CREATE TABLE IF NOT EXISTS marquee_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

-- ============ Admin users ============
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============ Sessions ============
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

CREATE INDEX IF NOT EXISTS idx_features_order ON features(sort_order);
CREATE INDEX IF NOT EXISTS idx_future_order ON future_cards(sort_order);
CREATE INDEX IF NOT EXISTS idx_steps_order ON steps(sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(sort_order);
CREATE INDEX IF NOT EXISTS idx_roles_group ON roles(group_name, sort_order);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
