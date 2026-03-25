CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(30) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  related_chat_id INTEGER REFERENCES chats(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);