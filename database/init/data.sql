/* 
 *  Create & init database
 */
-- ACTORS --

CREATE TABLE IF NOT EXISTS actors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login TEXT NOT NULL UNIQUE,
  avatar_url TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- REPOSITORY --

CREATE TABLE IF NOT EXISTS repos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  actor_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(actor_id)
      REFERENCES actors (actor_id)
);

-- EVENTS --

CREATE TABLE IF NOT EXISTS events (
id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  actor_id INTEGER NOT NULL,
  repo_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY(actor_id) REFERENCES actors (actor_id),
  FOREIGN KEY(repo_id) REFERENCES repos(repo_id)
);