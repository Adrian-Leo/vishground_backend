DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS drone_configs;
DROP TABLE IF EXISTS user_session;

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  google_id VARCHAR(255),
  fullname VARCHAR(255),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  pass VARCHAR(255) NOT NULL,
  profile_picture_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE drone_configs (
--   config_id SERIAL PRIMARY KEY,
--   user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
--   drone_name VARCHAR(255) NOT NULL,
--   config JSONB NOT NULL
-- );
-- Display Name = Fullname

CREATE TABLE user_session (
    sid TEXT PRIMARY KEY NOT NULL,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);