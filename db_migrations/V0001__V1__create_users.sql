CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_letter CHAR(1) NOT NULL,
  bio TEXT DEFAULT '',
  phone VARCHAR(20) DEFAULT '',
  status VARCHAR(20) DEFAULT 'offline',
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);